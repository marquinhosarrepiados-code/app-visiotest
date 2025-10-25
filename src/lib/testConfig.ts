// Configuração dos testes de visão para VisioTest+
import { TestConfig, TestType } from './types'

export const testConfigs: Record<TestType, TestConfig> = {
  acuidade_basica: {
    id: 'acuidade_basica',
    name: 'Acuidade Visual Básica',
    description: 'Teste fundamental para medir a nitidez da sua visão',
    icon: '👁️',
    difficulty: 'fácil',
    estimatedTime: 3,
    questions: [
      {
        id: 'acuidade_1',
        type: 'multiple_choice',
        question: 'Qual direção aponta a abertura da letra E?',
        options: ['Esquerda', 'Direita', 'Cima', 'Baixo'],
        correctAnswer: 'Direita',
        difficulty: 1
      },
      {
        id: 'acuidade_2',
        type: 'multiple_choice',
        question: 'Identifique a direção da abertura desta letra E menor:',
        options: ['Esquerda', 'Direita', 'Cima', 'Baixo'],
        correctAnswer: 'Cima',
        difficulty: 2
      },
      {
        id: 'acuidade_3',
        type: 'multiple_choice',
        question: 'Para onde aponta a abertura desta letra E ainda menor?',
        options: ['Esquerda', 'Direita', 'Cima', 'Baixo'],
        correctAnswer: 'Esquerda',
        difficulty: 3
      },
      {
        id: 'acuidade_4',
        type: 'multiple_choice',
        question: 'Qual a direção da abertura desta letra E pequena?',
        options: ['Esquerda', 'Direita', 'Cima', 'Baixo'],
        correctAnswer: 'Baixo',
        difficulty: 4
      },
      {
        id: 'acuidade_5',
        type: 'multiple_choice',
        question: 'Identifique a direção da abertura desta letra E muito pequena:',
        options: ['Esquerda', 'Direita', 'Cima', 'Baixo'],
        correctAnswer: 'Direita',
        difficulty: 5
      }
    ]
  },

  acuidade_avancada: {
    id: 'acuidade_avancada',
    name: 'Acuidade Visual Avançada',
    description: 'Teste detalhado com letras menores e mais desafiadoras',
    icon: '🔍',
    difficulty: 'difícil',
    estimatedTime: 5,
    questions: [
      {
        id: 'acuidade_adv_1',
        type: 'multiple_choice',
        question: 'Leia esta linha de letras pequenas: F P T O Z',
        options: ['F P T O Z', 'E P T O Z', 'F B T O Z', 'F P T Q Z'],
        correctAnswer: 'F P T O Z',
        difficulty: 6
      },
      {
        id: 'acuidade_adv_2',
        type: 'multiple_choice',
        question: 'Identifique esta sequência: D F P O T E C',
        options: ['D F P O T E C', 'D F B O T E C', 'D F P Q T E C', 'D E P O T E C'],
        correctAnswer: 'D F P O T E C',
        difficulty: 7
      },
      {
        id: 'acuidade_adv_3',
        type: 'multiple_choice',
        question: 'Leia esta linha muito pequena: F E L O P Z D',
        options: ['F E L O P Z D', 'F E L Q P Z D', 'E E L O P Z D', 'F E L O B Z D'],
        correctAnswer: 'F E L O P Z D',
        difficulty: 8
      },
      {
        id: 'acuidade_adv_4',
        type: 'multiple_choice',
        question: 'Identifique: D F P O T E C F D P L',
        options: ['D F P O T E C F D P L', 'D F B O T E C F D P L', 'D F P O T E C E D P L', 'D F P Q T E C F D P L'],
        correctAnswer: 'D F P O T E C F D P L',
        difficulty: 9
      },
      {
        id: 'acuidade_adv_5',
        type: 'multiple_choice',
        question: 'Última linha (muito pequena): F P O Z D K S N C Z',
        options: ['F P O Z D K S N C Z', 'F B O Z D K S N C Z', 'F P Q Z D K S N C Z', 'F P O Z D K S M C Z'],
        correctAnswer: 'F P O Z D K S N C Z',
        difficulty: 10
      }
    ]
  },

  contraste_baixo: {
    id: 'contraste_baixo',
    name: 'Teste de Contraste Baixo',
    description: 'Avalia sua capacidade de distinguir objetos com pouco contraste',
    icon: '🌫️',
    difficulty: 'médio',
    estimatedTime: 4,
    questions: [
      {
        id: 'contraste_1',
        type: 'multiple_choice',
        question: 'Quantos círculos você consegue ver nesta imagem com baixo contraste?',
        options: ['2', '3', '4', '5'],
        correctAnswer: '3',
        difficulty: 3
      },
      {
        id: 'contraste_2',
        type: 'multiple_choice',
        question: 'Qual forma está escondida no fundo cinza claro?',
        options: ['Quadrado', 'Círculo', 'Triângulo', 'Losango'],
        correctAnswer: 'Círculo',
        difficulty: 4
      },
      {
        id: 'contraste_3',
        type: 'multiple_choice',
        question: 'Identifique o número que aparece com contraste muito baixo:',
        options: ['6', '8', '9', '0'],
        correctAnswer: '8',
        difficulty: 5
      },
      {
        id: 'contraste_4',
        type: 'multiple_choice',
        question: 'Quantas linhas verticais você vê nesta grade de baixo contraste?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        difficulty: 6
      },
      {
        id: 'contraste_5',
        type: 'multiple_choice',
        question: 'Qual letra está escrita com contraste mínimo?',
        options: ['C', 'G', 'O', 'Q'],
        correctAnswer: 'G',
        difficulty: 7
      }
    ]
  },

  contraste_alto: {
    id: 'contraste_alto',
    name: 'Teste de Contraste Alto',
    description: 'Teste com alto contraste para avaliar definição visual',
    icon: '⚫',
    difficulty: 'fácil',
    estimatedTime: 3,
    questions: [
      {
        id: 'contraste_alto_1',
        type: 'multiple_choice',
        question: 'Qual forma você vê claramente em preto sobre fundo branco?',
        options: ['Estrela', 'Coração', 'Quadrado', 'Círculo'],
        correctAnswer: 'Estrela',
        difficulty: 1
      },
      {
        id: 'contraste_alto_2',
        type: 'multiple_choice',
        question: 'Quantos pontos pretos você conta nesta imagem?',
        options: ['8', '9', '10', '11'],
        correctAnswer: '9',
        difficulty: 2
      },
      {
        id: 'contraste_alto_3',
        type: 'multiple_choice',
        question: 'Qual número está escrito em preto sobre branco?',
        options: ['3', '5', '6', '8'],
        correctAnswer: '5',
        difficulty: 2
      },
      {
        id: 'contraste_alto_4',
        type: 'multiple_choice',
        question: 'Identifique a letra em alto contraste:',
        options: ['B', 'D', 'P', 'R'],
        correctAnswer: 'B',
        difficulty: 3
      },
      {
        id: 'contraste_alto_5',
        type: 'multiple_choice',
        question: 'Quantas setas apontam para a direita?',
        options: ['2', '3', '4', '5'],
        correctAnswer: '3',
        difficulty: 3
      }
    ]
  },

  cores_basico: {
    id: 'cores_basico',
    name: 'Teste de Cores Básico',
    description: 'Avalia sua percepção das cores primárias e secundárias',
    icon: '🌈',
    difficulty: 'fácil',
    estimatedTime: 3,
    questions: [
      {
        id: 'cores_1',
        type: 'color_match',
        question: 'Qual cor você vê neste círculo?',
        options: ['Vermelho', 'Verde', 'Azul', 'Amarelo'],
        correctAnswer: 'Vermelho',
        difficulty: 1
      },
      {
        id: 'cores_2',
        type: 'color_match',
        question: 'Identifique a cor deste quadrado:',
        options: ['Verde', 'Azul', 'Roxo', 'Rosa'],
        correctAnswer: 'Verde',
        difficulty: 1
      },
      {
        id: 'cores_3',
        type: 'color_match',
        question: 'Que cor é este triângulo?',
        options: ['Azul', 'Verde', 'Amarelo', 'Laranja'],
        correctAnswer: 'Azul',
        difficulty: 2
      },
      {
        id: 'cores_4',
        type: 'color_match',
        question: 'Qual a cor desta estrela?',
        options: ['Amarelo', 'Laranja', 'Vermelho', 'Rosa'],
        correctAnswer: 'Amarelo',
        difficulty: 2
      },
      {
        id: 'cores_5',
        type: 'color_match',
        question: 'Identifique a cor deste losango:',
        options: ['Roxo', 'Rosa', 'Azul', 'Verde'],
        correctAnswer: 'Roxo',
        difficulty: 3
      }
    ]
  },

  cores_avancado: {
    id: 'cores_avancado',
    name: 'Teste de Cores Avançado',
    description: 'Teste detalhado para daltonismo e percepção de tons',
    icon: '🎨',
    difficulty: 'difícil',
    estimatedTime: 6,
    questions: [
      {
        id: 'cores_adv_1',
        type: 'color_match',
        question: 'Que número você vê escondido entre os pontos coloridos?',
        options: ['12', '15', '17', '19'],
        correctAnswer: '15',
        difficulty: 5
      },
      {
        id: 'cores_adv_2',
        type: 'color_match',
        question: 'Qual caminho colorido leva ao centro do labirinto?',
        options: ['Verde', 'Vermelho', 'Azul', 'Amarelo'],
        correctAnswer: 'Verde',
        difficulty: 6
      },
      {
        id: 'cores_adv_3',
        type: 'color_match',
        question: 'Quantos tons diferentes de verde você identifica?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        difficulty: 7
      },
      {
        id: 'cores_adv_4',
        type: 'color_match',
        question: 'Qual letra está escrita em vermelho sobre fundo verde?',
        options: ['A', 'E', 'I', 'O'],
        correctAnswer: 'E',
        difficulty: 8
      },
      {
        id: 'cores_adv_5',
        type: 'color_match',
        question: 'Identifique o símbolo oculto na imagem colorida:',
        options: ['Coração', 'Estrela', 'Círculo', 'Quadrado'],
        correctAnswer: 'Coração',
        difficulty: 9
      }
    ]
  },

  campo_visual: {
    id: 'campo_visual',
    name: 'Teste de Campo Visual',
    description: 'Avalia sua visão periférica e campo de visão',
    icon: '👀',
    difficulty: 'médio',
    estimatedTime: 4,
    questions: [
      {
        id: 'campo_1',
        type: 'direction',
        question: 'Olhe para o centro. Quantos pontos aparecem na periferia?',
        options: ['2', '3', '4', '5'],
        correctAnswer: '3',
        difficulty: 3
      },
      {
        id: 'campo_2',
        type: 'direction',
        question: 'Fixe o olhar no centro. Em que direção aparece o ponto vermelho?',
        options: ['Superior esquerda', 'Superior direita', 'Inferior esquerda', 'Inferior direita'],
        correctAnswer: 'Superior direita',
        difficulty: 4
      },
      {
        id: 'campo_3',
        type: 'direction',
        question: 'Mantendo o foco central, quantas setas você vê nas bordas?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
        difficulty: 5
      },
      {
        id: 'campo_4',
        type: 'direction',
        question: 'Olhe para o centro. Qual forma aparece no canto inferior esquerdo?',
        options: ['Círculo', 'Quadrado', 'Triângulo', 'Estrela'],
        correctAnswer: 'Triângulo',
        difficulty: 6
      },
      {
        id: 'campo_5',
        type: 'direction',
        question: 'Com foco no centro, quantos elementos você detecta na periferia total?',
        options: ['8', '9', '10', '11'],
        correctAnswer: '9',
        difficulty: 7
      }
    ]
  },

  visao_noturna: {
    id: 'visao_noturna',
    name: 'Teste de Visão Noturna',
    description: 'Avalia sua capacidade de enxergar em ambientes com pouca luz',
    icon: '🌙',
    difficulty: 'médio',
    estimatedTime: 4,
    questions: [
      {
        id: 'noturna_1',
        type: 'multiple_choice',
        question: 'Em ambiente escuro, quantas estrelas você consegue ver?',
        options: ['5', '7', '9', '11'],
        correctAnswer: '7',
        difficulty: 4
      },
      {
        id: 'noturna_2',
        type: 'multiple_choice',
        question: 'Qual forma você identifica na penumbra?',
        options: ['Lua crescente', 'Lua cheia', 'Estrela', 'Planeta'],
        correctAnswer: 'Lua crescente',
        difficulty: 5
      },
      {
        id: 'noturna_3',
        type: 'multiple_choice',
        question: 'Quantos pontos de luz você vê nesta imagem escura?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        difficulty: 6
      },
      {
        id: 'noturna_4',
        type: 'multiple_choice',
        question: 'Qual número aparece com baixa luminosidade?',
        options: ['2', '3', '5', '8'],
        correctAnswer: '3',
        difficulty: 7
      },
      {
        id: 'noturna_5',
        type: 'multiple_choice',
        question: 'Identifique a silhueta na escuridão:',
        options: ['Árvore', 'Casa', 'Pessoa', 'Carro'],
        correctAnswer: 'Árvore',
        difficulty: 8
      }
    ]
  },

  astigmatismo: {
    id: 'astigmatismo',
    name: 'Teste de Astigmatismo',
    description: 'Detecta possíveis sinais de astigmatismo na sua visão',
    icon: '📐',
    difficulty: 'médio',
    estimatedTime: 3,
    questions: [
      {
        id: 'astig_1',
        type: 'multiple_choice',
        question: 'Quais linhas aparecem mais nítidas neste padrão radial?',
        options: ['Horizontais', 'Verticais', 'Diagonais /', 'Diagonais \\'],
        correctAnswer: 'Verticais',
        difficulty: 3
      },
      {
        id: 'astig_2',
        type: 'multiple_choice',
        question: 'Neste círculo com linhas, qual direção fica mais borrada?',
        options: ['0° (horizontal)', '45° (diagonal)', '90° (vertical)', '135° (diagonal)'],
        correctAnswer: '45° (diagonal)',
        difficulty: 4
      },
      {
        id: 'astig_3',
        type: 'multiple_choice',
        question: 'Qual conjunto de linhas paralelas você vê com mais clareza?',
        options: ['Grupo A (horizontais)', 'Grupo B (verticais)', 'Grupo C (diagonais)', 'Todos iguais'],
        correctAnswer: 'Grupo B (verticais)',
        difficulty: 5
      },
      {
        id: 'astig_4',
        type: 'multiple_choice',
        question: 'Nesta grade, quais linhas parecem mais escuras ou nítidas?',
        options: ['Horizontais', 'Verticais', 'Ambas iguais', 'Nenhuma se destaca'],
        correctAnswer: 'Horizontais',
        difficulty: 6
      },
      {
        id: 'astig_5',
        type: 'multiple_choice',
        question: 'Observando este padrão de raios, qual setor fica mais desfocado?',
        options: ['Superior', 'Inferior', 'Esquerdo', 'Direito'],
        correctAnswer: 'Superior',
        difficulty: 7
      }
    ]
  }
}

// Função para obter configuração de teste
export function getTestConfig(testType: TestType): TestConfig {
  return testConfigs[testType]
}

// Função para obter todos os tipos de teste disponíveis
export function getAllTestTypes(): TestType[] {
  return Object.keys(testConfigs) as TestType[]
}

// Função para obter testes por dificuldade
export function getTestsByDifficulty(difficulty: 'fácil' | 'médio' | 'difícil'): TestConfig[] {
  return Object.values(testConfigs).filter(test => test.difficulty === difficulty)
}

// Função para calcular pontuação baseada no perfil do usuário
export function calculatePersonalizedScore(
  testResult: any,
  userProfile: any
): { score: number; recommendations: string[] } {
  let baseScore = testResult.score
  const recommendations: string[] = []

  // Ajustes baseados na idade
  if (userProfile.age > 60) {
    baseScore += 5 // Bonus para idade avançada
    recommendations.push('Excelente desempenho considerando sua faixa etária!')
  } else if (userProfile.age < 18) {
    recommendations.push('Ótima capacidade visual para sua idade!')
  }

  // Ajustes baseados no uso de óculos
  if (userProfile.usesGlasses) {
    if (userProfile.lensType === 'multifocal') {
      recommendations.push('Considere verificar se suas lentes multifocais estão adequadas.')
    } else if (userProfile.lensType === 'bifocal') {
      recommendations.push('Suas lentes bifocais podem precisar de ajuste.')
    }
  } else {
    if (baseScore < 70) {
      recommendations.push('Considere consultar um oftalmologista para avaliação.')
    }
  }

  // Recomendações baseadas em dificuldades visuais reportadas
  if (userProfile.visualDifficulties?.includes('visao_noturna')) {
    recommendations.push('Evite dirigir à noite sem avaliação oftalmológica.')
  }

  if (userProfile.visualDifficulties?.includes('daltonismo')) {
    recommendations.push('Seus resultados de cores foram ajustados considerando daltonismo.')
  }

  return {
    score: Math.min(100, Math.max(0, baseScore)),
    recommendations
  }
}