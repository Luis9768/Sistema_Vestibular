import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vestibular AI | Faculdade SENAI & Cursinho Estratégico",
  description: "Plataforma minimalista de preparação com simulados de Português e Matemática, corretor de redação com IA e treinador de esqueleto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased min-h-screen selection:bg-zinc-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
