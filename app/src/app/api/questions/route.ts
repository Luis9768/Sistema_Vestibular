import { NextResponse } from "next/server";
import { callGemini, parseJson } from "@/lib/gemini";
import { STUDY_CONTEXT, Question } from "@/lib/study-context";

// Tópicos além do que foi estudado, para variar o treino.
const EXTRA_TOPICS: Record<"portugues" | "matematica", string[]> = {
  matematica: [
    "juros simples e compostos aplicados à indústria",
    "equação do 2º grau (soma e produto das raízes)",
    "progressão aritmética (PA) em produção diária",
    "probabilidade com dados, moedas e peças defeituosas",
    "razão e proporção em escalas e misturas",
    "regra de três composta",
    "leitura de gráficos e tabelas de produção",
    "volume de cilindro, cubo e paralelepípedo (tanques e caixas)",
    "conversão de unidades (km/h, m/s, litros, m³)",
    "funções do 1º grau (custo fixo + variável)",
    "mínimo múltiplo comum (MMC) em manutenção periódica",
    "porcentagem sucessiva (aumento seguido de desconto)",
  ],
  portugues: [
    "interpretação de texto com inferência",
    "regência verbal (assistir, obedecer, preferir, visar)",
    "uso de por que / porque / por quê / porquê",
    "pontuação: vírgula, ponto e vírgula e dois-pontos",
    "figuras de linguagem (metáfora, metonímia, ironia)",
    "pronomes e colocação pronominal",
    "tipologia e gêneros textuais (e-mail profissional, ofício)",
    "reescrita de frases mantendo o sentido",
    "mas / mais, a / há, afim / a fim",
    "sujeito, predicado e funções sintáticas",
    "coesão: retomada por pronomes e sinônimos",
    "ortografia e acentuação gráfica",
  ],
};

function pick<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "misto";
  const count = parseInt(searchParams.get("count") || "6", 10);

  let filtered = STUDY_CONTEXT.questionBank;
  if (category === "portugues") {
    filtered = filtered.filter((q) => q.subject === "portugues");
  } else if (category === "matematica") {
    filtered = filtered.filter((q) => q.subject === "matematica");
  } else if (category !== "misto") {
    filtered = filtered.filter((q) =>
      q.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  const selected = pick(filtered.length > 0 ? filtered : STUDY_CONTEXT.questionBank, count);
  return NextResponse.json({ questions: selected });
}

export async function POST(req: Request) {
  try {
    const {
      topic = "",
      subject = "misto",
      count = 6,
      mode = "variado", // "estudado" | "variado"
      difficulty = "media",
    } = await req.json().catch(() => ({}));

    // Define os temas da rodada
    let topics: string[];
    if (mode === "estudado" && topic) {
      topics = [topic];
    } else {
      const mat = pick(EXTRA_TOPICS.matematica, subject === "portugues" ? 0 : 3);
      const por = pick(EXTRA_TOPICS.portugues, subject === "matematica" ? 0 : 3);
      topics = [...mat, ...por];
    }

    const seed = Math.floor(Math.random() * 100000);
    const prompt = `Você é professor sênior de cursinho elaborando questões inéditas no estilo da Faculdade SENAI / vestibulares técnicos (contexto de indústria, manutenção, produção, tecnologia).
Gere ${count} questões objetivas, dificuldade ${difficulty}, distribuídas entre estes tópicos: ${topics.join("; ")}.
Variação obrigatória (semente ${seed}): use números, nomes de peças/máquinas e situações DIFERENTES a cada rodada. Não repita enunciados clássicos.
Regras:
- 4 alternativas; apenas uma correta; distratores baseados em erros comuns (ex.: valor do desconto em vez do valor final).
- "correctIndex" é o índice (0 a 3) da alternativa correta. Confira a conta antes de responder.
- "explanation": passo a passo curto.
- "cursinhoShortcut": atalho para resolver rápido.
- "trapWarning": pegadinha típica da banca nessa questão.
Retorne SOMENTE um array JSON:
[{"id":"q-${seed}-1","subject":"matematica|portugues","category":"tópico","question":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"...","cursinhoShortcut":"...","trapWarning":"..."}]`;

    try {
      const raw = await callGemini(prompt);
      const generated = parseJson<Question[]>(raw);
      const valid = generated.filter(
        (q) =>
          q?.question &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          Number.isInteger(q.correctIndex) &&
          q.correctIndex >= 0 &&
          q.correctIndex <= 3
      );
      if (valid.length > 0) {
        return NextResponse.json({ questions: valid, source: "ia" });
      }
    } catch {
      // cai no banco local abaixo
    }

    return NextResponse.json({
      questions: pick(STUDY_CONTEXT.questionBank, count),
      source: "banco-local",
    });
  } catch {
    return NextResponse.json({ error: "Erro ao gerar questões" }, { status: 500 });
  }
}
