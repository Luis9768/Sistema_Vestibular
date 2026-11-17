# 🎓 Sistema Vestibular AI (Faculdade SENAI & Cursinho Estratégico)

Sistema completo desenvolvido em **Next.js (App Router)** com design **Dark Minimalist** (inspirado no shadcn / minimalist-ui), focado em aprovação acelerada no vestibular da Faculdade SENAI e cursos técnicos.

---

## ⚡ Principais Funcionalidades

1. **📊 Dashboard de Desempenho:**
   - Métricas em tempo real (taxa de precisão, evolução de notas na redação, conteúdos blindados e alertas do caderno de erros).
   - Layout modular em **Bento Grid** com persistência no navegador.

2. **✍️ Redação com Inteligência Artificial:**
   - Banco com os **temas mais recorrentes** do vestibular SENAI (Indústria 4.0, Transição Verde, Sustentabilidade, Ensino Técnico).
   - **Gerador de Temas Inéditos** com IA (Google Gemini).
   - Botão **"Preencher Esqueleto Rápido"** para estruturação imediata do texto em 4 parágrafos.
   - **Corretor Automático de Redação (Nota 0 a 1000):**
     - Desempenho detalhado pelas 5 competências (C1 a C5).
     - Identificação de erros gramaticais específicos com sugestão de correção.
     - Reescrita lapidada do texto preservando a autoria do aluno.

3. **🎯 Simulador de Questões Inteligente:**
   - Questões de **Português** e **Matemática** com foco nas pegadinhas clássicas:
     - Regra de três inversa vs. direta
     - Porcentagem e valor final a pagar
     - Metros quadrados ($m^2$) e perímetro
     - Triângulo retângulo 3-4-5 (Pitágoras sem contas longas)
     - Crase (teste do AO e proibições antes de verbo)
     - Conectivos de oposição (*todavia, contudo*) e concessão (*embora*)
     - Concordância com verbos impessoais (*haver* e *fazer*)
   - Feedback instantâneo com **Atalho do Cursinho** e **Alerta de Pegadinha**.

4. **🧠 Treinador do Esqueleto & Dicionário de Ouro:**
   - 4 blocos estruturais com frases-gatilho decoráveis em 3 minutos.
   - Modo **Ocultar Frases (Cloze Test)** para fixação da memória.
   - Dicionário com termos sofisticados para elevar a nota de C1 e C4.

---

## 🚀 Como Executar o Projeto

```bash
# Entre na pasta da aplicação
cd app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) (ou `3001`).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend & Backend:** Next.js (App Router), React, TypeScript.
- **Estilização:** Tailwind CSS v4, Lucide Icons.
- **IA:** Google Gemini API (`gemini-3.8-flash` / `gemini-3.5-flash`).
