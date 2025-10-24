'use client'

import { useState, useEffect } from 'react'
import { Eye, Target, Palette, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import { UserProfile, TestResult } from '@/app/page'

interface VisionTestsProps {
  userProfile: UserProfile
  onComplete: (results: TestResult[]) => void
}

export function VisionTests({ userProfile, onComplete }: VisionTestsProps) {
  const [currentTest, setCurrentTest] = useState<'acuity' | 'contrast' | 'color'>('acuity')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [responses, setResponses] = useState<any[]>([])
  const [showInstructions, setShowInstructions] = useState(true)

  const tests = [
    { id: 'acuity', name: 'Acuidade Visual', icon: Eye, description: 'Teste de nitidez da visão' },
    { id: 'contrast', name: 'Sensibilidade ao Contraste', icon: Target, description: 'Capacidade de distinguir contrastes' },
    { id: 'color', name: 'Visão de Cores', icon: Palette, description: 'Detecção de deficiências cromáticas' }
  ]

  const currentTestInfo = tests.find(t => t.id === currentTest)!

  const handleTestComplete = (score: number, testResponses: any[]) => {
    const result: TestResult = {
      id: Date.now().toString(),
      userId: userProfile.id,
      testType: currentTest,
      score,
      level: currentLevel,
      responses: testResponses,
      completedAt: new Date()
    }

    const newResults = [...testResults, result]
    setTestResults(newResults)

    // Avançar para próximo teste ou finalizar
    const currentIndex = tests.findIndex(t => t.id === currentTest)
    if (currentIndex < tests.length - 1) {
      setCurrentTest(tests[currentIndex + 1].id as any)
      setCurrentLevel(1)
      setResponses([])
      setShowInstructions(true)
    } else {
      onComplete(newResults)
    }
  }

  const renderTestContent = () => {
    if (showInstructions) {
      return (
        <TestInstructions
          test={currentTestInfo}
          onStart={() => setShowInstructions(false)}
        />
      )
    }

    switch (currentTest) {
      case 'acuity':
        return (
          <AcuityTest
            level={currentLevel}
            onComplete={handleTestComplete}
            userProfile={userProfile}
          />
        )
      case 'contrast':
        return (
          <ContrastTest
            level={currentLevel}
            onComplete={handleTestComplete}
            userProfile={userProfile}
          />
        )
      case 'color':
        return (
          <ColorTest
            level={currentLevel}
            onComplete={handleTestComplete}
            userProfile={userProfile}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Testes de Visão
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {testResults.length + 1} de {tests.length}
          </div>
        </div>
        
        <div className="flex gap-2">
          {tests.map((test, index) => {
            const isCompleted = testResults.some(r => r.testType === test.id)
            const isCurrent = test.id === currentTest
            
            return (
              <div
                key={test.id}
                className={`flex-1 h-2 rounded-full ${
                  isCompleted ? 'bg-green-500' :
                  isCurrent ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-600'
                }`}
              />
            )
          })}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          {tests.map((test) => (
            <span key={test.id} className="flex items-center gap-1">
              <test.icon className="w-3 h-3" />
              {test.name}
            </span>
          ))}
        </div>
      </div>

      {/* Test Content */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {renderTestContent()}
      </div>
    </div>
  )
}

// Componente de Instruções
function TestInstructions({ test, onStart }: { test: any, onStart: () => void }) {
  const instructions = {
    acuity: [
      'Posicione-se a aproximadamente 60cm da tela',
      'Mantenha os olhos na altura da tela',
      'Se usa óculos, mantenha-os durante o teste',
      'Identifique a direção das aberturas nas letras E',
      'O teste ficará progressivamente mais difícil'
    ],
    contrast: [
      'Ajuste o brilho da tela para um nível confortável',
      'Identifique padrões com diferentes níveis de contraste',
      'Responda mesmo que não tenha certeza',
      'O teste avalia sua sensibilidade ao contraste',
      'Concentre-se no centro de cada imagem'
    ],
    color: [
      'Certifique-se de estar em um ambiente bem iluminado',
      'Identifique números ou formas nas imagens coloridas',
      'Não force a visão, responda naturalmente',
      'Este teste detecta deficiências na visão de cores',
      'Cada imagem aparecerá por alguns segundos'
    ]
  }

  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <test.icon className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {test.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        {test.description}
      </p>

      <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-6 mb-8">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Instruções:
        </h4>
        <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
          {instructions[test.id as keyof typeof instructions].map((instruction, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              {instruction}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onStart}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
      >
        Iniciar Teste
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

// Teste de Acuidade Visual
function AcuityTest({ level, onComplete, userProfile }: { level: number, onComplete: (score: number, responses: any[]) => void, userProfile: UserProfile }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<any[]>([])
  const [showResult, setShowResult] = useState(false)

  // Gerar questões baseadas no nível
  const generateQuestions = () => {
    const questions = []
    const baseSize = Math.max(100 - (level - 1) * 15, 20) // Tamanho diminui com o nível
    
    for (let i = 0; i < 8; i++) {
      const directions = ['up', 'down', 'left', 'right']
      const correctDirection = directions[Math.floor(Math.random() * directions.length)]
      
      questions.push({
        id: i,
        size: baseSize - i * 3,
        direction: correctDirection,
        options: directions
      })
    }
    
    return questions
  }

  const [questions] = useState(generateQuestions())

  const handleAnswer = (answer: string) => {
    const question = questions[currentQuestion]
    const isCorrect = answer === question.direction
    
    const newResponse = {
      questionId: question.id,
      correct: isCorrect,
      userAnswer: answer,
      correctAnswer: question.direction,
      size: question.size,
      timestamp: new Date()
    }

    const newResponses = [...responses, newResponse]
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calcular score
      const correctAnswers = newResponses.filter(r => r.correct).length
      const score = Math.round((correctAnswers / questions.length) * 100)
      
      setTimeout(() => {
        onComplete(score, newResponses)
      }, 1000)
      
      setShowResult(true)
    }
  }

  const currentQ = questions[currentQuestion]

  if (showResult) {
    const correctAnswers = responses.filter(r => r.correct).length
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Teste de Acuidade Concluído!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Você acertou {correctAnswers} de {questions.length} questões
        </p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Teste de Acuidade Visual - Nível {level}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Identifique a direção da abertura na letra E
        </p>

        {/* Letra E */}
        <div className="flex justify-center mb-8">
          <div 
            className="bg-black dark:bg-white relative"
            style={{
              width: `${currentQ.size}px`,
              height: `${currentQ.size}px`,
              transform: currentQ.direction === 'up' ? 'rotate(-90deg)' :
                        currentQ.direction === 'down' ? 'rotate(90deg)' :
                        currentQ.direction === 'left' ? 'rotate(180deg)' : 'none'
            }}
          >
            {/* Simulação da letra E */}
            <div className="absolute inset-0 flex flex-col justify-between p-1">
              <div className="bg-white dark:bg-slate-900 h-1/5"></div>
              <div className="bg-white dark:bg-slate-900 h-1/5"></div>
              <div className="bg-white dark:bg-slate-900 h-1/5"></div>
            </div>
            <div className="absolute right-0 top-0 w-3/5 h-1/5 bg-white dark:bg-slate-900"></div>
            <div className="absolute right-0 top-2/5 w-2/5 h-1/5 bg-white dark:bg-slate-900"></div>
            <div className="absolute right-0 bottom-0 w-3/5 h-1/5 bg-white dark:bg-slate-900"></div>
          </div>
        </div>

        {/* Opções de Resposta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
          {currentQ.options.map((direction) => (
            <button
              key={direction}
              onClick={() => handleAnswer(direction)}
              className="p-4 bg-blue-100 dark:bg-slate-700 hover:bg-blue-200 dark:hover:bg-slate-600 rounded-lg transition-colors flex flex-col items-center gap-2"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {direction === 'up' && '↑'}
                {direction === 'down' && '↓'}
                {direction === 'left' && '←'}
                {direction === 'right' && '→'}
              </div>
              <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                {direction === 'up' ? 'Cima' :
                 direction === 'down' ? 'Baixo' :
                 direction === 'left' ? 'Esquerda' : 'Direita'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Teste de Contraste (simplificado)
function ContrastTest({ level, onComplete, userProfile }: { level: number, onComplete: (score: number, responses: any[]) => void, userProfile: UserProfile }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<any[]>([])
  const [showResult, setShowResult] = useState(false)

  const generateQuestions = () => {
    const questions = []
    const baseContrast = Math.max(0.8 - (level - 1) * 0.1, 0.1)
    
    for (let i = 0; i < 6; i++) {
      const hasPattern = Math.random() > 0.5
      const contrast = Math.max(baseContrast - i * 0.05, 0.05)
      
      questions.push({
        id: i,
        hasPattern,
        contrast,
        patternType: hasPattern ? ['vertical', 'horizontal'][Math.floor(Math.random() * 2)] : null
      })
    }
    
    return questions
  }

  const [questions] = useState(generateQuestions())

  const handleAnswer = (answer: boolean) => {
    const question = questions[currentQuestion]
    const isCorrect = answer === question.hasPattern
    
    const newResponse = {
      questionId: question.id,
      correct: isCorrect,
      userAnswer: answer,
      correctAnswer: question.hasPattern,
      contrast: question.contrast,
      timestamp: new Date()
    }

    const newResponses = [...responses, newResponse]
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const correctAnswers = newResponses.filter(r => r.correct).length
      const score = Math.round((correctAnswers / questions.length) * 100)
      
      setTimeout(() => {
        onComplete(score, newResponses)
      }, 1000)
      
      setShowResult(true)
    }
  }

  const currentQ = questions[currentQuestion]

  if (showResult) {
    const correctAnswers = responses.filter(r => r.correct).length
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Teste de Contraste Concluído!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Você acertou {correctAnswers} de {questions.length} questões
        </p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Teste de Sensibilidade ao Contraste - Nível {level}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Você consegue ver um padrão nesta imagem?
        </p>

        {/* Padrão de Contraste */}
        <div className="flex justify-center mb-8">
          <div 
            className="w-48 h-48 border-2 border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden"
            style={{
              background: currentQ.hasPattern 
                ? `repeating-linear-gradient(${currentQ.patternType === 'vertical' ? '90deg' : '0deg'}, 
                   rgba(128,128,128,${currentQ.contrast}), 
                   rgba(128,128,128,${currentQ.contrast}) 8px, 
                   rgba(128,128,128,${Math.max(currentQ.contrast - 0.2, 0)}) 8px, 
                   rgba(128,128,128,${Math.max(currentQ.contrast - 0.2, 0)}) 16px)`
                : `rgba(128,128,128,${currentQ.contrast})`
            }}
          />
        </div>

        {/* Opções de Resposta */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleAnswer(true)}
            className="px-8 py-4 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 text-green-800 dark:text-green-200 rounded-lg transition-colors font-medium"
          >
            Sim, vejo um padrão
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="px-8 py-4 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200 rounded-lg transition-colors font-medium"
          >
            Não vejo padrão
          </button>
        </div>
      </div>
    </div>
  )
}

// Teste de Cores (simplificado)
function ColorTest({ level, onComplete, userProfile }: { level: number, onComplete: (score: number, responses: any[]) => void, userProfile: UserProfile }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<any[]>([])
  const [showResult, setShowResult] = useState(false)

  const generateQuestions = () => {
    const questions = []
    const numbers = ['2', '5', '8', '3', '6', '9']
    const colorPairs = [
      { bg: '#ff6b6b', fg: '#4ecdc4' }, // Vermelho/Verde
      { bg: '#45b7d1', fg: '#f9ca24' }, // Azul/Amarelo
      { bg: '#6c5ce7', fg: '#a29bfe' }, // Roxo claro
      { bg: '#fd79a8', fg: '#fdcb6e' }, // Rosa/Laranja
      { bg: '#00b894', fg: '#e17055' }, // Verde/Vermelho
      { bg: '#0984e3', fg: '#e84393' }  // Azul/Rosa
    ]
    
    for (let i = 0; i < 6; i++) {
      const number = numbers[i]
      const colors = colorPairs[i]
      const difficulty = Math.min(level + i, 5)
      
      questions.push({
        id: i,
        number,
        backgroundColor: colors.bg,
        foregroundColor: colors.fg,
        difficulty,
        options: [number, ...numbers.filter(n => n !== number).slice(0, 3)].sort(() => Math.random() - 0.5)
      })
    }
    
    return questions
  }

  const [questions] = useState(generateQuestions())

  const handleAnswer = (answer: string) => {
    const question = questions[currentQuestion]
    const isCorrect = answer === question.number
    
    const newResponse = {
      questionId: question.id,
      correct: isCorrect,
      userAnswer: answer,
      correctAnswer: question.number,
      difficulty: question.difficulty,
      timestamp: new Date()
    }

    const newResponses = [...responses, newResponse]
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const correctAnswers = newResponses.filter(r => r.correct).length
      const score = Math.round((correctAnswers / questions.length) * 100)
      
      setTimeout(() => {
        onComplete(score, newResponses)
      }, 1000)
      
      setShowResult(true)
    }
  }

  const currentQ = questions[currentQuestion]

  if (showResult) {
    const correctAnswers = responses.filter(r => r.correct).length
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Teste de Cores Concluído!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Você acertou {correctAnswers} de {questions.length} questões
        </p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Teste de Visão de Cores - Nível {level}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Que número você consegue ver na imagem?
        </p>

        {/* Círculo Colorido com Número */}
        <div className="flex justify-center mb-8">
          <div 
            className="w-48 h-48 rounded-full flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: currentQ.backgroundColor }}
          >
            {/* Padrão de pontos simulando teste de Ishihara */}
            <div className="absolute inset-0 opacity-30">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 8 + 4 + 'px',
                    height: Math.random() * 8 + 4 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    backgroundColor: Math.random() > 0.5 ? currentQ.backgroundColor : currentQ.foregroundColor,
                    opacity: Math.random() * 0.7 + 0.3
                  }}
                />
              ))}
            </div>
            
            {/* Número */}
            <span 
              className="text-6xl font-bold relative z-10"
              style={{ 
                color: currentQ.foregroundColor,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {currentQ.number}
            </span>
          </div>
        </div>

        {/* Opções de Resposta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
          {currentQ.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="p-4 bg-blue-100 dark:bg-slate-700 hover:bg-blue-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-xl font-bold text-gray-800 dark:text-gray-200"
            >
              {option}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => handleAnswer('none')}
          className="mt-4 px-6 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
        >
          Não consigo ver nenhum número
        </button>
      </div>
    </div>
  )
}