'use client'

import { useState, useEffect } from 'react'
import { Eye, Target, Palette, ChevronRight, Check, X, Moon, Layers, Zap, Brain, Gauge, Activity } from 'lucide-react'
import { UserProfile, TestResult } from '@/app/page'
import { supabase } from '@/lib/supabase'

interface VisionTestsProps {
  userProfile: UserProfile
  onComplete: (results: TestResult[]) => void
}

export function VisionTests({ userProfile, onComplete }: VisionTestsProps) {
  const [currentTest, setCurrentTest] = useState<'acuity' | 'color' | 'contrast' | 'astigmatism' | 'nightVision' | 'depth' | 'eyeStrain' | 'peripheral' | 'focus' | 'tracking'>('acuity')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<any[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  // Mensagens de erro divertidas
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
    "Rapaz, complicou! 🤯"
  ]

  const getRandomErrorMessage = () => {
    return errorMessages[Math.floor(Math.random() * errorMessages.length)]
  }

  // Teste de Acuidade Visual - MAIS TESTES
  const acuityQuestions = [
    { level: 1, letter: 'E', size: 'text-8xl', options: ['E', 'F', 'P', 'T'] },
    { level: 2, letter: 'F', size: 'text-6xl', options: ['F', 'E', 'L', 'T'] },
    { level: 3, letter: 'P', size: 'text-4xl', options: ['P', 'R', 'B', 'F'] },
    { level: 4, letter: 'T', size: 'text-2xl', options: ['T', 'F', 'L', 'I'] },
    { level: 5, letter: 'L', size: 'text-xl', options: ['L', 'I', 'T', 'F'] },
    { level: 6, letter: 'H', size: 'text-lg', options: ['H', 'N', 'M', 'K'] },
    { level: 7, letter: 'D', size: 'text-base', options: ['D', 'O', 'P', 'B'] },
    { level: 8, letter: 'N', size: 'text-sm', options: ['N', 'M', 'H', 'U'] }
  ]

  // Teste de Percepção de Cores - MAIS TESTES
  const colorQuestions = [
    { level: 1, color: 'text-red-500', letter: 'R', options: ['Vermelho', 'Verde', 'Azul', 'Amarelo'] },
    { level: 2, color: 'text-green-500', letter: 'G', options: ['Verde', 'Vermelho', 'Azul', 'Roxo'] },
    { level: 3, color: 'text-blue-500', letter: 'B', options: ['Azul', 'Verde', 'Roxo', 'Vermelho'] },
    { level: 4, color: 'text-yellow-500', letter: 'Y', options: ['Amarelo', 'Laranja', 'Verde', 'Vermelho'] },
    { level: 5, color: 'text-purple-500', letter: 'P', options: ['Roxo', 'Azul', 'Rosa', 'Vermelho'] },
    { level: 6, color: 'text-orange-500', letter: 'O', options: ['Laranja', 'Vermelho', 'Amarelo', 'Rosa'] },
    { level: 7, color: 'text-pink-500', letter: 'K', options: ['Rosa', 'Roxo', 'Vermelho', 'Laranja'] },
    { level: 8, color: 'text-cyan-500', letter: 'C', options: ['Ciano', 'Azul', 'Verde', 'Roxo'] }
  ]

  // Teste de Contraste Visual - MAIS TESTES
  const contrastQuestions = [
    { level: 1, contrast: 'opacity-90', letter: 'C', options: ['C', 'G', 'O', 'Q'] },
    { level: 2, contrast: 'opacity-70', letter: 'G', options: ['G', 'C', 'O', 'D'] },
    { level: 3, contrast: 'opacity-50', letter: 'O', options: ['O', 'Q', 'C', 'G'] },
    { level: 4, contrast: 'opacity-30', letter: 'D', options: ['D', 'O', 'P', 'B'] },
    { level: 5, contrast: 'opacity-20', letter: 'B', options: ['B', 'P', 'R', 'D'] },
    { level: 6, contrast: 'opacity-15', letter: 'R', options: ['R', 'P', 'B', 'F'] },
    { level: 7, contrast: 'opacity-10', letter: 'S', options: ['S', 'G', 'C', 'O'] },
    { level: 8, contrast: 'opacity-5', letter: 'A', options: ['A', 'R', 'H', 'N'] }
  ]

  // Teste de Astigmatismo - MAIS TESTES
  const astigmatismQuestions = [
    { level: 1, pattern: 'horizontal', question: 'As linhas horizontais estão nítidas?', options: ['Sim', 'Não', 'Parcialmente', 'Não sei'] },
    { level: 2, pattern: 'vertical', question: 'As linhas verticais estão nítidas?', options: ['Sim', 'Não', 'Parcialmente', 'Não sei'] },
    { level: 3, pattern: 'diagonal1', question: 'As linhas diagonais (/) estão nítidas?', options: ['Sim', 'Não', 'Parcialmente', 'Não sei'] },
    { level: 4, pattern: 'diagonal2', question: 'As linhas diagonais (\\) estão nítidas?', options: ['Sim', 'Não', 'Parcialmente', 'Não sei'] },
    { level: 5, pattern: 'radial', question: 'Todas as linhas radiais estão igualmente nítidas?', options: ['Sim', 'Não', 'Algumas borradas', 'Muito borradas'] },
    { level: 6, pattern: 'cross', question: 'O padrão cruzado está nítido?', options: ['Perfeitamente', 'Levemente borrado', 'Muito borrado', 'Não vejo'] },
    { level: 7, pattern: 'grid', question: 'A grade está uniforme?', options: ['Sim', 'Algumas linhas borradas', 'Muito distorcida', 'Não consigo ver'] },
    { level: 8, pattern: 'circle', question: 'O círculo parece perfeitamente redondo?', options: ['Sim', 'Levemente oval', 'Muito oval', 'Distorcido'] }
  ]

  // Teste de Visão Noturna - MAIS TESTES
  const nightVisionQuestions = [
    { level: 1, brightness: 'brightness-75', letter: 'N', options: ['N', 'M', 'H', 'U'] },
    { level: 2, brightness: 'brightness-50', letter: 'M', options: ['M', 'N', 'W', 'V'] },
    { level: 3, brightness: 'brightness-25', letter: 'H', options: ['H', 'N', 'M', 'K'] },
    { level: 4, brightness: 'brightness-[0.15]', letter: 'U', options: ['U', 'V', 'Y', 'N'] },
    { level: 5, brightness: 'brightness-[0.1]', letter: 'V', options: ['V', 'U', 'Y', 'W'] },
    { level: 6, brightness: 'brightness-[0.08]', letter: 'K', options: ['K', 'H', 'N', 'M'] },
    { level: 7, brightness: 'brightness-[0.05]', letter: 'W', options: ['W', 'V', 'M', 'N'] },
    { level: 8, brightness: 'brightness-[0.03]', letter: 'Z', options: ['Z', 'N', 'M', 'W'] }
  ]

  // Teste de Profundidade (3D) - MAIS TESTES
  const depthQuestions = [
    { level: 1, depth: 'near', question: 'Qual círculo parece estar mais próximo?', options: ['Esquerdo', 'Direito', 'Ambos iguais', 'Não consigo ver'] },
    { level: 2, depth: 'far', question: 'Qual quadrado parece estar mais distante?', options: ['Superior', 'Inferior', 'Ambos iguais', 'Não consigo ver'] },
    { level: 3, depth: 'overlap', question: 'Quantas camadas você consegue distinguir?', options: ['1', '2', '3', 'Mais de 3'] },
    { level: 4, depth: 'stereo', question: 'A imagem parece ter profundidade?', options: ['Sim, claramente', 'Um pouco', 'Não', 'Não sei'] },
    { level: 5, depth: 'complex', question: 'Consegue ver o objeto em 3D?', options: ['Perfeitamente', 'Parcialmente', 'Dificilmente', 'Não'] },
    { level: 6, depth: 'layers', question: 'Quantas camadas de profundidade vê?', options: ['4 ou mais', '3', '2', '1 ou nenhuma'] },
    { level: 7, depth: 'perspective', question: 'A perspectiva está clara?', options: ['Muito clara', 'Clara', 'Confusa', 'Não vejo'] },
    { level: 8, depth: 'distance', question: 'Consegue estimar a distância?', options: ['Facilmente', 'Com dificuldade', 'Muito difícil', 'Impossível'] }
  ]

  // Teste de Fadiga Ocular - MAIS TESTES
  const eyeStrainQuestions = [
    { level: 1, strain: 'blink', question: 'Sente necessidade de piscar mais que o normal?', options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente'] },
    { level: 2, strain: 'dry', question: 'Seus olhos ficam secos durante o uso de telas?', options: ['Nunca', 'Raramente', 'Às vezes', 'Sempre'] },
    { level: 3, strain: 'focus', question: 'Tem dificuldade para focar após usar telas?', options: ['Nunca', 'Raramente', 'Às vezes', 'Sempre'] },
    { level: 4, strain: 'headache', question: 'Sente dor de cabeça após usar dispositivos?', options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente'] },
    { level: 5, strain: 'tired', question: 'Seus olhos ficam cansados rapidamente?', options: ['Nunca', 'Após 4h+', 'Após 2h', 'Após 1h'] },
    { level: 6, strain: 'burning', question: 'Sente ardência nos olhos?', options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente'] },
    { level: 7, strain: 'watery', question: 'Seus olhos lacrimejam excessivamente?', options: ['Nunca', 'Raramente', 'Às vezes', 'Sempre'] },
    { level: 8, strain: 'sensitivity', question: 'Tem sensibilidade à luz das telas?', options: ['Nunca', 'Pouca', 'Moderada', 'Muita'] }
  ]

  // NOVOS TESTES ADICIONADOS

  // Teste de Visão Periférica
  const peripheralQuestions = [
    { level: 1, position: 'center', question: 'Vê o ponto central claramente?', options: ['Sim', 'Não', 'Parcialmente', 'Borrado'] },
    { level: 2, position: 'left', question: 'Consegue ver o objeto à esquerda?', options: ['Claramente', 'Borrado', 'Mal consigo ver', 'Não vejo'] },
    { level: 3, position: 'right', question: 'Consegue ver o objeto à direita?', options: ['Claramente', 'Borrado', 'Mal consigo ver', 'Não vejo'] },
    { level: 4, position: 'top', question: 'Vê o objeto na parte superior?', options: ['Claramente', 'Borrado', 'Mal consigo ver', 'Não vejo'] },
    { level: 5, position: 'bottom', question: 'Vê o objeto na parte inferior?', options: ['Claramente', 'Borrado', 'Mal consigo ver', 'Não vejo'] },
    { level: 6, position: 'multiple', question: 'Quantos objetos periféricos consegue ver?', options: ['4', '3', '2', '1 ou nenhum'] },
    { level: 7, position: 'far-left', question: 'Vê o objeto bem à esquerda?', options: ['Sim', 'Parcialmente', 'Muito pouco', 'Não'] },
    { level: 8, position: 'far-right', question: 'Vê o objeto bem à direita?', options: ['Sim', 'Parcialmente', 'Muito pouco', 'Não'] }
  ]

  // Teste de Foco e Acomodação
  const focusQuestions = [
    { level: 1, distance: 'near', question: 'O texto próximo está nítido?', options: ['Muito nítido', 'Nítido', 'Borrado', 'Muito borrado'] },
    { level: 2, distance: 'far', question: 'O texto distante está nítido?', options: ['Muito nítido', 'Nítido', 'Borrado', 'Muito borrado'] },
    { level: 3, distance: 'transition', question: 'Consegue focar rapidamente mudando a distância?', options: ['Instantâneo', 'Rápido', 'Lento', 'Muito lento'] },
    { level: 4, distance: 'micro', question: 'Consegue ler texto muito pequeno?', options: ['Facilmente', 'Com esforço', 'Dificilmente', 'Não consigo'] },
    { level: 5, distance: 'macro', question: 'Vê detalhes em objetos distantes?', options: ['Claramente', 'Razoavelmente', 'Pouco', 'Nada'] },
    { level: 6, distance: 'alternating', question: 'Foco alterna bem entre perto e longe?', options: ['Perfeitamente', 'Bem', 'Com dificuldade', 'Não alterna'] },
    { level: 7, distance: 'sustained', question: 'Mantém foco por tempo prolongado?', options: ['Facilmente', 'Razoavelmente', 'Com esforço', 'Não mantenho'] },
    { level: 8, distance: 'precision', question: 'Foco de precisão funciona bem?', options: ['Excelente', 'Bom', 'Regular', 'Ruim'] }
  ]

  // Teste de Rastreamento Visual
  const trackingQuestions = [
    { level: 1, movement: 'horizontal', question: 'Consegue acompanhar movimento horizontal?', options: ['Perfeitamente', 'Bem', 'Com dificuldade', 'Não consigo'] },
    { level: 2, movement: 'vertical', question: 'Consegue acompanhar movimento vertical?', options: ['Perfeitamente', 'Bem', 'Com dificuldade', 'Não consigo'] },
    { level: 3, movement: 'circular', question: 'Acompanha movimento circular?', options: ['Suavemente', 'Razoavelmente', 'Aos trancos', 'Não acompanho'] },
    { level: 4, movement: 'zigzag', question: 'Segue padrão em zigue-zague?', options: ['Facilmente', 'Com esforço', 'Dificilmente', 'Perco o objeto'] },
    { level: 5, movement: 'fast', question: 'Acompanha movimento rápido?', options: ['Sim', 'Parcialmente', 'Mal consigo', 'Não consigo'] },
    { level: 6, movement: 'slow', question: 'Segue movimento muito lento?', options: ['Perfeitamente', 'Bem', 'Perco às vezes', 'Sempre perco'] },
    { level: 7, movement: 'multiple', question: 'Rastreia múltiplos objetos?', options: ['Todos', 'Maioria', 'Poucos', 'Nenhum'] },
    { level: 8, movement: 'complex', question: 'Segue padrão complexo?', options: ['Facilmente', 'Com concentração', 'Dificilmente', 'Impossível'] }
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
      // Aqui você pode implementar um toast ou modal para mostrar a mensagem
      console.log(errorMsg) // Por enquanto só no console
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

      // NOVA SEQUÊNCIA DE TESTES (alterada conforme solicitado)
      const testOrder = ['peripheral', 'acuity', 'focus', 'color', 'tracking', 'contrast', 'astigmatism', 'nightVision', 'depth', 'eyeStrain']
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
            {(currentQ.depth === 'stereo' || currentQ.depth === 'complex' || currentQ.depth === 'perspective' || currentQ.depth === 'distance') && (
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
            {(currentQ.distance === 'transition' || currentQ.distance === 'alternating' || currentQ.distance === 'sustained' || currentQ.distance === 'precision') && (
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
            {(currentQ.movement === 'zigzag' || currentQ.movement === 'complex') && (
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
            )}
            {(currentQ.movement === 'fast' || currentQ.movement === 'slow') && (
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
            )}
            {currentQ.movement === 'multiple' && (
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

    if (currentTest === 'astigmatism' || currentTest === 'depth' || currentTest === 'eyeStrain' || currentTest === 'peripheral' || currentTest === 'focus' || currentTest === 'tracking') {
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
  const testOrder = ['peripheral', 'acuity', 'focus', 'color', 'tracking', 'contrast', 'astigmatism', 'nightVision', 'depth', 'eyeStrain']
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
            Parabéns! Você completou todos os 10 testes de visão. 
            Seus resultados estão sendo processados...
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div>✓ Visão Periférica</div>
            <div>✓ Acuidade Visual</div>
            <div>✓ Foco e Acomodação</div>
            <div>✓ Percepção de Cores</div>
            <div>✓ Rastreamento Visual</div>
            <div>✓ Contraste Visual</div>
            <div>✓ Astigmatismo</div>
            <div>✓ Visão Noturna</div>
            <div>✓ Profundidade (3D)</div>
            <div>✓ Fadiga Ocular</div>
          </div>
          <div className="animate-pulse text-blue-600 dark:text-blue-400">
            Gerando relatório personalizado...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Testes de Visão Completos
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentTestIndex + 1} de 10 testes
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
          <span className={currentTestIndex >= 0 ? 'text-green-600' : ''}>Periférica</span>
          <span className={currentTestIndex >= 1 ? 'text-green-600' : ''}>Acuidade</span>
          <span className={currentTestIndex >= 2 ? 'text-green-600' : ''}>Foco</span>
          <span className={currentTestIndex >= 3 ? 'text-green-600' : ''}>Cores</span>
          <span className={currentTestIndex >= 4 ? 'text-green-600' : ''}>Rastreio</span>
          <span className={currentTestIndex >= 5 ? 'text-green-600' : ''}>Contraste</span>
          <span className={currentTestIndex >= 6 ? 'text-green-600' : ''}>Astigmatismo</span>
          <span className={currentTestIndex >= 7 ? 'text-green-600' : ''}>Noturna</span>
          <span className={currentTestIndex >= 8 ? 'text-green-600' : ''}>3D</span>
          <span className={currentTestIndex >= 9 ? 'text-green-600' : ''}>Fadiga</span>
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
            Pergunta {currentQuestion + 1} de {questions.length}
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
              className="p-4 bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-900 dark:text-white rounded-lg transition-colors font-semibold text-lg"
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
          </p>
        </div>
      </div>
    </div>
  )
}