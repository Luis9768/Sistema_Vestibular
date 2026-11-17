import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { STUDY_CONTEXT } from "@/lib/study-context";



export async function POST(req: Request) {
  try {
    const { theme, text } = await req.json();

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "O texto da redação deve ter pelo menos 50 caracteres para ser avaliado." },
        { status: 400 }
      );
    }

    // Tenta avaliação profunda com Gemini se disponível
    const prompt = `Você é um corretor sênior de redação de vestibular técnico e Faculdade SENAI (nos moldes do ENEM, escala de 0 a 1000 dividida em 5 competências de 0 a 200).
Tema da Redação: "${theme || "Tema livre / Vestibular Técnico"}"

Redação do aluno:
"""
${text}
"""

Conhecimento do aluno e regras que ele aprendeu no cursinho:
- O aluno usa um esqueleto com CF/88 na introdução, Thomas Hobbes no D1, causas (falta de investimentos e qualificação), e proposta na conclusão com Governo Federal e SENAI.
- Erros a pontuar com precisão: crase antes de verbo (-ar, -er, -ir), verbos haver/fazer no plural incorreto, períodos únicos por parágrafo, ausência de conectivos.
- Vocabulário sofisticado a recomendar: mitigar, contemporaneidade, imperioso, entrave, fito.

Retorne ESTRITAMENTE em formato JSON sem markdown ou texto extra:
{
  "totalScore": 880,
  "competencies": {
    "c1": 160,
    "c2": 180,
    "c3": 180,
    "c4": 180,
    "c5": 180
  },
  "verdict": "Aprovado com excelente pontuação" | "Bom desempenho com pequenos ajustes" | "Necessita de revisão",
  "generalFeedback": "Comentário geral claro e motivador em 2 ou 3 frases objetivas.",
  "detectedErrors": [
    { "type": "Gramática/Grafia", "text": "trecho com erro", "fix": "correção recomendada", "explanation": "por que errou" }
  ],
  "skeletonCheck": {
    "hasIntroductionAndThesis": true,
    "hasRepertoire": true,
    "hasThomasHobbes": true,
    "hasFiveElementsConclusion": true
  },
  "vocabSuggestions": [
    { "original": "problema", "replacement": "entrave / impasse", "context": "Substitua no 2º parágrafo" }
  ],
  "polishedRewrite": "Versão completa reescrita do texto do aluno em norma culta mantendo todas as ideias dele."
}`;

    try {
      const responseText = await callGemini(prompt);
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      // Heurística local rápida baseada nas regras do cursinho
      return NextResponse.json(analyzeEssayLocally(text, theme));
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro interno ao processar redação" }, { status: 500 });
  }
}

function analyzeEssayLocally(text: string, theme: string) {
  const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);
  const detectedErrors: Array<{ type: string; text: string; fix: string; explanation: string }> = [];

  // Check C1: Crase before verb
  const craseBeforeVerbMatch = text.match(/à\s+([a-záéíóúâêôãõ]+[a-z]*(ar|er|ir)\b)/gi);
  if (craseBeforeVerbMatch) {
    craseBeforeVerbMatch.forEach((m) => {
      detectedErrors.push({
        type: "Crase Proibida",
        text: m,
        fix: m.replace(/à/i, "a"),
        explanation: "NUNCA use crase antes de verbos terminados em -ar, -er, -ir.",
      });
    });
  }

  // Check C1: Fazem anos / Haviam pessoas
  if (/fazem\s+(muitos|dois|três|quatro|\d+)\s+anos/i.test(text)) {
    detectedErrors.push({
      type: "Concordância Verbal",
      text: "fazem ... anos",
      fix: "faz ... anos",
      explanation: "O verbo FAZER indicando tempo decorrido é impessoal e não vai para o plural.",
    });
  }
  if (/haviam\s+(muitos|vários|alunos|candidatos|vagas)/i.test(text)) {
    detectedErrors.push({
      type: "Concordância Verbal",
      text: "haviam ...",
      fix: "havia ...",
      explanation: "O verbo HAVER no sentido de existir não tem plural.",
    });
  }

  // Check Skeleton presence
  const hasCF88 = /constitui[çc][ãa]o\s+federal|carta\s+magna/i.test(text);
  const hasHobbes = /thomas\s+hobbes|hobbes/i.test(text);
  const hasConnectives = /em\s+primeiro\s+plano|ademais|contudo|portanto/i.test(text);
  const hasSenaiGov = /governo\s+federal|senai|minist[ée]rio/i.test(text);

  let c1 = 160;
  if (detectedErrors.length > 2) c1 = 120;
  else if (detectedErrors.length === 0) c1 = 180;

  const c2 = hasCF88 ? (hasHobbes ? 200 : 180) : 140;
  const c3 = paragraphs.length >= 4 ? 180 : paragraphs.length >= 3 ? 140 : 100;
  const c4 = hasConnectives ? 180 : 120;
  const c5 = hasSenaiGov ? 200 : 140;

  const totalScore = c1 + c2 + c3 + c4 + c5;

  return {
    totalScore,
    competencies: { c1, c2, c3, c4, c5 },
    verdict:
      totalScore >= 800
        ? "Aprovado com excelente pontuação"
        : totalScore >= 650
        ? "Bom desempenho com pequenos ajustes"
        : "Necessita de revisão estrutural",
    generalFeedback:
      totalScore >= 850
        ? "Texto muito bem estruturado! O esqueleto foi aplicado com autoridade e os conectivos garantiram excelente fluidez."
        : "Bom texto! Preste atenção nos desvios gramaticais apontados e garanta todos os 5 elementos na conclusão.",
    detectedErrors,
    skeletonCheck: {
      hasIntroductionAndThesis: hasCF88,
      hasRepertoire: hasCF88 || hasHobbes,
      hasThomasHobbes: hasHobbes,
      hasFiveElementsConclusion: hasSenaiGov,
    },
    vocabSuggestions: STUDY_CONTEXT.vocabulary.slice(0, 4).map((v) => ({
      original: v.common,
      replacement: v.sophisticated,
      context: `Troque termos informais por expressões formais como "${v.sophisticated.split("/")[0].trim()}".`,
    })),
    polishedRewrite:
      "A Constituição Federal de 1988 assegura a todos os cidadãos o direito ao pleno desenvolvimento social. Contudo, ao analisar a realidade contemporânea, percebe-se que essa garantia ainda encontra severos entraves práticos no país. Esse cenário decorre tanto da carência de investimentos públicos quanto da escassez de qualificação técnica especializada.\n\nEm primeiro plano, é imperioso destacar que a ausência de aportes técnicos atua como raiz desse entrave. Segundo o filósofo Thomas Hobbes, cabe ao Estado zelar pelo bem comum; todavia, a omissão governamental gera prejuízos e exclusão social para a população trabalhadora.\n\nAdemais, a falta de preparo técnico aprofunda esse abismo socioeconômico. No cenário atual, a rápida automação industrial sem o devido suporte educacional resulta em elevado desemprego estrutural e vulnerabilidade.\n\nPortanto, cabe ao Governo Federal implementar planos nacionais de capacitação técnica, por meio de cursos gratuitos em parceria estratégica com o SENAI, a fim de viabilizar a adaptação e a empregabilidade dos trabalhadores. Assim, a prática nacional se aproximará do ideal constitucional.",
  };
}
