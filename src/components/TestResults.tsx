'use client'

import { useState } from 'react'
import { BarChart3, Download, Share2, RefreshCw, Eye, Target, Palette, User, Phone, Calendar } from 'lucide-react'
import { UserProfile, TestResult } from '@/app/page'

interface TestResultsProps {
  userProfile: UserProfile
  testResults: TestResult[]
  onRestart: () => void
}

export function TestResults({ userProfile, testResults, onRestart }: TestResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview')

  const getTestName = (type: string) => {
    switch (type) {
      case 'acuity': return 'Acuidade Visual'
      case 'contrast': return 'Contraste'
      case 'color': return 'Percepção de Cores'
      default: return type
    }
  }

  const getTestIcon = (type: string) => {
    switch (type) {
      case 'acuity': return <Eye className="w-5 h-5" />
      case 'contrast': return <Target className="w-5 h-5" />
      case 'color': return <Palette className="w-5 h-5" />
      default: return <Eye className="w-5 h-5" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  const averageScore = Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length)

  const generateRecommendations = () => {
    const recommendations = []
    
    if (averageScore < 60) {
      recommendations.push('Recomendamos consulta oftalmológica urgente para avaliação detalhada.')
    } else if (averageScore < 80) {
      recommendations.push('Considere agendar uma consulta oftalmológica para avaliação preventiva.')
    }

    const acuityResult = testResults.find(r => r.testType === 'acuity')
    if (acuityResult && acuityResult.score < 70) {
      recommendations.push('Possível necessidade de correção visual (óculos ou lentes).')
    }

    const contrastResult = testResults.find(r => r.testType === 'contrast')
    if (contrastResult && contrastResult.score < 70) {
      recommendations.push('Dificuldades com contraste podem indicar problemas de retina ou catarata.')
    }

    const colorResult = testResults.find(r => r.testType === 'color')
    if (colorResult && colorResult.score < 70) {
      recommendations.push('Possível deficiência na percepção de cores (daltonismo).')
    }

    if (userProfile.visualDifficulties.length > 0) {
      recommendations.push('Sintomas relatados requerem atenção médica especializada.')
    }

    if (recommendations.length === 0) {
      recommendations.push('Resultados dentro da normalidade. Mantenha consultas preventivas anuais.')
    }

    return recommendations
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Meus Resultados - VisioTest+',
      text: `Realizei testes de visão no VisioTest+. Pontuação média: ${averageScore}%`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Erro ao compartilhar:', error)
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`)
      alert('Link copiado para a área de transferência!')
    }
  }

  const handleDownload = () => {
    const reportData = {
      usuario: {
        nome: userProfile.name,
        idade: userProfile.age,
        genero: userProfile.gender,
        telefone: userProfile.phone,
        usaOculos: userProfile.usesGlasses,
        tipoLente: userProfile.lensType,
        dificuldades: userProfile.visualDifficulties,
        historico: userProfile.healthHistory
      },
      resultados: testResults.map(result => ({
        teste: getTestName(result.testType),
        pontuacao: result.score,
        nivel: result.level,
        dataRealizacao: result.completedAt
      })),
      pontuacaoMedia: averageScore,
      recomendacoes: generateRecommendations(),
      dataRelatorio: new Date().toLocaleDateString('pt-BR')
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `visiotest-relatorio-${userProfile.name.replace(/\s+/g, '-').toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Resultados dos Testes
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Relatório completo da avaliação visual de {userProfile.name}
          </p>

          {/* Score Overview */}
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${getScoreBackground(averageScore)}`}>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pontuação Média:
            </span>
            <span className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
              {averageScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Detalhes
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Test Results Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testResults.map((result) => (
                  <div key={result.id} className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        {getTestIcon(result.testType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {getTestName(result.testType)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Nível {result.level}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            result.score >= 80 ? 'bg-green-500' :
                            result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${result.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-2">
                  {generateRecommendations().map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
                      <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* User Profile */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Perfil do Usuário
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Nome:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{userProfile.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Idade:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{userProfile.age} anos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Telefone:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Óculos:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {userProfile.usesGlasses ? `Sim (${userProfile.lensType})` : 'Não'}
                    </span>
                  </div>
                </div>
                
                {userProfile.visualDifficulties.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Dificuldades relatadas:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userProfile.visualDifficulties.map((difficulty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded-full"
                        >
                          {difficulty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Results */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Resultados Detalhados
                </h3>
                {testResults.map((result) => (
                  <div key={result.id} className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          {getTestIcon(result.testType)}
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {getTestName(result.testType)}
                        </h4>
                      </div>
                      <span className={`text-xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Respostas corretas: {result.responses.filter(r => r.correct).length} de {result.responses.length}</p>
                      <p>Nível de dificuldade: {result.level}</p>
                      <p>Realizado em: {result.completedAt.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={handleDownload}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Baixar Relatório
        </button>
        
        <button
          onClick={handleShare}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Compartilhar
        </button>
        
        <button
          onClick={onRestart}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Novo Teste
        </button>
      </div>

      {/* Medical Disclaimer */}
      <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Importante: Este não é um diagnóstico médico
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Os resultados deste teste são apenas indicativos e não substituem uma consulta oftalmológica profissional. 
              Para um diagnóstico preciso e tratamento adequado, consulte sempre um médico oftalmologista qualificado.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}