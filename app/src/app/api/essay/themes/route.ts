import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";



const RECURRENT_THEMES = [
  {
    id: "tema-1",
    title: "A transição para a indústria verde e o desafio do desenvolvimento sustentável no Brasil",
    axis: "Indústria & Meio Ambiente",
    motivators: [
      "A descarbonização do parque fabril brasileiro exige pesados investimentos em tecnologias limpas e eficiência energética.",
      "A matriz elétrica nacional é predominantemente limpa, mas os maquinários operacionais ainda apresentam obsolescência e alto consumo.",
      "A escassez de profissionais habilitados em gestão de resíduos retarda a transição ecológica industrial."
    ],
    hint: "Use o esqueleto: CF/88 no início + Causa 1 (falta de investimentos) + Causa 2 (falta de qualificação) + Thomas Hobbes + Proposta com Governo Federal e SENAI."
  },
  {
    id: "tema-2",
    title: "Os impactos da Inteligência Artificial e da automação no futuro do trabalho e na indústria brasileira",
    axis: "Tecnologia & Trabalho",
    motivators: [
      "A Quarta Revolução Industrial substitui tarefas repetitivas e operacionais em ritmo acelerado por algoritmos inteligentes.",
      "Segundo o Fórum Econômico Mundial, milhões de postos serão transformados, demandando requalificação analítica e técnica urgente.",
      "O abismo educacional brasileiro ameaça aprofundar o desemprego estrutural entre trabalhadores menos escolarizados."
    ],
    hint: "Enfatize o desemprego estrutural no D1 (Hobbes e omissão) e a exclusão da massa trabalhadora no D2. Conclua com capacitação tecnológica gratuita."
  },
  {
    id: "tema-3",
    title: "A valorização do ensino técnico e a qualificação profissional para a reindustrialização nacional",
    axis: "Educação & Economia",
    motivators: [
      "Países desenvolvidos possuem mais de 40% dos jovens cursando ensino técnico, enquanto no Brasil a taxa ainda não ultrapassa 15%.",
      "As indústrias modernas enfrentam carência de operadores especializados, programadores CNC e técnicos em mecatrônica.",
      "A desinformação e o preconceito cultural com cursos técnicos afastam jovens de carreiras de alta remuneração e rápida inserção."
    ],
    hint: "Mostre como a falta de investimentos técnicos gera um déficit de mão de obra e aponte o SENAI como parceiro estratégico na proposta de intervenção."
  },
  {
    id: "tema-4",
    title: "A ética algorítmica e a proteção de dados na sociedade digitalizada",
    axis: "Tecnologia & Cidadania",
    motivators: [
      "A coleta maciça de dados pessoais por corporações expõe usuários a riscos de manipulação comportamental e vazamento de informações.",
      "A Lei Geral de Proteção de Dados (LGPD) busca garantir direitos, mas ainda encontra entraves de fiscalização no país.",
      "A opacidade dos algoritmos pode reproduzir preconceitos e discriminações contra grupos vulneráveis."
    ],
    hint: "Cite a CF/88 no direito à privacidade e cidadania. Argumente sobre a falta de fiscalização e a carência de letramento digital da população."
  }
];

export async function GET() {
  return NextResponse.json({ themes: RECURRENT_THEMES });
}

export async function POST(req: Request) {
  try {
    const { axis } = await req.json().catch(() => ({}));

    const prompt = `Gere uma proposta de redação inédita de vestibular técnico / Faculdade SENAI voltada ao eixo: ${axis || "Indústria 4.0, Tecnologia e Sustentabilidade"}.
Retorne ESTRITAMENTE em formato JSON sem markdown adicional:
{
  "id": "tema-ia-novo",
  "title": "Título claro e dissertativo do tema",
  "axis": "Eixo temático",
  "motivators": [
    "Texto motivador 1 com dados ou fato",
    "Texto motivador 2",
    "Texto motivador 3"
  ],
  "hint": "Dica prática de como aplicar o esqueleto (CF/88, Hobbes, Causa 1 e Causa 2)"
}`;

    try {
      const responseText = await callGemini(prompt);
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const generated = JSON.parse(cleaned);
      return NextResponse.json({ theme: generated });
    } catch {
      // Fallback dinâmico caso API esteja indisponível
      const randomFallback = RECURRENT_THEMES[Math.floor(Math.random() * RECURRENT_THEMES.length)];
      return NextResponse.json({ theme: randomFallback });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro ao gerar tema" }, { status: 500 });
  }
}
