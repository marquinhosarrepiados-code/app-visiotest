'use client'

import { useState, useEffect } from 'react'
import { TestType, TestResult, TestResponse } from '@/lib/types'
import { testConfigs } from '@/lib/testConfig'
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface VisionTestProps {
  testType: TestType
  onComplete: (result: TestResult) => void
  onBack: () => void
}

export function VisionTest({ testType, onComplete, onBack }: VisionTestProps) {
  const config = testConfigs[testType]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<TestResponse[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date())
  const [isCompleted, setIsCompleted] = useState(false)

  const currentQuestion = config.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / config.questions.length) * 100

  useEffect(() => {
    setQuestionStartTime(new Date())
  }, [currentQuestionIndex])

  const getRandomErrorMessage = () => {
    const messages = [
      "Ops, está errado! 😅",
      "Eita, não foi dessa vez! 🤔",
      "Preocupante... Tente novamente! 😰",
      "Hmm, não é bem assim! 🧐",
      "Opa, errou! Mas não desista! 💪",
      "Ih, não foi! Concentre-se! 👀",
      "Que pena, incorreto! 😔",
      "Não foi dessa vez! Continue! 🚀"
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getRandomSuccessMessage = () => {
    const messages = [
      "Perfeito! Acertou! 🎉",
      "Excelente! Muito bem! ⭐",
      "Isso aí! Correto! 👏",
      "Parabéns! Acerto! 🏆",
      "Ótimo! Continue assim! 💯",
      "Fantástico! Certo! 🌟",
      "Maravilha! Acertou! 🎯",
      "Sensacional! Correto! 🚀"
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const questionEndTime = new Date()
    const timeSpent = questionEndTime.getTime() - questionStartTime.getTime()
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    const response: TestResponse = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent
    }

    setResponses(prev => [...prev, response])
    setShowFeedback(true)

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (currentQuestionIndex < config.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer('')
        setShowFeedback(false)
      } else {
        completeTest([...responses, response])
      }
    }, 2000)
  }

  const completeTest = (allResponses: TestResponse[]) => {
    const endTime = new Date()
    const totalTimeSpent = endTime.getTime() - startTime.getTime()
    
    const correctAnswers = allResponses.filter(r => r.isCorrect).length
    const score = Math.round((correctAnswers / config.questions.length) * 100)
    const accuracy = correctAnswers / config.questions.length

    const result: TestResult = {
      id: `result_${Date.now()}`,
      testType,
      score,
      maxScore: 100,
      accuracy,
      timeSpent: totalTimeSpent,
      responses: allResponses,
      completedAt: new Date()
    }

    setIsCompleted(true)
    
    // Delay to show completion animation
    setTimeout(() => {
      onComplete(result)
    }, 2000)
  }

  const renderTestContent = () => {
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                {/* Simulated visual test content */}
                <div className="text-4xl font-bold text-gray-600 dark:text-gray-300">
                  {testType.includes('acuidade') ? 'E' : 
                   testType.includes('cores') ? '●' :
                   testType.includes('contraste') ? '◐' : '▲'}
                </div>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {currentQuestion.question}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 'color_match':
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto rounded-lg flex items-center justify-center mb-4"
                   style={{ backgroundColor: getColorForTest() }}>
                <div className="text-2xl">
                  {testType.includes('avancado') ? '?' : '●'}
                </div>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {currentQuestion.question}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <div className="text-2xl">👁️</div>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {currentQuestion.question}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )
    }
  }

  const getColorForTest = () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
    return colors[currentQuestionIndex % colors.length]
  }

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Teste Concluído!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Processando seus resultados...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {config.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Questão {currentQuestionIndex + 1} de {config.questions.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock className="w-5 h-5 mr-2" />
            <span>{config.estimatedTime} min</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Feedback Overlay */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center">
              {responses[responses.length - 1]?.isCorrect ? (
                <>
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {getRandomSuccessMessage()}
                  </h3>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                    {getRandomErrorMessage()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Resposta correta: {currentQuestion.correctAnswer}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Test Content */}
        <div className="mb-8">
          {renderTestContent()}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer || showFeedback}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center"
          >
            {currentQuestionIndex === config.questions.length - 1 ? 'Finalizar Teste' : 'Próxima Questão'}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Instruções:</p>
              <p>
                Selecione a resposta que melhor corresponde ao que você vê. 
                Não se preocupe se errar algumas questões - isso é normal e nos ajuda a avaliar sua visão.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}