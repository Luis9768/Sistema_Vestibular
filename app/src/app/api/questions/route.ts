import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { STUDY_CONTEXT, Question } from "@/lib/study-context";



export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "misto";
  const count = parseInt(searchParams.get("count") || "6", 10);

  // Filtra ou seleciona do banco de questões calibrado
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

  // Embaralha e seleciona quantidade
  const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, count);

  return NextResponse.json({
    questions: shuffled.length > 0 ? shuffled : STUDY_CONTEXT.questionBank.slice(0, count),
  });
}

export async function POST(req: Request) {
  try {
    const { topic = "regra de três e porcentagem", subject = "matematica", count = 5 } = await req.json();

    const prompt = `Você é um professor de cursinho pré-vestibular sênior elaborando questões no estilo da Faculdade SENAI / vestibulares técnicos.
Gere ${count} questões objetivas inéditas sobre o tema "${topic}" (disciplina: ${subject}).
Regras cruciais:
1. Questões diretas, com 4 alternativas (A, B, C, D).
2. Para matemática (ex: regra de três inversa, porcentagem com valor final, m², pitágoras 3-4-5), forneça o 'cursinhoShortcut' (atalho rápido sem enrolação) e o 'trapWarning' (aviso da pegadinha clássica).
3. Para português (ex: crase antes de verbo, conectivos de oposição/concessão, verbos fazer/haver impessoais), inclua a justificativa curta.

Retorne ESTRITAMENTE em formato JSON (um array de objetos):
[
  {
    "id": "q-1",
    "subject": "${subject}",
    "category": "${topic}",
    "question": "Enunciado da questão claro com dados numéricos ou texto",
    "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
    "correctIndex": 1,
    "explanation": "Explicação passo a passo da resposta",
    "cursinhoShortcut": "O atalho de ouro para resolver em 10 segundos",
    "trapWarning": "A pegadinha típica que a banca coloca para derrubar quem tem pressa"
  }
]`;

    try {
      const responseText = await callGemini(prompt);
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const generated = JSON.parse(cleaned);
      if (Array.isArray(generated) && generated.length > 0) {
        return NextResponse.json({ questions: generated });
      }
    } catch {
      // Fallback gracioso
    }

    // Retorna questões do banco local
    const fallbackQuestions = STUDY_CONTEXT.questionBank.slice(0, count);
    return NextResponse.json({ questions: fallbackQuestions });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao gerar questões" }, { status: 500 });
  }
}
