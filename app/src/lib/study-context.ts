export interface Question {
  id: string;
  subject: "portugues" | "matematica";
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  cursinhoShortcut: string;
  trapWarning: string;
}

export interface SkeletonParagraph {
  number: number;
  title: string;
  triggerPhrase: string;
  template: string;
  explanation: string;
  tips: string[];
}

export interface VocabWord {
  common: string;
  sophisticated: string;
  example: string;
}

export const STUDY_CONTEXT = {
  examName: "Faculdade SENAI / Vestibulares Técnicos",
  skeleton: [
    {
      number: 1,
      title: "Introdução (A Lei não funciona)",
      triggerPhrase: "A Constituição Federal de 1988 assegura...",
      template:
        "A Constituição Federal de 1988 assegura o direito ao pleno desenvolvimento de todos. Contudo, ao analisar [TEMA DA PROVA], percebe-se que essa garantia não se cumpre na prática. Esse cenário decorre tanto da falta de investimentos quanto da falta de qualificação.",
      explanation:
        "Contextualiza com a CF/88, apresenta o tema e fixa as duas causas clássicas: falta de investimentos e falta de qualificação.",
      tips: [
        "Comece sempre citando a Constituição Federal de 1988.",
        "Use o conectivo 'Contudo' para mostrar a quebra entre a lei e a realidade.",
        "Fixe as duas causas: falta de investimentos e falta de qualificação.",
      ],
    },
    {
      number: 2,
      title: "Desenvolvimento 1 (O Governo / Thomas Hobbes)",
      triggerPhrase: "Em primeiro plano, a falta de investimentos...",
      template:
        "Em primeiro plano, a falta de investimentos atua como raiz desse entrave. Segundo o filósofo Thomas Hobbes, cabe ao Estado zelar pelo bem comum; todavia, a omissão governamental gera prejuízos e exclusão para a população.",
      explanation:
        "Explora a Causa 1 usando o filósofo Thomas Hobbes como autoridade legítima.",
      tips: [
        "Inicie com o conectivo 'Em primeiro plano'.",
        "Cite Thomas Hobbes e o dever do Estado com o bem comum.",
        "Finalize mostrando a consequência negativa da omissão do governo.",
      ],
    },
    {
      number: 3,
      title: "Desenvolvimento 2 (O Trabalhador / Exclusão)",
      triggerPhrase: "Ademais, a falta de qualificação...",
      template:
        "Ademais, a falta de qualificação intensifica esse abismo. Na contemporaneidade, a ausência de preparo técnico resulta em desemprego elevado e marginalização dos trabalhadores.",
      explanation:
        "Explora a Causa 2 focando no impacto direto no trabalhador e na indústria.",
      tips: [
        "Inicie com o conectivo 'Ademais' ou 'Outrossim'.",
        "Use a expressão 'Na contemporaneidade' para enriquecer o vocabulário.",
        "Mostre o impacto concreto: desemprego e marginalização.",
      ],
    },
    {
      number: 4,
      title: "Conclusão (Os 5 Elementos com o SENAI)",
      triggerPhrase: "Portanto, cabe ao Governo Federal...",
      template:
        "Portanto, cabe ao Governo Federal criar planos de capacitação técnica, por meio de cursos gratuitos em parceria com o SENAI, a fim de garantir a empregabilidade dos trabalhadores. Assim, a realidade se aproximará da Constituição.",
      explanation:
        "Garante os 5 elementos obrigatórios: Agente, Ação, Meio/Modo, Efeito e Fechamento circular.",
      tips: [
        "Agente: Governo Federal.",
        "Ação: Criar planos de capacitação técnica.",
        "Meio/Modo: Por meio de cursos gratuitos em parceria com o SENAI.",
        "Efeito: A fim de garantir a empregabilidade dos trabalhadores.",
        "Fechamento: 'Assim, a realidade se aproximará da Constituição.'",
      ],
    },
  ] as SkeletonParagraph[],

  vocabulary: [
    {
      common: "Hoje em dia",
      sophisticated: "Na contemporaneidade / No cenário hodierno",
      example: "Na contemporaneidade, as transformações industriais são velozes.",
    },
    {
      common: "Problema",
      sophisticated: "Impasse / Entrave / Revés / Problemática",
      example: "Essa carência atua como raiz desse entrave produtivo.",
    },
    {
      common: "Muito importante",
      sophisticated: "Imperioso / Primordial / Fulcral",
      example: "É imperioso destacar o papel da educação tecnológica.",
    },
    {
      common: "Diminuir o problema",
      sophisticated: "Mitigar o impasse / Atenuar os danos",
      example: "Políticas públicas são urgentes para mitigar o impasse.",
    },
    {
      common: "Ajudar / Fazer acontecer",
      sophisticated: "Fomentar / Viabilizar / Propiciar",
      example: "Cabe ao Estado fomentar o desenvolvimento tecnológico sustentável.",
    },
    {
      common: "Piorar",
      sophisticated: "Agravar / Aprofundar / Intensificar",
      example: "A inação governamental aprofunda a exclusão social.",
    },
    {
      common: "Com o objetivo de",
      sophisticated: "Com o fito de / A fim de",
      example: "Cursos devem ser ofertados a fim de viabilizar a transição justa.",
    },
    {
      common: "Falta de",
      sophisticated: "Carência de / Escassez de",
      example: "A carência de mão de obra técnica desacelera as fábricas.",
    },
  ] as VocabWord[],

  traps: [
    {
      topic: "Crase antes de Verbo",
      rule: "NUNCA existe crase antes de verbo (-ar, -er, -ir). Se vir verbo após 'a', elimine a crase!",
      example: "Começou a trabalhar (sem crase).",
    },
    {
      topic: "Verbos Fazer e Haver com tempo",
      rule: "Sempre ficam no SINGULAR. 'Faz três anos' e 'Havia muitas vagas'. NUNCA use 'fazem anos' ou 'haviam vagas'.",
      example: "Faz dez anos que a fábrica opera; Havia candidatos na fila.",
    },
    {
      topic: "Conectivos de Oposição vs Concessão",
      rule: "Porém, contudo, todavia = OPOSIÇÃO direta. Embora, apesar de = CONCESSÃO (ressalva que não anula o fato).",
      example: "A fábrica bateu a meta, todavia teve gastos (oposição). Embora chovesse, fomos (concessão).",
    },
    {
      topic: "Comando da Questão (Valor Final vs Desconto)",
      rule: "Sempre releia o comando final: a banca costuma pedir o valor pago a final e coloca o desconto na alternativa A para pegar quem tem pressa.",
      example: "Desconto de R$ 50 em produto de R$ 300 -> Valor a pagar é R$ 250!",
    },
    {
      topic: "Metros Quadrados (m² = Área)",
      rule: "Basta multiplicar um lado pelo outro (comprimento × largura).",
      example: "Terreno 12m × 8m = 96 m².",
    },
    {
      topic: "Triângulo Retângulo 3-4-5",
      rule: "Identifique o multiplicador dos catetos. Se os lados são 6 e 8 (3×2 e 4×2), a hipotenusa é 10 (5×2). Se 12 e 16 (3×4 e 4×4), a hipotenusa é 20 (5×4).",
      example: "Rampa com base 15m e altura 20m -> Hipotenusa = 25m (3-4-5 × 5).",
    },
    {
      topic: "Média Aritmética com Meta",
      rule: "Multiplique a média desejada pelo total de provas (Meta Total). Some o que já tem e subtraia.",
      example: "Média 8 em 4 provas = 32 pontos. Tem 23 pontos -> Falta 32 - 23 = 9.",
    },
    {
      topic: "Regra de Três Inversa",
      rule: "Mais trabalhadores/máquinas = Menos tempo. Multiplique em linha reta (não cruze!).",
      example: "6 robôs em 8 horas -> 12 robôs (dobro) fazem em 4 horas (metade).",
    },
  ],

  questionBank: [
    {
      id: "pt-1",
      subject: "portugues",
      category: "Crase",
      question:
        "Assinale a frase em que o uso do acento indicativo de crase está rigorosamente CORRETO:",
      options: [
        "A nova gestão começou à incentivar os operários.",
        "O operador entregou os relatórios à gerência de manutenção.",
        "Os pagamentos foram realizados à prazo pela diretoria.",
        "O controle de qualidade é monitorado dia à dia.",
      ],
      correctIndex: 1,
      explanation:
        "Teste do AO: 'entregou os relatórios AO gerente' -> virou AO, leva crase obrigatória! Nas outras: 'incentivar' é verbo (proibido), 'prazo' é masculino (proibido) e 'dia a dia' são palavras repetidas (proibido).",
      cursinhoShortcut: "Troque por palavra masculina: virou 'AO', crase no 'A'!",
      trapWarning: "Cuidado: NUNCA coloque crase antes de verbo ou palavra masculina.",
    },
    {
      id: "pt-2",
      subject: "portugues",
      category: "Conectivos",
      question:
        "Na frase: 'A fábrica automatizou o processo produtivo, todavia os custos de energia elétrica aumentaram.', a conjunção destacada estabelece relação de:",
      options: [
        "Conclusão",
        "Concessão",
        "Oposição",
        "Causa",
      ],
      correctIndex: 2,
      explanation:
        "'Todavia', assim como 'contudo', 'porém' e 'no entanto', é conjunção adversativa e expressa contraste/oposição.",
      cursinhoShortcut: "Porém, contudo, todavia = OPOSIÇÃO direta.",
      trapWarning: "Não confunda com concessão (embora, apesar de).",
    },
    {
      id: "pt-3",
      subject: "portugues",
      category: "Concordância",
      question:
        "Assinale a alternativa que apresenta a concordância verbal CORRETA segundo a norma-padrão:",
      options: [
        "Fazem dois anos que as novas prensas operam na indústria.",
        "Haviam muitos candidatos inscritos no vestibular do SENAI.",
        "Faz dois anos que as novas prensas operam na indústria.",
        "Naquele turno, houveram várias falhas de comunicação.",
      ],
      correctIndex: 2,
      explanation:
        "Os verbos FAZER (indicando tempo decorrido) e HAVER (no sentido de existir ou ocorrer) são impessoais e não têm plural. O correto é: 'Faz dois anos' e 'Havia muitos candidatos'.",
      cursinhoShortcut: "Fazer de tempo e Haver de existir NUNCA vão para o plural!",
      trapWarning: "Bancas adoram colocar 'fazem anos' ou 'haviam pessoas'. Elimine na hora!",
    },
    {
      id: "pt-4",
      subject: "portugues",
      category: "Comando de Prova (EXCETO)",
      question:
        "Em todas as alternativas a crase é PROIBIDA, EXCETO em:",
      options: [
        "O jovem começou à estagiar no setor de robótica.",
        "Os técnicos assistiram à demonstração do novo torno mecânico.",
        "A equipe técnica deslocou-se à pé até o laboratório.",
        "O novo protocolo entrará à vigorar no próximo mês.",
      ],
      correctIndex: 1,
      explanation:
        "O comando 'EXCETO' pede a única onde a crase é PERMITIDA/OBRIGATÓRIA. Assistir no sentido de presenciar exige preposição 'a' + 'a demonstração' = à demonstração. As outras têm verbos (estagiar, vigorar) e palavra masculina (pé).",
      cursinhoShortcut: "Circule a palavra EXCETO na prova: ela pede a resposta contrária!",
      trapWarning: "Candidatos apressados marcam a primeira proibida que encontram.",
    },
    {
      id: "pt-5",
      subject: "portugues",
      category: "Acentuação",
      question:
        "A palavra 'indústria' recebe acento gráfico pela mesma regra que obriga a acentuar:",
      options: [
        "Relatório",
        "Café",
        "Máquina",
        "Fácil",
      ],
      correctIndex: 0,
      explanation:
        "'In-dús-tria' e 're-la-tó-rio' são paroxítonas terminadas em ditongo crescente. 'Café' é oxítona, 'máquina' é proparoxítona e 'fácil' é paroxítona terminada em L.",
      cursinhoShortcut: "Ditongo no final (duas vogais juntas na última sílaba) = mesma regra de indústria.",
      trapWarning: "Não confunda regra de ditongo com terminação em L ou R.",
    },
    {
      id: "mat-1",
      subject: "matematica",
      category: "Porcentagem",
      question:
        "Um painel solar industrial custa R$ 2.000,00. Para aquisição à vista, o fabricante oferece um desconto de 15%. Qual é o valor FINAL a ser pago pelo painel?",
      options: [
        "R$ 300,00",
        "R$ 1.700,00",
        "R$ 1.850,00",
        "R$ 1.600,00",
      ],
      correctIndex: 1,
      explanation:
        "10% de R$ 2.000 = R$ 200. 5% = R$ 100. Total do desconto = R$ 300,00. Valor final a pagar = R$ 2.000 - R$ 300 = R$ 1.700,00.",
      cursinhoShortcut: "10% é só voltar 1 vírgula. 5% é a metade de 10%.",
      trapWarning: "R$ 300 é o valor do DESCONTO (a pegadinha da alternativa A). A pergunta pede o valor final!",
    },
    {
      id: "mat-2",
      subject: "matematica",
      category: "Regra de Três Inversa",
      question:
        "Uma equipe de 4 mecânicos faz a revisão completa de uma linha fabril em 12 horas. Se a equipe for ampliada para 8 mecânicos com a mesma eficiência, em quantas horas farão o mesmo trabalho?",
      options: [
        "24 horas",
        "6 horas",
        "8 horas",
        "16 horas",
      ],
      correctIndex: 1,
      explanation:
        "Se o número de trabalhadores dobrou (de 4 para 8), o tempo cai pela metade: 12 / 2 = 6 horas. Conta: 4 × 12 = 8 × X -> 48 = 8X -> X = 6 horas.",
      cursinhoShortcut: "Proporção Inversa: mais gente = menos tempo. Multiplica em linha reta!",
      trapWarning: "Nunca cruze em inversa, senão você acha 24 e erra!",
    },
    {
      id: "mat-3",
      subject: "matematica",
      category: "Geometria Plana (m²)",
      question:
        "Um galpão retangular de estocagem tem 16 metros de comprimento por 5 metros de largura. Quantos metros quadrados (m²) de piso são necessários para cobrir toda a área?",
      options: [
        "42 m²",
        "80 m²",
        "160 m²",
        "21 m²",
      ],
      correctIndex: 1,
      explanation:
        "Área de retângulo = comprimento × largura: 16 × 5 = 80 m².",
      cursinhoShortcut: "Metro quadrado de chão retangular é só multiplicar um lado pelo outro.",
      trapWarning: "Não confunda com perímetro (que seria somar 16 + 16 + 5 + 5 = 42m).",
    },
    {
      id: "mat-4",
      subject: "matematica",
      category: "Lógica / Diferença",
      question:
        "Dois operários produziram juntos 220 peças em um turno. O operário A produziu 40 peças a mais que o operário B. Quantas peças produziu o operário B (o que produziu menos)?",
      options: [
        "90 peças",
        "130 peças",
        "180 peças",
        "80 peças",
      ],
      correctIndex: 0,
      explanation:
        "Atalho: Tira a diferença do total: 220 - 40 = 180. Divide igualmente: 180 / 2 = 90 peças para o operário B (menor). O operário A fez 90 + 40 = 130 peças.",
      cursinhoShortcut: "Tira a diferença e divide por 2 -> você acha direto o menor!",
      trapWarning: "130 peças é a produção do MAIOR. O comando pediu o menor!",
    },
    {
      id: "mat-5",
      subject: "matematica",
      category: "Teorema de Pitágoras (3-4-5)",
      question:
        "Um cabo de aço sustenta uma torre vertical de 12 metros de altura, fixado ao solo a uma distância de 9 metros da base da torre. Qual é o comprimento do cabo de aço esticado?",
      options: [
        "15 metros",
        "18 metros",
        "21 metros",
        "25 metros",
      ],
      correctIndex: 0,
      explanation:
        "Catetos: 9 e 12. Note que 9 = 3 × 3 e 12 = 4 × 3. É a família 3-4-5 multiplicada por 3! Hipotenusa = 5 × 3 = 15 metros.",
      cursinhoShortcut: "Família 3-4-5 multiplicada por 3: lados 9, 12 e 15. Não precisa fazer raiz!",
      trapWarning: "Não some 9 + 12 = 21, isso não é comprimento da diagonal.",
    },
    {
      id: "mat-6",
      subject: "matematica",
      category: "Média Aritmética",
      question:
        "Um candidato precisa de média final 7,0 em 4 avaliações. Nas três primeiras, ele tirou 6,0; 8,0 e 5,0. Quanto ele precisa tirar na 4ª avaliação para ser aprovado com média 7,0?",
      options: [
        "8,0",
        "8,5",
        "9,0",
        "9,5",
      ],
      correctIndex: 2,
      explanation:
        "Meta de pontos: 7,0 × 4 = 28 pontos. Pontos que já tem: 6 + 8 + 5 = 19 pontos. Falta para 28: 28 - 19 = 9,0.",
      cursinhoShortcut: "Meta Total (média × provas) menos o que já somou = nota necessária.",
      trapWarning: "Cuidado para não fazer média simples das 3 primeiras e achar que faltam 8.",
    },
  ] as Question[],
};
