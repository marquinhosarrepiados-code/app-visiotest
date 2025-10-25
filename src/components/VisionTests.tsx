'use client'

import { useState, useEffect } from 'react'
import { Eye, Target, Palette, ChevronRight, Check, X, Moon, Layers, Zap, Brain, Gauge, Activity, Sun, Move } from 'lucide-react'
import { UserProfile, TestResult } from '@/app/page'
import { supabase } from '@/lib/supabase'

interface VisionTestsProps {
  userProfile: UserProfile
  onComplete: (results: TestResult[]) => void
}

export function VisionTests({ userProfile, onComplete }: VisionTestsProps) {
  const [currentTest, setCurrentTest] = useState<'acuity' | 'color' | 'contrast' | 'astigmatism' | 'nightVision' | 'depth' | 'eyeStrain' | 'peripheral' | 'focus' | 'tracking' | 'motionSensitivity' | 'lightSensitivity'>('acuity')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<any[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [showError, setShowError] = useState<string | null>(null)

  // Mensagens de erro divertidas e variadas
  const errorMessages = [
    "Ops, está errado! 🤔",
    "Eita, não foi dessa vez! 😅", 
    "Preocupante... tente novamente! 😬",
    "Hmm, que tal tentar outra opção? 🤨",
    "Oops! Não foi bem assim... 😊",
    "Eita nois! Errou feio! 😂",
    "Caramba, passou longe! 🙈",
    "Opa! Quase lá... 🤏",
    "Xiii, não foi dessa! 😵",
    "Rapaz, complicou! 🤯",
    "Ué, será que não tá vendo direito? 👀",
    "Aí não né, chefe! 🙄",
    "Tá precisando de óculos mesmo! 🤓",
    "Errooooou! Tenta de novo! 🎯",
    "Que isso, meu filho! 😱"
  ]

  const getRandomErrorMessage = () => {
    return errorMessages[Math.floor(Math.random() * errorMessages.length)]
  }

  // Teste de Acuidade Visual - 10 NÍVEIS
  const acuityQuestions = [
    { level: 1, letter: 'E', size: 'text-9xl', options: ['E', 'F', 'P', 'T'] },
    { level: 2, letter: 'F', size: 'text-8xl', options: ['F', 'E', 'L', 'T'] },
    { level: 3, letter: 'P', size: 'text-6xl', options: ['P', 'R', 'B', 'F'] },
    { level: 4, letter: 'T', size: 'text-4xl', options: ['T', 'F', 'L', 'I'] },
    { level: 5, letter: 'L', size: 'text-2xl', options: ['L', 'I', 'T', 'F'] },
    { level: 6, letter: 'H', size: 'text-xl', options: ['H', 'N', 'M', 'K'] },
    { level: 7, letter: 'D', size: 'text-lg', options: ['D', 'O', 'P', 'B'] },
    { level: 8, letter: 'N', size: 'text-base', options: ['N', 'M', 'H', 'U'] },
    { level: 9, letter: 'Z', size: 'text-sm', options: ['Z', 'N', 'M', 'W'] },
    { level: 10, letter: 'K', size: 'text-xs', options: ['K', 'H', 'N', 'M'] }
  ]

  // Teste de Percepção de Cores - 10 NÍVEIS
  const colorQuestions = [
    { level: 1, color: 'text-red-500', letter: 'R', options: ['Vermelho', 'Verde', 'Azul', 'Amarelo'] },
    { level: 2, color: 'text-green-500', letter: 'G', options: ['Verde', 'Vermelho', 'Azul', 'Roxo'] },
    { level: 3, color: 'text-blue-500', letter: 'B', options: ['Azul', 'Verde', 'Roxo', 'Vermelho'] },
    { level: 4, color: 'text-yellow-500', letter: 'Y', options: ['Amarelo', 'Laranja', 'Verde', 'Vermelho'] },
    { level: 5, color: 'text-purple-500', letter: 'P', options: ['Roxo', 'Azul', 'Rosa', 'Vermelho'] },
    { level: 6, color: 'text-orange-500', letter: 'O', options: ['Laranja', 'Vermelho', 'Amarelo', 'Rosa'] },
    { level: 7, color: 'text-pink-500', letter: 'K', options: ['Rosa', 'Roxo', 'Vermelho', 'Laranja'] },
    { level: 8, color: 'text-cyan-500', letter: 'C', options: ['Ciano', 'Azul', 'Verde', 'Roxo'] },
    { level: 9, color: 'text-indigo-500', letter: 'I', options: ['Índigo', 'Azul', 'Roxo', 'Preto'] },
    { level: 10, color: 'text-teal-500', letter: 'T', options: ['Verde-azulado', 'Verde', 'Azul', 'Ciano'] }
  ]

  // Teste de Contraste Visual - 10 NÍVEIS
  const contrastQuestions = [
    { level: 1, contrast: 'opacity-100', letter: 'C', options: ['C', 'G', 'O', 'Q'] },
    { level: 2, contrast: 'opacity-90', letter: 'G', options: ['G', 'C', 'O', 'D'] },
    { level: 3, contrast: 'opacity-70', letter: 'O', options: ['O', 'Q', 'C', 'G'] },
    { level: 4, contrast: 'opacity-50', letter: 'D', options: ['D', 'O', 'P', 'B'] },
    { level: 5, contrast: 'opacity-30', letter: 'B', options: ['B', 'P', 'R', 'D'] },
    { level: 6, contrast: 'opacity-20', letter: 'R', options: ['R', 'P', 'B', 'F'] },
    { level: 7, contrast: 'opacity-15', letter: 'S', options: ['S', 'G', 'C', 'O'] },
    { level: 8, contrast: 'opacity-10', letter: 'A', options: ['A', 'R', 'H', 'N'] },
    { level: 9, contrast: 'opacity-7', letter: 'M', options: ['M', 'N', 'H', 'W'] },
    { level: 10, contrast: 'opacity-5', letter: 'W', options: ['W', 'V', 'M', 'N'] }
  ]

  // Teste de Astigmatismo - 10 NÍVEIS
  const astigmatismQuestions = [
    { level: 1, pattern: 'horizontal', question: 'As linhas horizontais estão nítidas?', options: ['Sim', 'Não', 'Parcialmente', 'Não sei'] },
    { level: 2, pattern: 'vertical', question: 'As linhas verticais estão nítidas?', options: ['Sim', 'Não', 'Parcialmente', 'Não sei'] },
    { level: 3, pattern: 'diagonal1', question: 'As linhas diagonais (/) estão nítidas?', options: ['Sim', 'Não', 'Parcialmente', 'Não sei'] },
    { level: 4, pattern: 'diagonal2', question: 'As linhas diagonais (\\) estão nítidas?', options: ['Sim', 'Não', 'Parcialmente', 'Não sei'] },
    { level: 5, pattern: 'radial', question: 'Todas as linhas radiais estão igualmente nítidas?', options: ['Sim', 'Não', 'Algumas borradas', 'Muito borradas'] },
    { level: 6, pattern: 'cross', question: 'O padrão cruzado está nítido?', options: ['Perfeitamente', 'Levemente borrado', 'Muito borrado', 'Não vejo'] },
    { level: 7, pattern: 'grid', question: 'A grade está uniforme?', options: ['Sim', 'Algumas linhas borradas', 'Muito distorcida', 'Não consigo ver'] },
    { level: 8, pattern: 'circle', question: 'O círculo parece perfeitamente redondo?', options: ['Sim', 'Levemente oval', 'Muito oval', 'Distorcido'] },
    { level: 9, pattern: 'star', question: 'A estrela tem pontas bem definidas?', options: ['Todas nítidas', 'Algumas borradas', 'Muito borradas', 'Não vejo'] },
    { level: 10, pattern: 'complex', question: 'O padrão complexo está claro?', options: ['Muito claro', 'Razoável', 'Confuso', 'Não distingo'] }
  ]

  // Teste de Visão Noturna - 10 NÍVEIS
  const nightVisionQuestions = [
    { level: 1, brightness: 'brightness-90', letter: 'N', options: ['N', 'M', 'H', 'U'] },
    { level: 2, brightness: 'brightness-75', letter: 'M', options: ['M', 'N', 'W', 'V'] },
    { level: 3, brightness: 'brightness-50', letter: 'H', options: ['H', 'N', 'M', 'K'] },
    { level: 4, brightness: 'brightness-25', letter: 'U', options: ['U', 'V', 'Y', 'N'] },
    { level: 5, brightness: 'brightness-[0.15]', letter: 'V', options: ['V', 'U', 'Y', 'W'] },
    { level: 6, brightness: 'brightness-[0.1]', letter: 'K', options: ['K', 'H', 'N', 'M'] },
    { level: 7, brightness: 'brightness-[0.08]', letter: 'W', options: ['W', 'V', 'M', 'N'] },
    { level: 8, brightness: 'brightness-[0.05]', letter: 'Z', options: ['Z', 'N', 'M', 'W'] },
    { level: 9, brightness: 'brightness-[0.03]', letter: 'X', options: ['X', 'Z', 'N', 'M'] },
    { level: 10, brightness: 'brightness-[0.02]', letter: 'Q', options: ['Q', 'O', 'C', 'G'] }
  ]

  // Teste de Profundidade (3D) - 10 NÍVEIS
  const depthQuestions = [
    { level: 1, depth: 'near', question: 'Qual círculo parece estar mais próximo?', options: ['Esquerdo', 'Direito', 'Ambos iguais', 'Não consigo ver'] },
    { level: 2, depth: 'far', question: 'Qual quadrado parece estar mais distante?', options: ['Superior', 'Inferior', 'Ambos iguais', 'Não consigo ver'] },
    { level: 3, depth: 'overlap', question: 'Quantas camadas você consegue distinguir?', options: ['3', '2', '1', 'Nenhuma'] },
    { level: 4, depth: 'stereo', question: 'A imagem parece ter profundidade?', options: ['Sim, claramente', 'Um pouco', 'Não', 'Não sei'] },
    { level: 5, depth: 'complex', question: 'Consegue ver o objeto em 3D?', options: ['Perfeitamente', 'Parcialmente', 'Dificilmente', 'Não'] },
    { level: 6, depth: 'layers', question: 'Quantas camadas de profundidade vê?', options: ['4 ou mais', '3', '2', '1 ou nenhuma'] },
    { level: 7, depth: 'perspective', question: 'A perspectiva está clara?', options: ['Muito clara', 'Clara', 'Confusa', 'Não vejo'] },
    { level: 8, depth: 'distance', question: 'Consegue estimar a distância?', options: ['Facilmente', 'Com dificuldade', 'Muito difícil', 'Impossível'] },
    { level: 9, depth: 'fine', question: 'Vê detalhes em profundidade fina?', options: ['Claramente', 'Razoavelmente', 'Pouco', 'Nada'] },
    { level: 10, depth: 'micro', question: 'Percebe micro-profundidades?', options: ['Sim', 'Parcialmente', 'Dificilmente', 'Não'] }
  ]

  // Teste de Fadiga Ocular - 10 NÍVEIS
  const eyeStrainQuestions = [
    { level: 1, strain: 'blink', question: 'Sente necessidade de piscar mais que o normal?', options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente'] },
    { level: 2, strain: 'dry', question: 'Seus olhos ficam secos durante o uso de telas?', options: ['Nunca', 'Raramente', 'Às vezes', 'Sempre'] },
    { level: 3, strain: 'focus', question: 'Tem dificuldade para focar após usar telas?', options: ['Nunca', 'Raramente', 'Às vezes', 'Sempre'] },
    { level: 4, strain: 'headache', question: 'Sente dor de cabeça após usar dispositivos?', options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente'] },
    { level: 5, strain: 'tired', question: 'Seus olhos ficam cansados rapidamente?', options: ['Nunca', 'Após 4h+', 'Após 2h', 'Após 1h'] },
    { level: 6, strain: 'burning', question: 'Sente ardência nos olhos?', options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente'] },
    { level: 7, strain: 'watery', question: 'Seus olhos lacrimejam excessivamente?', options: ['Nunca', 'Raramente', 'Às vezes', 'Sempre'] },
    { level: 8, strain: 'sensitivity', question: 'Tem sensibilidade à luz das telas?', options: ['Nunca', 'Pouca', 'Moderada', 'Muita'] },
    { level: 9, strain: 'double', question: 'Vê imagens duplas após uso prolongado?', options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente'] },
    { level: 10, strain: 'strain', question: 'Sente tensão muscular nos olhos?', options: ['Nunca', 'Leve', 'Moderada', 'Intensa'] }
  ]

  // Teste de Visão Periférica - 10 NÍVEIS
  const peripheralQuestions = [
    { level: 1, position: 'center', question: 'Vê o ponto central claramente?', options: ['Sim', 'Não', 'Parcialmente', 'Borrado'] },
    { level: 2, position: 'left', question: 'Consegue ver o objeto à esquerda?', options: ['Claramente', 'Borrado', 'Mal consigo ver', 'Não vejo'] },
    { level: 3, position: 'right', question: 'Consegue ver o objeto à direita?', options: ['Claramente', 'Borrado', 'Mal consigo ver', 'Não vejo'] },
    { level: 4, position: 'top', question: 'Vê o objeto na parte superior?', options: ['Claramente', 'Borrado', 'Mal consigo ver', 'Não vejo'] },
    { level: 5, position: 'bottom', question: 'Vê o objeto na parte inferior?', options: ['Claramente', 'Borrado', 'Mal consigo ver', 'Não vejo'] },
    { level: 6, position: 'multiple', question: 'Quantos objetos periféricos consegue ver?', options: ['4', '3', '2', '1 ou nenhum'] },
    { level: 7, position: 'far-left', question: 'Vê o objeto bem à esquerda?', options: ['Sim', 'Parcialmente', 'Muito pouco', 'Não'] },
    { level: 8, position: 'far-right', question: 'Vê o objeto bem à direita?', options: ['Sim', 'Parcialmente', 'Muito pouco', 'Não'] },
    { level: 9, position: 'extreme', question: 'Vê objetos na periferia extrema?', options: ['Claramente', 'Vagamente', 'Mal percebo', 'Não vejo'] },
    { level: 10, position: 'micro', question: 'Detecta pequenos movimentos periféricos?', options: ['Facilmente', 'Com atenção', 'Dificilmente', 'Não detecto'] }
  ]

  // Teste de Foco e Acomodação - 10 NÍVEIS
  const focusQuestions = [
    { level: 1, distance: 'near', question: 'O texto próximo está nítido?', options: ['Muito nítido', 'Nítido', 'Borrado', 'Muito borrado'] },
    { level: 2, distance: 'far', question: 'O texto distante está nítido?', options: ['Muito nítido', 'Nítido', 'Borrado', 'Muito borrado'] },
    { level: 3, distance: 'transition', question: 'Consegue focar rapidamente mudando a distância?', options: ['Instantâneo', 'Rápido', 'Lento', 'Muito lento'] },
    { level: 4, distance: 'micro', question: 'Consegue ler texto muito pequeno?', options: ['Facilmente', 'Com esforço', 'Dificilmente', 'Não consigo'] },
    { level: 5, distance: 'macro', question: 'Vê detalhes em objetos distantes?', options: ['Claramente', 'Razoavelmente', 'Pouco', 'Nada'] },
    { level: 6, distance: 'alternating', question: 'Foco alterna bem entre perto e longe?', options: ['Perfeitamente', 'Bem', 'Com dificuldade', 'Não alterna'] },
    { level: 7, distance: 'sustained', question: 'Mantém foco por tempo prolongado?', options: ['Facilmente', 'Razoavelmente', 'Com esforço', 'Não mantenho'] },
    { level: 8, distance: 'precision', question: 'Foco de precisão funciona bem?', options: ['Excelente', 'Bom', 'Regular', 'Ruim'] },
    { level: 9, distance: 'fine', question: 'Ajuste fino de foco é preciso?', options: ['Muito preciso', 'Preciso', 'Impreciso', 'Muito impreciso'] },
    { level: 10, distance: 'extreme', question: 'Foca em distâncias extremas?', options: ['Sem problema', 'Com dificuldade', 'Muito difícil', 'Impossível'] }
  ]

  // Teste de Rastreamento Visual - 10 NÍVEIS
  const trackingQuestions = [
    { level: 1, movement: 'horizontal', question: 'Consegue acompanhar movimento horizontal?', options: ['Perfeitamente', 'Bem', 'Com dificuldade', 'Não consigo'] },
    { level: 2, movement: 'vertical', question: 'Consegue acompanhar movimento vertical?', options: ['Perfeitamente', 'Bem', 'Com dificuldade', 'Não consigo'] },
    { level: 3, movement: 'circular', question: 'Acompanha movimento circular?', options: ['Suavemente', 'Razoavelmente', 'Aos trancos', 'Não acompanho'] },
    { level: 4, movement: 'zigzag', question: 'Segue padrão em zigue-zague?', options: ['Facilmente', 'Com esforço', 'Dificilmente', 'Perco o objeto'] },
    { level: 5, movement: 'fast', question: 'Acompanha movimento rápido?', options: ['Sim', 'Parcialmente', 'Mal consigo', 'Não consigo'] },
    { level: 6, movement: 'slow', question: 'Segue movimento muito lento?', options: ['Perfeitamente', 'Bem', 'Perco às vezes', 'Sempre perco'] },
    { level: 7, movement: 'multiple', question: 'Rastreia múltiplos objetos?', options: ['Todos', 'Maioria', 'Poucos', 'Nenhum'] },
    { level: 8, movement: 'complex', question: 'Segue padrão complexo?', options: ['Facilmente', 'Com concentração', 'Dificilmente', 'Impossível'] },
    { level: 9, movement: 'erratic', question: 'Acompanha movimento errático?', options: ['Sem problema', 'Com dificuldade', 'Muito difícil', 'Impossível'] },
    { level: 10, movement: 'micro', question: 'Detecta micro-movimentos?', options: ['Claramente', 'Vagamente', 'Mal percebo', 'Não detecto'] }
  ]

  // NOVOS TESTES ADICIONADOS

  // Teste de Sensibilidade ao Movimento - 10 NÍVEIS
  const motionSensitivityQuestions = [
    { level: 1, motion: 'large', question: 'Detecta movimento de objetos grandes?', options: ['Imediatamente', 'Rapidamente', 'Com atraso', 'Não detecto'] },
    { level: 2, motion: 'medium', question: 'Percebe movimento de objetos médios?', options: ['Claramente', 'Bem', 'Com dificuldade', 'Não percebo'] },
    { level: 3, motion: 'small', question: 'Vê movimento de objetos pequenos?', options: ['Facilmente', 'Com atenção', 'Dificilmente', 'Não vejo'] },
    { level: 4, motion: 'peripheral', question: 'Detecta movimento na periferia?', options: ['Sempre', 'Frequentemente', 'Às vezes', 'Nunca'] },
    { level: 5, motion: 'subtle', question: 'Percebe movimentos sutis?', options: ['Sim', 'Parcialmente', 'Raramente', 'Não'] },
    { level: 6, motion: 'direction', question: 'Identifica direção do movimento?', options: ['Precisamente', 'Aproximadamente', 'Com dificuldade', 'Não identifico'] },
    { level: 7, motion: 'speed', question: 'Estima velocidade do movimento?', options: ['Facilmente', 'Razoavelmente', 'Com dificuldade', 'Não consigo'] },
    { level: 8, motion: 'multiple', question: 'Detecta múltiplos movimentos simultâneos?', options: ['Todos', 'Maioria', 'Alguns', 'Nenhum'] },
    { level: 9, motion: 'contrast', question: 'Vê movimento com baixo contraste?', options: ['Claramente', 'Vagamente', 'Mal percebo', 'Não vejo'] },
    { level: 10, motion: 'micro', question: 'Detecta micro-movimentos?', options: ['Perfeitamente', 'Bem', 'Dificilmente', 'Impossível'] }
  ]

  // Teste de Sensibilidade à Luz - 10 NÍVEIS
  const lightSensitivityQuestions = [
    { level: 1, light: 'bright', question: 'Como reage à luz brilhante?', options: ['Normal', 'Leve desconforto', 'Desconforto', 'Dor intensa'] },
    { level: 2, light: 'sudden', question: 'Como reage a mudanças súbitas de luz?', options: ['Adapto rapidamente', 'Adapto normalmente', 'Demoro a adaptar', 'Muito desconforto'] },
    { level: 3, light: 'fluorescent', question: 'Como se sente sob luz fluorescente?', options: ['Confortável', 'Levemente incomodado', 'Incomodado', 'Muito incomodado'] },
    { level: 4, light: 'sunlight', question: 'Como tolera luz solar direta?', options: ['Bem', 'Preciso piscar mais', 'Desconfortável', 'Insuportável'] },
    { level: 5, light: 'screen', question: 'Sensibilidade à luz de telas?', options: ['Nenhuma', 'Leve', 'Moderada', 'Alta'] },
    { level: 6, light: 'headlights', question: 'Como reage a faróis de carros?', options: ['Normal', 'Leve ofuscamento', 'Ofuscamento', 'Cegueira temporária'] },
    { level: 7, light: 'reflection', question: 'Sensibilidade a reflexos luminosos?', options: ['Baixa', 'Moderada', 'Alta', 'Extrema'] },
    { level: 8, light: 'indoor', question: 'Precisa de óculos escuros em ambientes internos?', options: ['Nunca', 'Raramente', 'Às vezes', 'Sempre'] },
    { level: 9, light: 'recovery', question: 'Tempo para recuperar após exposição à luz?', options: ['Imediato', 'Poucos segundos', 'Alguns minutos', 'Muito tempo'] },
    { level: 10, light: 'symptoms', question: 'Luz causa dor de cabeça ou náusea?', options: ['Nunca', 'Raramente', 'Frequentemente', 'Sempre'] }
  ]

  const getCurrentQuestions = () => {
    switch (currentTest) {
      case 'acuity': return acuityQuestions
      case 'color': return colorQuestions
      case 'contrast': return contrastQuestions
      case 'astigmatism': return astigmatismQuestions
      case 'nightVision': return nightVisionQuestions
      case 'depth': return depthQuestions
      case 'eyeStrain': return eyeStrainQuestions
      case 'peripheral': return peripheralQuestions
      case 'focus': return focusQuestions
      case 'tracking': return trackingQuestions
      case 'motionSensitivity': return motionSensitivityQuestions
      case 'lightSensitivity': return lightSensitivityQuestions
      default: return acuityQuestions
    }
  }

  const handleAnswer = async (answer: string) => {
    const questions = getCurrentQuestions()
    const currentQ = questions[currentQuestion]
    
    let isCorrect = false
    if (currentTest === 'color') {
      isCorrect = answer === currentQ.options[0]
    } else if (currentTest === 'acuity' || currentTest === 'contrast' || currentTest === 'nightVision') {
      isCorrect = answer === currentQ.letter
    } else {
      // Para outros testes, consideramos a primeira opção como "melhor resposta"
      isCorrect = answer === currentQ.options[0]
    }

    // Mostrar mensagem de erro se incorreto
    if (!isCorrect) {
      const errorMsg = getRandomErrorMessage()
      setShowError(errorMsg)
      setTimeout(() => setShowError(null), 2000)
    }

    const newResponse = {
      level: currentQ.level,
      question: currentQuestion,
      answer,
      correct: isCorrect,
      timestamp: new Date()
    }

    const newResponses = [...responses, newResponse]
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Finalizar teste atual
      const score = Math.round((newResponses.filter(r => r.correct).length / newResponses.length) * 100)
      
      const testResult: TestResult = {
        id: Date.now().toString(),
        userId: userProfile.id,
        testType: currentTest,
        score,
        level: currentLevel,
        responses: newResponses,
        completedAt: new Date()
      }

      // Salvar resultado no Supabase
      try {
        await supabase
          .from('test_results')
          .insert({
            user_id: userProfile.id,
            test_type: currentTest,
            score,
            level: currentLevel,
            responses: newResponses
          })
      } catch (error) {
        console.error('Erro ao salvar resultado:', error)
      }

      const newResults = [...testResults, testResult]
      setTestResults(newResults)

      // NOVA SEQUÊNCIA DE TESTES (12 testes total)
      const testOrder = ['acuity', 'color', 'contrast', 'astigmatism', 'nightVision', 'depth', 'eyeStrain', 'peripheral', 'focus', 'tracking', 'motionSensitivity', 'lightSensitivity']
      const currentIndex = testOrder.indexOf(currentTest)
      
      if (currentIndex < testOrder.length - 1) {
        setCurrentTest(testOrder[currentIndex + 1] as any)
        setCurrentQuestion(0)
        setResponses([])
      } else {
        setIsCompleted(true)
        onComplete(newResults)
      }
    }
  }

  const getTestIcon = (testType: string) => {
    switch (testType) {
      case 'acuity': return <Eye className="w-6 h-6" />
      case 'color': return <Palette className="w-6 h-6" />
      case 'contrast': return <Target className="w-6 h-6" />
      case 'astigmatism': return <Layers className="w-6 h-6" />
      case 'nightVision': return <Moon className="w-6 h-6" />
      case 'depth': return <Layers className="w-6 h-6" />
      case 'eyeStrain': return <Zap className="w-6 h-6" />
      case 'peripheral': return <Brain className="w-6 h-6" />
      case 'focus': return <Target className="w-6 h-6" />
      case 'tracking': return <Activity className="w-6 h-6" />
      case 'motionSensitivity': return <Move className="w-6 h-6" />
      case 'lightSensitivity': return <Sun className="w-6 h-6" />
      default: return <Eye className="w-6 h-6" />
    }
  }

  const getTestTitle = (testType: string) => {
    switch (testType) {
      case 'acuity': return 'Acuidade Visual'
      case 'color': return 'Percepção de Cores'
      case 'contrast': return 'Contraste Visual'
      case 'astigmatism': return 'Astigmatismo'
      case 'nightVision': return 'Visão Noturna'
      case 'depth': return 'Profundidade (3D)'
      case 'eyeStrain': return 'Fadiga Ocular'
      case 'peripheral': return 'Visão Periférica'
      case 'focus': return 'Foco e Acomodação'
      case 'tracking': return 'Rastreamento Visual'
      case 'motionSensitivity': return 'Sensibilidade ao Movimento'
      case 'lightSensitivity': return 'Sensibilidade à Luz'
      default: return 'Teste de Visão'
    }
  }

  const getTestDescription = (testType: string) => {
    switch (testType) {
      case 'acuity': return 'Avalie a nitidez da sua visão com letras de tamanhos variados'
      case 'color': return 'Identifique possíveis deficiências (daltonismo)'
      case 'contrast': return 'Teste sua sensibilidade a tons claros e escuros'
      case 'astigmatism': return 'Verifique se há distorção nas linhas ou formas'
      case 'nightVision': return 'Avalie seu desempenho em ambientes com pouca luz'
      case 'depth': return 'Teste sua percepção de distância e foco binocular'
      case 'eyeStrain': return 'Descubra sinais de cansaço visual por uso excessivo de telas'
      case 'peripheral': return 'Avalie sua capacidade de ver objetos nas bordas do campo visual'
      case 'focus': return 'Teste sua capacidade de focar em diferentes distâncias'
      case 'tracking': return 'Avalie sua habilidade de seguir objetos em movimento'
      case 'motionSensitivity': return 'Teste sua capacidade de detectar movimentos'
      case 'lightSensitivity': return 'Avalie sua sensibilidade a diferentes tipos de luz'
      default: return 'Teste de visão'
    }
  }

  const renderTestContent = () => {
    const questions = getCurrentQuestions()
    const currentQ = questions[currentQuestion]

    if (currentTest === 'astigmatism') {
      return (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-12 mb-6">
          <div className="w-48 h-48 mx-auto relative">
            {currentQ.pattern === 'horizontal' && (
              <div className="space-y-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-1 bg-gray-900 dark:bg-white" />
                ))}
              </div>
            )}
            {currentQ.pattern === 'vertical' && (
              <div className="flex space-x-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 h-48 bg-gray-900 dark:bg-white" />
                ))}
              </div>
            )}
            {currentQ.pattern === 'diagonal1' && (
              <div className="space-y-2 transform rotate-45">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-1 bg-gray-900 dark:bg-white" />
                ))}
              </div>
            )}
            {currentQ.pattern === 'diagonal2' && (
              <div className="space-y-2 transform -rotate-45">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-1 bg-gray-900 dark:bg-white" />
                ))}
              </div>
            )}
            {currentQ.pattern === 'radial' && (
              <div className="relative w-48 h-48">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-24 bg-gray-900 dark:bg-white origin-bottom"
                    style={{
                      left: '50%',
                      bottom: '50%',
                      transform: `translateX(-50%) rotate(${i * 30}deg)`
                    }}
                  />
                ))}
              </div>
            )}
            {currentQ.pattern === 'cross' && (
              <div className="relative w-48 h-48">
                <div className="absolute w-full h-1 bg-gray-900 dark:bg-white top-1/2 transform -translate-y-1/2"></div>
                <div className="absolute h-full w-1 bg-gray-900 dark:bg-white left-1/2 transform -translate-x-1/2"></div>
              </div>
            )}
            {currentQ.pattern === 'grid' && (
              <div className="grid grid-cols-8 gap-1 w-48 h-48">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className="border border-gray-900 dark:border-white"></div>
                ))}
              </div>
            )}
            {currentQ.pattern === 'circle' && (
              <div className="w-48 h-48 border-4 border-gray-900 dark:border-white rounded-full"></div>
            )}
            {currentQ.pattern === 'star' && (
              <div className="w-48 h-48 flex items-center justify-center">
                <svg className="w-32 h-32 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            )}
            {currentQ.pattern === 'complex' && (
              <div className="w-48 h-48 relative">
                <div className="absolute inset-0 border-2 border-gray-900 dark:border-white rounded-full"></div>
                <div className="absolute inset-4 border-2 border-gray-900 dark:border-white"></div>
                <div className="absolute inset-8 border-2 border-gray-900 dark:border-white rounded-full"></div>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-900 dark:bg-white"></div>
                <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-900 dark:bg-white"></div>
              </div>
            )}
          </div>
        </div>
      )
    }

    if (currentTest === 'depth') {
      return (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-12 mb-6">
          <div className="w-48 h-48 mx-auto relative">
            {currentQ.depth === 'near' && (
              <div className="flex justify-between items-center h-full">
                <div className="w-16 h-16 bg-blue-500 rounded-full shadow-2xl transform translate-z-4"></div>
                <div className="w-16 h-16 bg-red-500 rounded-full shadow-lg"></div>
              </div>
            )}
            {currentQ.depth === 'far' && (
              <div className="flex flex-col justify-between h-full">
                <div className="w-16 h-16 bg-green-500 shadow-lg mx-auto"></div>
                <div className="w-16 h-16 bg-purple-500 shadow-2xl mx-auto transform translate-z-4"></div>
              </div>
            )}
            {currentQ.depth === 'overlap' && (
              <div className="relative">
                <div className="w-20 h-20 bg-red-500 absolute top-0 left-0 opacity-80"></div>
                <div className="w-20 h-20 bg-blue-500 absolute top-4 left-4 opacity-80"></div>
                <div className="w-20 h-20 bg-green-500 absolute top-8 left-8 opacity-80"></div>
              </div>
            )}
            {currentQ.depth === 'layers' && (
              <div className="relative">
                <div className="w-24 h-24 bg-red-400 absolute top-0 left-0 opacity-60"></div>
                <div className="w-24 h-24 bg-blue-400 absolute top-2 left-2 opacity-70"></div>
                <div className="w-24 h-24 bg-green-400 absolute top-4 left-4 opacity-80"></div>
                <div className="w-24 h-24 bg-yellow-400 absolute top-6 left-6 opacity-90"></div>
              </div>
            )}
            {(currentQ.depth === 'stereo' || currentQ.depth === 'complex' || currentQ.depth === 'perspective' || currentQ.depth === 'distance' || currentQ.depth === 'fine' || currentQ.depth === 'micro') && (
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-2xl transform rotate-12 hover:rotate-0 transition-transform"></div>
              </div>
            )}
          </div>
        </div>
      )
    }

    if (currentTest === 'peripheral') {
      return (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-12 mb-6">
          <div className="w-64 h-64 mx-auto relative">
            {/* Ponto central sempre visível */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
            
            {currentQ.position === 'center' && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full"></div>
            )}
            {currentQ.position === 'left' && (
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
            )}
            {currentQ.position === 'right' && (
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
            )}
            {currentQ.position === 'top' && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
            )}
            {currentQ.position === 'bottom' && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
            )}
            {currentQ.position === 'multiple' && (
              <>
                <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-500 rounded-full"></div>
              </>
            )}
            {currentQ.position === 'far-left' && (
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full"></div>
            )}
            {currentQ.position === 'far-right' && (
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full"></div>
            )}
            {(currentQ.position === 'extreme' || currentQ.position === 'micro') && (
              <>
                <div className="absolute top-2 left-2 w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></div>
              </>
            )}
          </div>
        </div>
      )
    }

    if (currentTest === 'focus') {
      return (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-12 mb-6">
          <div className="text-center">
            {currentQ.distance === 'near' && (
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                TEXTO PRÓXIMO
              </div>
            )}
            {currentQ.distance === 'far' && (
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                texto distante
              </div>
            )}
            {currentQ.distance === 'micro' && (
              <div className="text-xs font-bold text-gray-900 dark:text-white">
                texto muito pequeno
              </div>
            )}
            {currentQ.distance === 'macro' && (
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                GRANDE
              </div>
            )}
            {(currentQ.distance === 'transition' || currentQ.distance === 'alternating' || currentQ.distance === 'sustained' || currentQ.distance === 'precision' || currentQ.distance === 'fine' || currentQ.distance === 'extreme') && (
              <div className="space-y-4">
                <div className="text-lg font-bold text-gray-900 dark:text-white">LONGE</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">PERTO</div>
              </div>
            )}
          </div>
        </div>
      )
    }

    if (currentTest === 'tracking') {
      return (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-12 mb-6">
          <div className="w-48 h-48 mx-auto relative overflow-hidden">
            {currentQ.movement === 'horizontal' && (
              <div className="absolute top-1/2 left-0 w-4 h-4 bg-red-500 rounded-full animate-pulse transform -translate-y-1/2"></div>
            )}
            {currentQ.movement === 'vertical' && (
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-500 rounded-full animate-bounce transform -translate-x-1/2"></div>
            )}
            {currentQ.movement === 'circular' && (
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-500 rounded-full animate-spin transform -translate-x-1/2 -translate-y-1/2"></div>
            )}
            {(currentQ.movement === 'zigzag' || currentQ.movement === 'complex' || currentQ.movement === 'erratic') && (
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
            )}
            {(currentQ.movement === 'fast' || currentQ.movement === 'slow') && (
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
            )}
            {(currentQ.movement === 'multiple' || currentQ.movement === 'micro') && (
              <>
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </>
            )}
          </div>
        </div>
      )
    }

    if (currentTest === 'motionSensitivity') {
      return (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-12 mb-6">
          <div className="w-48 h-48 mx-auto relative">
            {currentQ.motion === 'large' && (
              <div className="w-16 h-16 bg-red-500 rounded-lg animate-pulse mx-auto"></div>
            )}
            {currentQ.motion === 'medium' && (
              <div className="w-8 h-8 bg-blue-500 rounded-lg animate-bounce mx-auto"></div>
            )}
            {currentQ.motion === 'small' && (
              <div className="w-4 h-4 bg-green-500 rounded-full animate-ping mx-auto"></div>
            )}
            {currentQ.motion === 'peripheral' && (
              <>
                <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              </>
            )}
            {(currentQ.motion === 'subtle' || currentQ.motion === 'micro') && (
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mx-auto"></div>
            )}
            {currentQ.motion === 'direction' && (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="ml-4 text-2xl">→</div>
              </div>
            )}
            {currentQ.motion === 'speed' && (
              <div className="w-6 h-6 bg-cyan-500 rounded-full animate-spin mx-auto"></div>
            )}
            {(currentQ.motion === 'multiple' || currentQ.motion === 'contrast') && (
              <>
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-300 rounded-full animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-blue-300 rounded-full animate-bounce"></div>
                <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-green-300 rounded-full animate-ping"></div>
              </>
            )}
          </div>
        </div>
      )
    }

    if (currentTest === 'lightSensitivity') {
      return (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-12 mb-6">
          <div className="w-48 h-48 mx-auto relative flex items-center justify-center">
            {currentQ.light === 'bright' && (
              <div className="w-24 h-24 bg-yellow-300 rounded-full shadow-2xl animate-pulse"></div>
            )}
            {currentQ.light === 'sudden' && (
              <div className="w-20 h-20 bg-white rounded-full shadow-xl animate-ping"></div>
            )}
            {currentQ.light === 'fluorescent' && (
              <div className="w-32 h-8 bg-blue-100 rounded-lg animate-pulse"></div>
            )}
            {currentQ.light === 'sunlight' && (
              <div className="w-28 h-28 bg-yellow-400 rounded-full shadow-2xl animate-bounce"></div>
            )}
            {currentQ.light === 'screen' && (
              <div className="w-24 h-16 bg-blue-200 rounded-lg animate-pulse"></div>
            )}
            {currentQ.light === 'headlights' && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-white rounded-full shadow-xl animate-pulse"></div>
                <div className="w-8 h-8 bg-white rounded-full shadow-xl animate-pulse"></div>
              </div>
            )}
            {currentQ.light === 'reflection' && (
              <div className="w-20 h-20 bg-gradient-to-r from-white to-gray-200 rounded-lg animate-pulse"></div>
            )}
            {(currentQ.light === 'indoor' || currentQ.light === 'recovery' || currentQ.light === 'symptoms') && (
              <div className="text-4xl animate-pulse">☀️</div>
            )}
          </div>
        </div>
      )
    }

    // Conteúdo padrão para outros testes
    return (
      <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-12 mb-6">
        {currentTest === 'acuity' && (
          <div className={`font-bold ${currentQ.size} text-gray-900 dark:text-white`}>
            {currentQ.letter}
          </div>
        )}
        
        {currentTest === 'color' && (
          <div className={`font-bold text-6xl ${currentQ.color}`}>
            {currentQ.letter}
          </div>
        )}
        
        {currentTest === 'contrast' && (
          <div className={`font-bold text-6xl text-gray-900 dark:text-white ${currentQ.contrast}`}>
            {currentQ.letter}
          </div>
        )}
        
        {currentTest === 'nightVision' && (
          <div className={`font-bold text-6xl text-gray-900 dark:text-white filter ${currentQ.brightness}`}>
            {currentQ.letter}
          </div>
        )}
        
        {currentTest === 'eyeStrain' && (
          <div className="text-center">
            <div className="text-4xl mb-4">👁️</div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Questão sobre fadiga ocular
            </p>
          </div>
        )}
      </div>
    )
  }

  const getQuestionText = () => {
    const questions = getCurrentQuestions()
    const currentQ = questions[currentQuestion]

    if (currentTest === 'astigmatism' || currentTest === 'depth' || currentTest === 'eyeStrain' || currentTest === 'peripheral' || currentTest === 'focus' || currentTest === 'tracking' || currentTest === 'motionSensitivity' || currentTest === 'lightSensitivity') {
      return currentQ.question
    }

    switch (currentTest) {
      case 'acuity': return 'Qual letra você vê?'
      case 'color': return 'Qual cor você vê?'
      case 'contrast': return 'Qual letra você consegue identificar?'
      case 'nightVision': return 'Qual letra você consegue ver no escuro?'
      default: return 'Responda a pergunta:'
    }
  }

  const questions = getCurrentQuestions()
  const currentQ = questions[currentQuestion]
  const testOrder = ['acuity', 'color', 'contrast', 'astigmatism', 'nightVision', 'depth', 'eyeStrain', 'peripheral', 'focus', 'tracking', 'motionSensitivity', 'lightSensitivity']
  const currentTestIndex = testOrder.indexOf(currentTest)

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Todos os Testes Concluídos!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Parabéns! Você completou todos os 12 testes de visão completos. 
            Seus resultados estão sendo processados...
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div>✓ Acuidade Visual</div>
            <div>✓ Percepção de Cores</div>
            <div>✓ Contraste Visual</div>
            <div>✓ Astigmatismo</div>
            <div>✓ Visão Noturna</div>
            <div>✓ Profundidade (3D)</div>
            <div>✓ Fadiga Ocular</div>
            <div>✓ Visão Periférica</div>
            <div>✓ Foco e Acomodação</div>
            <div>✓ Rastreamento Visual</div>
            <div>✓ Sensibilidade ao Movimento</div>
            <div>✓ Sensibilidade à Luz</div>
          </div>
          <div className="animate-pulse text-blue-600 dark:text-blue-400">
            Gerando relatório personalizado completo...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error Message */}
      {showError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {showError}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Testes de Visão Completos - VisioTest+
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentTestIndex + 1} de 12 testes
          </div>
        </div>
        
        <div className="flex gap-1 mb-4">
          {testOrder.map((test, index) => (
            <div
              key={test}
              className={`flex-1 h-2 rounded-full ${
                index < currentTestIndex
                  ? 'bg-green-500'
                  : index === currentTestIndex
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className={currentTestIndex >= 0 ? 'text-green-600' : ''}>Acuidade</span>
          <span className={currentTestIndex >= 1 ? 'text-green-600' : ''}>Cores</span>
          <span className={currentTestIndex >= 2 ? 'text-green-600' : ''}>Contraste</span>
          <span className={currentTestIndex >= 3 ? 'text-green-600' : ''}>Astigmatismo</span>
          <span className={currentTestIndex >= 4 ? 'text-green-600' : ''}>Noturna</span>
          <span className={currentTestIndex >= 5 ? 'text-green-600' : ''}>3D</span>
          <span className={currentTestIndex >= 6 ? 'text-green-600' : ''}>Fadiga</span>
          <span className={currentTestIndex >= 7 ? 'text-green-600' : ''}>Periférica</span>
          <span className={currentTestIndex >= 8 ? 'text-green-600' : ''}>Foco</span>
          <span className={currentTestIndex >= 9 ? 'text-green-600' : ''}>Rastreio</span>
          <span className={currentTestIndex >= 10 ? 'text-green-600' : ''}>Movimento</span>
          <span className={currentTestIndex >= 11 ? 'text-green-600' : ''}>Luz</span>
        </div>
      </div>

      {/* Current Test */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
            {getTestIcon(currentTest)}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getTestTitle(currentTest)}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {getTestDescription(currentTest)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pergunta {currentQuestion + 1} de {questions.length} • Nível {currentQ.level}
          </p>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          {renderTestContent()}

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {getQuestionText()}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="p-4 bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-900 dark:text-white rounded-lg transition-colors font-semibold text-lg hover:scale-105 transform duration-200"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
            {currentTest === 'acuity' && 'Mantenha uma distância confortável da tela e identifique a letra mostrada.'}
            {currentTest === 'color' && 'Identifique a cor da letra apresentada na tela.'}
            {currentTest === 'contrast' && 'Observe atentamente e identifique a letra com baixo contraste.'}
            {currentTest === 'astigmatism' && 'Observe as linhas e responda sobre a nitidez que você percebe.'}
            {currentTest === 'nightVision' && 'Teste sua capacidade de ver em condições de pouca luminosidade.'}
            {currentTest === 'depth' && 'Observe as formas e responda sobre a percepção de profundidade.'}
            {currentTest === 'eyeStrain' && 'Responda honestamente sobre seus hábitos e sintomas visuais.'}
            {currentTest === 'peripheral' && 'Mantenha o olhar fixo no ponto central vermelho e responda sobre o que vê nas bordas.'}
            {currentTest === 'focus' && 'Teste sua capacidade de focar em diferentes distâncias e tamanhos de texto.'}
            {currentTest === 'tracking' && 'Observe os objetos em movimento e responda sobre sua capacidade de acompanhá-los.'}
            {currentTest === 'motionSensitivity' && 'Avalie sua capacidade de detectar diferentes tipos de movimento.'}
            {currentTest === 'lightSensitivity' && 'Responda sobre sua sensibilidade a diferentes tipos e intensidades de luz.'}
          </p>
        </div>
      </div>
    </div>
  )
}