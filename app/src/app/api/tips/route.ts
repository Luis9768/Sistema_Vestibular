import { NextResponse } from "next/server";
import { callGemini, parseJson } from "@/lib/gemini";

type WrongItem = { category: string; question: string; chosen: string; correct: string };

type Body = {
  wrong?: WrongItem[];
  correctCount?: number;
  total?: number;
  essayScore?: number;
  essayWeakPoints?: string[];
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json().catch(() => ({}));
    const wrong = body.wrong ?? [];
    const cats = Array.from(new Set(wrong.map((w) => w.category)));

    const prompt = `Você é um mentor de cursinho pré-vestibular (Faculdade SENAI). Dê dicas CURTAS e práticas de como melhorar.
Dados do aluno:
- Acertos no simulado: ${body.correctCount ?? 0} de ${body.total ?? 0}
- Categorias com erro: ${cats.join(", ") || "nenhuma"}
- Questões erradas: ${JSON.stringify(wrong.slice(0, 6))}
- Nota da última redação: ${body.essayScore ?? "não enviada"}
- Pontos fracos na redação: ${(body.essayWeakPoints ?? []).join("; ") || "não informados"}
Responda SOMENTE em JSON:
{"resumo":"1 frase sobre o desempenho","dicas":[{"titulo":"curto","acao":"o que fazer, em 1-2 frases","tempo":"ex.: 10 min"}],"proximoTreino":"o que treinar agora"}
Máximo 4 dicas, específicas ao erro cometido (cite o padrão do erro e um macete para não repetir).`;

    try {
      const raw = await callGemini(prompt);
      return NextResponse.json({ ...parseJson<object>(raw), source: "ia" });
    } catch {
      const dicas = wrong.slice(0, 4).map((w) => ({
        titulo: w.category,
        acao: `Releia a explicação da questão sobre ${w.category} e refaça uma parecida sem olhar o gabarito.`,
        tempo: "10 min",
      }));
      return NextResponse.json({
        resumo: `Você acertou ${body.correctCount ?? 0} de ${body.total ?? 0}.`,
        dicas:
          dicas.length > 0
            ? dicas
            : [{ titulo: "Mantenha o ritmo", acao: "Suba a dificuldade e treine tópicos novos.", tempo: "15 min" }],
        proximoTreino: cats[0] ?? "Simulado variado",
        source: "local",
      });
    }
  } catch {
    return NextResponse.json({ error: "Erro ao gerar dicas" }, { status: 500 });
  }
}
