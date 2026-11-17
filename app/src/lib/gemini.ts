const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Modelos medidos: os "preview" e "lite" respondem em ~1-4s; 3.8/3.5 estavam
// sobrecarregados/travando. Todos disparam em paralelo e o primeiro a responder vence.
const MODELS = [
  "gemini-3-flash-preview",
  "gemini-flash-lite-latest",
  "gemini-3.8-flash",
];

// Só a família Gemini 3 "pensa"; o lite não usa thinkingLevel.
const SUPPORTS_THINKING = (model: string) => !model.includes("lite");

const TIMEOUT_MS = 20000;

export type CallOptions = {
  json?: boolean;
  /** "minimal" = mais rápido (questões, temas, dicas); "low" = mais cuidadoso (correção) */
  thinking?: "minimal" | "low";
};

async function callModel(
  model: string,
  prompt: string,
  signal: AbortSignal,
  { json = true, thinking = "minimal" }: CallOptions
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          ...(json ? { responseMimeType: "application/json" } : {}),
          ...(SUPPORTS_THINKING(model)
            ? { thinkingConfig: { thinkingLevel: thinking } }
            : {}),
        },
      }),
    }
  );

  if (!response.ok) throw new Error(`${model}: HTTP ${response.status}`);

  const data = await response.json();
  const parts: Array<{ text?: string; thought?: boolean }> =
    data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text)
    .join("");

  if (!text) throw new Error(`${model}: resposta vazia`);
  return text;
}

export async function callGemini(prompt: string, options: CallOptions = {}): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await Promise.any(
      MODELS.map((m) => callModel(m, prompt, controller.signal, options))
    );
  } catch {
    throw new Error("Nenhum modelo Gemini respondeu a tempo.");
  } finally {
    clearTimeout(timer);
    controller.abort(); // cancela as chamadas que perderam a corrida
  }
}

export function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned) as T;
}
