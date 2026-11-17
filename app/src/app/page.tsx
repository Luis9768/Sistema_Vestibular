"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  PenTool,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  Check,
  X,
  Copy,
  ChevronRight,
  TrendingUp,
  Brain,
  Award,
  Clock,
  Layers,
} from "lucide-react";
import { STUDY_CONTEXT, Question } from "@/lib/study-context";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "redacao" | "simulado" | "esqueleto">("dashboard");

  // Dashboard Stats (com persistência em localStorage)
  const [stats, setStats] = useState({
    questionsAnswered: 16,
    questionsCorrect: 13,
    essaysGraded: 3,
    lastEssayScore: 920,
    topStrengths: ["Proporção Inversa", "Área (m²)", "Repertório CF/88", "Interpretação"],
    topAlerts: ["Crase antes de Verbo", "Verbo Haver no Singular", "Média com Meta"],
  });

  useEffect(() => {
    const saved = localStorage.getItem("vestibular_stats");
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveStats = (newStats: typeof stats) => {
    setStats(newStats);
    localStorage.setItem("vestibular_stats", JSON.stringify(newStats));
  };

  // --- REDAÇÃO STATE ---
  const [themes, setThemes] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [essayText, setEssayText] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [gradingResult, setGradingResult] = useState<any>(null);

  useEffect(() => {
    fetch("/api/essay/themes")
      .then((res) => res.json())
      .then((data) => {
        if (data.themes) {
          setThemes(data.themes);
          setSelectedTheme(data.themes[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleGenerateNewTheme = async () => {
    setIsGeneratingTheme(true);
    try {
      const res = await fetch("/api/essay/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.theme) {
        setThemes((prev) => [data.theme, ...prev]);
        setSelectedTheme(data.theme);
      }
    } catch {
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  const handlePasteSkeleton = () => {
    const template = `A Constituição Federal de 1988 assegura o direito ao pleno desenvolvimento de todos. Contudo, ao analisar ${
      selectedTheme ? selectedTheme.title : "o tema proposto"
    }, percebe-se que essa garantia não se cumpre na prática. Esse cenário decorre tanto da falta de investimentos quanto da falta de qualificação.\n\nEm primeiro plano, a falta de investimentos atua como raiz desse entrave. Segundo o filósofo Thomas Hobbes, cabe ao Estado zelar pelo bem comum; todavia, a omissão governamental gera prejuízos e exclusão para a população.\n\nAdemais, a falta de qualificação intensifica esse abismo. Na contemporaneidade, a ausência de preparo técnico resulta em desemprego elevado e marginalização dos trabalhadores.\n\nPortanto, cabe ao Governo Federal criar planos de capacitação técnica, por meio de cursos gratuitos em parceria com o SENAI, a fim de garantir a empregabilidade dos trabalhadores. Assim, a realidade se aproximará da Constituição.`;
    setEssayText(template);
  };

  const handleGradeEssay = async () => {
    if (!essayText.trim()) return;
    setIsGrading(true);
    setGradingResult(null);

    try {
      const res = await fetch("/api/essay/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: selectedTheme?.title || "Vestibular SENAI",
          text: essayText,
        }),
      });
      const data = await res.json();
      setGradingResult(data);

      if (data.totalScore) {
        const newStats = {
          ...stats,
          essaysGraded: stats.essaysGraded + 1,
          lastEssayScore: data.totalScore,
        };
        saveStats(newStats);
      }
    } catch {
    } finally {
      setIsGrading(false);
    }
  };

  // --- SIMULADO STATE ---
  const [questions, setQuestions] = useState<Question[]>(STUDY_CONTEXT.questionBank);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [simuladoCategory, setSimuladoCategory] = useState("misto");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const fetchQuestions = async (category: string) => {
    setIsLoadingQuestions(true);
    setSelectedAnswers({});
    setIsSubmitted(false);
    try {
      const res = await fetch(`/api/questions?category=${category}&count=6`);
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch {
      setQuestions(STUDY_CONTEXT.questionBank);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const [tips, setTips] = useState<any>(null);
  const [isLoadingTips, setIsLoadingTips] = useState(false);

  const handleGenerateQuestionsAI = async (categoryOverride?: string) => {
    const cat = typeof categoryOverride === "string" ? categoryOverride : simuladoCategory;
    setIsLoadingQuestions(true);
    setSelectedAnswers({});
    setIsSubmitted(false);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);

    try {
      const studied = cat !== "variado";
      const subject =
        cat === "crase" || cat === "conectivos"
          ? "portugues"
          : cat === "misto" || cat === "variado"
          ? "misto"
          : "matematica";

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          mode: studied ? "estudado" : "variado",
          topic: studied ? (cat === "misto" ? "regra de três, porcentagem, geometria, crase e conectivos" : cat) : "",
          subject,
          count: 6,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch {
      // mantém as questões atuais se a IA falhar ou demorar demais
    } finally {
      clearTimeout(timer);
      setIsLoadingQuestions(false);
    }
  };

  const handleSubmitSimulado = async () => {
    setIsSubmitted(true);
    let correct = 0;
    const wrong: { category: string; question: string; chosen: string; correct: string }[] = [];

    questions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      if (chosen === q.correctIndex) {
        correct++;
      } else {
        wrong.push({
          category: q.category,
          question: q.question,
          chosen: chosen !== undefined ? q.options[chosen] : "(em branco)",
          correct: q.options[q.correctIndex],
        });
      }
    });

    const newStats = {
      ...stats,
      questionsAnswered: stats.questionsAnswered + questions.length,
      questionsCorrect: stats.questionsCorrect + correct,
    };
    saveStats(newStats);

    setIsLoadingTips(true);
    setTips(null);
    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wrong,
          correctCount: correct,
          total: questions.length,
          essayScore: stats.lastEssayScore,
        }),
      });
      setTips(await res.json());
    } catch {
    } finally {
      setIsLoadingTips(false);
    }
  };

  // --- ESQUELETO TRAINER STATE ---
  const [vocabSearch, setVocabSearch] = useState("");
  const [hiddenSkeletonWord, setHiddenSkeletonWord] = useState(false);

  const wordsCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const paragraphsCount = essayText.trim() ? essayText.trim().split(/\n+/).filter((p) => p.trim()).length : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-950 flex items-center justify-center font-mono font-bold text-sm tracking-wider">
              VA
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100 tracking-tight">Vestibular AI</div>
              <div className="text-[11px] text-zinc-400 font-mono">Faculdade SENAI Edition</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "dashboard"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("redacao")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "redacao"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Redação com IA</span>
            </button>
            <button
              onClick={() => setActiveTab("simulado")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "simulado"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simulador</span>
            </button>
            <button
              onClick={() => setActiveTab("esqueleto")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "esqueleto"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Esqueleto & Dicas</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* ===================== TAB 1: DASHBOARD ===================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-900">
              <div>
                <h1 className="text-xl font-medium tracking-tight text-zinc-100">Visão Geral de Desempenho</h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Métricas sincronizadas com seu histórico de estudos e vestibulares recentes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Reta Final de Prova
                </span>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Card 1: Score da Redação */}
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs uppercase tracking-wider font-mono">Última Redação</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="my-3">
                  <div className="text-3xl font-semibold tracking-tight text-zinc-100">
                    {stats.lastEssayScore} <span className="text-sm font-normal text-zinc-500">/ 1000</span>
                  </div>
                  <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Evolução de +320 pts desde o início</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("redacao")}
                  className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 mt-1 transition-colors"
                >
                  <span>Escrever nova</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 2: Taxa de Acerto */}
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs uppercase tracking-wider font-mono">Precisão Objetiva</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="my-3">
                  <div className="text-3xl font-semibold tracking-tight text-zinc-100">
                    {Math.round((stats.questionsCorrect / (stats.questionsAnswered || 1)) * 100)}%
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {stats.questionsCorrect} acertos de {stats.questionsAnswered} resolvidas
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("simulado")}
                  className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 mt-1 transition-colors"
                >
                  <span>Iniciar treino</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 3: Redações Corrigidas */}
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs uppercase tracking-wider font-mono">Redações Praticadas</span>
                  <PenTool className="w-4 h-4 text-sky-400" />
                </div>
                <div className="my-3">
                  <div className="text-3xl font-semibold tracking-tight text-zinc-100">{stats.essaysGraded}</div>
                  <div className="text-xs text-zinc-400 mt-1">Todas validadas com esqueleto</div>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">Padrão ENEM / SENAI</span>
              </div>

              {/* Card 4: Foco Estratégico */}
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs uppercase tracking-wider font-mono">Meta de Vagas</span>
                  <Brain className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="my-3">
                  <div className="text-lg font-medium tracking-tight text-zinc-100">Faculdade SENAI</div>
                  <div className="text-xs text-emerald-400 mt-1">Pontuação acima do corte</div>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">Sprint Final</span>
              </div>
            </div>

            {/* Sub-grid: Pontos Fortes vs Pegadinhas Críticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-medium text-zinc-200">Conteúdos Blindados (Pontos Fortes)</h2>
                </div>
                <div className="space-y-2.5">
                  {stats.topStrengths.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs"
                    >
                      <span className="text-zinc-200">{item}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded">
                        100% Acerto
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-medium text-zinc-200">Atenção Máxima para Hoje (Caderno de Erros)</h2>
                </div>
                <div className="space-y-2.5">
                  {stats.topAlerts.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs"
                    >
                      <span className="text-zinc-200">{item}</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-900 px-2 py-0.5 rounded">
                        Lembrar na prova
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: REDAÇÃO COM IA ===================== */}
        {activeTab === "redacao" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-900">
              <div>
                <h1 className="text-xl font-medium tracking-tight text-zinc-100">Redação com Inteligência Artificial</h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Temas do SENAI, apoio ao esqueleto e avaliação instantânea (0 a 1000).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateNewTheme}
                  disabled={isGeneratingTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-200 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isGeneratingTheme ? "Gerando..." : "Gerar Novo Tema com IA"}</span>
                </button>
              </div>
            </div>

            {/* Theme Selector Banner */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                    {selectedTheme?.axis || "Tema Recorrente"}
                  </span>
                  <span className="text-xs text-zinc-400">Focado na Faculdade SENAI</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-zinc-400">Alternar tema:</span>
                  <select
                    value={selectedTheme?.id || ""}
                    onChange={(e) => {
                      const t = themes.find((item) => item.id === e.target.value);
                      if (t) setSelectedTheme(t);
                    }}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded px-2 py-1 outline-none"
                  >
                    {themes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title.slice(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="text-base font-semibold text-zinc-100 leading-snug">{selectedTheme?.title}</h2>

              {selectedTheme?.motivators && (
                <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/60 space-y-1.5">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Textos Motivadores (Síntese):</div>
                  <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
                    {selectedTheme.motivators.map((m: string, i: number) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Writing Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                  <span>
                    Palavras: <strong className="text-zinc-200">{wordsCount}</strong>
                  </span>
                  <span>
                    Parágrafos: <strong className="text-zinc-200">{paragraphsCount} / 4</strong>
                  </span>
                </div>
                <button
                  onClick={handlePasteSkeleton}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Preencher Esqueleto Rápido</span>
                </button>
              </div>

              <textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Escreva ou cole sua redação aqui com 4 parágrafos (Introdução, D1, D2 e Conclusão)..."
                rows={14}
                className="w-full p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 text-zinc-100 text-sm leading-relaxed placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all font-mono"
              />

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  onClick={() => setEssayText("")}
                  className="px-4 py-2 rounded-lg border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                >
                  Limpar
                </button>
                <button
                  onClick={handleGradeEssay}
                  disabled={isGrading || !essayText.trim()}
                  className="px-5 py-2 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                  <span>{isGrading ? "Avaliando com IA..." : "Avaliar Redação (Nota 0-1000)"}</span>
                </button>
              </div>
            </div>

            {/* Result Report */}
            {gradingResult && (
              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-zinc-400">Veredito da Banca</span>
                    <h3 className="text-xl font-semibold text-zinc-100">{gradingResult.verdict}</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xl">{gradingResult.generalFeedback}</p>
                  </div>
                  <div className="text-right bg-zinc-950 px-5 py-3 rounded-xl border border-zinc-800">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">Nota Total</span>
                    <div className="text-3xl font-bold tracking-tight text-emerald-400">
                      {gradingResult.totalScore}
                      <span className="text-xs font-normal text-zinc-500"> / 1000</span>
                    </div>
                  </div>
                </div>

                {/* 5 Competencies Progress */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Desempenho por Competência (ENEM / SENAI):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {Object.entries(gradingResult.competencies || {}).map(([key, val]: [string, any], i) => (
                      <div key={key} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-mono text-zinc-400">Comp. {i + 1}</span>
                          <span className="font-semibold text-zinc-200">{val} / 200</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              val >= 160 ? "bg-emerald-400" : val >= 120 ? "bg-amber-400" : "bg-rose-400"
                            }`}
                            style={{ width: `${(val / 200) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detected Errors & Fixes */}
                {gradingResult.detectedErrors && gradingResult.detectedErrors.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Pontos Críticos para Corrigir:
                    </h4>
                    <div className="space-y-2">
                      {gradingResult.detectedErrors.map((err: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs flex items-start gap-2.5"
                        >
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-rose-300">{err.type}: </span>
                            <span className="text-zinc-300">{err.explanation}</span>
                            {err.fix && (
                              <div className="text-[11px] font-mono text-zinc-400 mt-1">
                                Troque: <del className="text-rose-400">{err.text}</del> por{" "}
                                <ins className="text-emerald-400 no-underline font-semibold">{err.fix}</ins>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {gradingResult.improvementTips && gradingResult.improvementTips.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Como subir sua nota no próximo texto:
                    </h4>
                    <div className="space-y-2">
                      {gradingResult.improvementTips.map((t: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs flex items-start gap-2.5"
                        >
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="text-zinc-300">
                            <span className="font-mono text-zinc-400">{t.competency}</span>
                            <span className="mx-1.5 text-zinc-600">•</span>
                            {t.tip}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Polished Rewrite */}
                {gradingResult.polishedRewrite && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Sugestão de Reescrita Lapidada (Padrão 950+):
                    </h4>
                    <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-line">
                      {gradingResult.polishedRewrite}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: SIMULADOR ===================== */}
        {activeTab === "simulado" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-900">
              <div>
                <h1 className="text-xl font-medium tracking-tight text-zinc-100">Simulador de Questões com IA</h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Treino dinâmico: use "Variado" para tópicos novos além do que estudamos.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={simuladoCategory}
                  onChange={(e) => {
                    setSimuladoCategory(e.target.value);
                    setTips(null);
                    if (e.target.value === "variado") {
                      handleGenerateQuestionsAI(e.target.value);
                    } else {
                      fetchQuestions(e.target.value);
                    }
                  }}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 outline-none"
                >
                  <option value="variado">Variado com IA (tópicos novos)</option>
                  <option value="misto">Revisão: Misto do que estudamos</option>
                  <option value="regra de três">Regra de Três (Direta e Inversa)</option>
                  <option value="porcentagem">Porcentagem e Valor Final</option>
                  <option value="geometria">Geometria Plana (m² e Cerca)</option>
                  <option value="crase">Crase (Verbo e Regência)</option>
                  <option value="conectivos">Conectivos (Oposição e Concessão)</option>
                </select>

                <button
                  onClick={() => {
                    setTips(null);
                    handleGenerateQuestionsAI();
                  }}
                  disabled={isLoadingQuestions}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-200 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isLoadingQuestions ? "Gerando..." : "Gerar com IA"}</span>
                </button>
              </div>
            </div>

            {isLoadingQuestions && (
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-300 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Gerando questões inéditas com IA. Costuma levar de 3 a 10 segundos.
              </div>
            )}

            {/* Questions List */}
            <div className={`space-y-6 transition-opacity ${isLoadingQuestions ? "opacity-40" : ""}`}>
              {questions.map((q, idx) => {
                const userSelected = selectedAnswers[q.id];
                const isAnswered = userSelected !== undefined;
                const isCorrect = userSelected === q.correctIndex;

                return (
                  <div
                    key={q.id || idx}
                    className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-4"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-400">
                        Questão {idx + 1} de {questions.length} •{" "}
                        <span className="uppercase text-zinc-300 font-semibold">{q.category}</span>
                      </span>
                      {isSubmitted && (
                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded font-semibold ${
                            isCorrect
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                              : "bg-rose-950 text-rose-400 border border-rose-900"
                          }`}
                        >
                          {isCorrect ? "Acertou" : "Errou"}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-zinc-200 leading-relaxed font-medium">{q.question}</p>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userSelected === optIdx;
                        const isTheCorrectOne = optIdx === q.correctIndex;

                        let buttonStyle = "border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-300";
                        if (isSubmitted) {
                          if (isTheCorrectOne) {
                            buttonStyle = "border-emerald-600 bg-emerald-950/40 text-emerald-200 font-medium";
                          } else if (isChosen && !isTheCorrectOne) {
                            buttonStyle = "border-rose-600 bg-rose-950/40 text-rose-200";
                          } else {
                            buttonStyle = "border-zinc-850 opacity-40 text-zinc-500";
                          }
                        } else if (isChosen) {
                          buttonStyle = "border-zinc-400 bg-zinc-800 text-white font-medium";
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isSubmitted}
                            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`p-3 rounded-lg border text-xs text-left transition-all flex items-start gap-2.5 ${buttonStyle}`}
                          >
                            <span className="font-mono font-bold shrink-0 text-zinc-400">
                              {String.fromCharCode(65 + optIdx)})
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback & Shortcuts after submit */}
                    {isSubmitted && (
                      <div className="mt-3 p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs">
                        <div className="text-zinc-300">
                          <strong className="text-zinc-100">Explicação: </strong>
                          {q.explanation}
                        </div>
                        {q.cursinhoShortcut && (
                          <div className="flex items-start gap-2 text-emerald-300 bg-emerald-950/30 p-2 rounded border border-emerald-900/40">
                            <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                            <span>
                              <strong>Atalho do Cursinho:</strong> {q.cursinhoShortcut}
                            </span>
                          </div>
                        )}
                        {q.trapWarning && (
                          <div className="flex items-start gap-2 text-amber-300 bg-amber-950/30 p-2 rounded border border-amber-900/40">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                            <span>
                              <strong>Alerta de Pegadinha:</strong> {q.trapWarning}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <span className="text-xs text-zinc-400">
                Respondidas: <strong>{Object.keys(selectedAnswers).length}</strong> de{" "}
                <strong>{questions.length}</strong>
              </span>

              <div className="flex items-center gap-3">
                {isSubmitted ? (
                  <button
                    onClick={() => {
                      setTips(null);
                      handleGenerateQuestionsAI();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-100 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Novo Simulado</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitSimulado}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5 text-zinc-950" />
                    <span>Confirmar e Avaliar Respostas</span>
                  </button>
                )}
              </div>
            </div>

            {(isLoadingTips || tips) && (
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-medium text-zinc-100">Como melhorar (dicas da IA)</h3>
                </div>
                {isLoadingTips && <p className="text-xs text-zinc-400">Analisando seus erros...</p>}
                {tips && (
                  <div className="space-y-3">
                    {tips.resumo && <p className="text-xs text-zinc-300">{tips.resumo}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {(tips.dicas || []).map((d: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-zinc-100">{d.titulo}</span>
                            {d.tempo && <span className="font-mono text-[10px] text-zinc-400">{d.tempo}</span>}
                          </div>
                          <p className="text-zinc-300 leading-relaxed">{d.acao}</p>
                        </div>
                      ))}
                    </div>
                    {tips.proximoTreino && (
                      <p className="text-xs text-emerald-400">
                        <strong>Próximo treino:</strong> {tips.proximoTreino}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: ESQUELETO & DICAS ===================== */}
        {activeTab === "esqueleto" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-900">
              <div>
                <h1 className="text-xl font-medium tracking-tight text-zinc-100">Treinador do Esqueleto & Vocabulário</h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Decore o modelo em 3 minutos e domine palavras sofisticadas para a banca.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHiddenSkeletonWord(!hiddenSkeletonWord)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
                >
                  {hiddenSkeletonWord ? "Mostrar Texto Completo" : "Modo Ocultar Frases (Testar Memória)"}
                </button>
              </div>
            </div>

            {/* Skeleton 4 Blocks */}
            <div className="space-y-4">
              {STUDY_CONTEXT.skeleton.map((part) => (
                <div key={part.number} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-zinc-800 text-zinc-200 font-mono text-xs flex items-center justify-center font-bold">
                        {part.number}
                      </span>
                      <h3 className="text-sm font-semibold text-zinc-100">{part.title}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400">{part.triggerPhrase}</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-200 leading-relaxed font-mono">
                    {hiddenSkeletonWord
                      ? part.template.replace(/falta de investimentos|falta de qualificação|Thomas Hobbes/g, "_______")
                      : part.template}
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] text-zinc-400">
                    {part.tips.map((t, i) => (
                      <span key={i} className="bg-zinc-950 px-2.5 py-1 rounded border border-zinc-850">
                        • {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Vocabulary Table */}
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-zinc-100">Dicionário de Palavras Sofisticadas</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Substitua termos comuns para elevar a nota de C1 e C4.</p>
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar palavra..."
                  value={vocabSearch}
                  onChange={(e) => setVocabSearch(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-xs rounded-lg px-3 py-1.5 text-zinc-200 outline-none w-48"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {STUDY_CONTEXT.vocabulary
                  .filter(
                    (v) =>
                      v.common.toLowerCase().includes(vocabSearch.toLowerCase()) ||
                      v.sophisticated.toLowerCase().includes(vocabSearch.toLowerCase())
                  )
                  .map((v, i) => (
                    <div key={i} className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-500 line-through">{v.common}</span>
                        <span className="font-semibold text-emerald-400 font-mono text-[11px]">{v.sophisticated}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 italic">"{v.example}"</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-4 text-center text-xs text-zinc-600 font-mono">
        Vestibular AI • Preparação Faculdade SENAI • Foco em Aprovação
      </footer>
    </div>
  );
}
