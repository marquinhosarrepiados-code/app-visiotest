'use client'

import { TestType } from '@/lib/types'
import { testConfigs } from '@/lib/testConfig'
import { ArrowLeft, Clock, Star, Eye, Search, Palette, Moon, Target, Ruler } from 'lucide-react'

interface TestSelectionProps {
  onSelectTest: (testType: TestType) => void
  onBack: () => void
}

export function TestSelection({ onSelectTest, onBack }: TestSelectionProps) {
  const getTestIcon = (testType: TestType) => {
    const iconMap = {
      acuidade_basica: Eye,
      acuidade_avancada: Search,
      contraste_baixo: Moon,
      contraste_alto: Target,
      cores_basico: Palette,
      cores_avancado: Star,
      campo_visual: Target,
      visao_noturna: Moon,
      astigmatismo: Ruler
    }
    return iconMap[testType] || Eye
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'fácil':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'médio':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'difícil':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const testsByCategory = {
    'Testes de Acuidade': ['acuidade_basica', 'acuidade_avancada'] as TestType[],
    'Testes de Contraste': ['contraste_baixo', 'contraste_alto'] as TestType[],
    'Testes de Cores': ['cores_basico', 'cores_avancado'] as TestType[],
    'Testes Especializados': ['campo_visual', 'visao_noturna', 'astigmatismo'] as TestType[]
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Escolha seu Teste de Visão
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Selecione o tipo de teste que deseja realizar. Você pode fazer quantos quiser!
            </p>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">9</div>
            <div className="text-sm text-blue-800 dark:text-blue-200">Tipos de Teste</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">3-6 min</div>
            <div className="text-sm text-green-800 dark:text-green-200">Tempo Médio</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100%</div>
            <div className="text-sm text-purple-800 dark:text-purple-200">Personalizado</div>
          </div>
        </div>

        {/* Testes por Categoria */}
        <div className="space-y-8">
          {Object.entries(testsByCategory).map(([category, tests]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((testType) => {
                  const config = testConfigs[testType]
                  const IconComponent = getTestIcon(testType)
                  
                  return (
                    <div
                      key={testType}
                      onClick={() => onSelectTest(testType)}
                      className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                          <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(config.difficulty)}`}>
                          {config.difficulty}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {config.name}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {config.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {config.estimatedTime} min
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">
                          Iniciar →
                        </div>
                      </div>
                      
                      {/* Barra de Progresso Visual */}
                      <div className="mt-4 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full transition-all duration-300 group-hover:bg-blue-600"
                          style={{ width: `${(config.questions.length / 10) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {config.questions.length} questões
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Recomendações */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 Recomendações para Melhores Resultados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Realize os testes em ambiente bem iluminado</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Mantenha uma distância confortável da tela</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Use seus óculos ou lentes se necessário</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Faça pausas entre os testes se sentir cansaço</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0">
              ⚠️
            </div>
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Importante:</p>
              <p>
                Estes testes são indicativos e não substituem uma consulta oftalmológica profissional. 
                Para diagnósticos precisos, sempre consulte um especialista.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}