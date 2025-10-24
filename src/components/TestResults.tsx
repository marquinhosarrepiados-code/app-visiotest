'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, Share2, RotateCcw, Eye, Target, Palette, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react'
import { UserProfile, TestResult } from '@/app/page'

interface TestResultsProps {
  userProfile: UserProfile
  testResults: TestResult[]
  onRestart: () => void
}

export function TestResults({ userProfile, testResults, onRestart }: TestResultsProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Calcular estatísticas
  const averageScore = Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length)
  
  const testIcons = {
    acuity: Eye,
    contrast: Target,
    color: Palette
  }

  const testNames = {
    acuity: 'Acuidade Visual',
    contrast: 'Sensibilidade ao Contraste',
    color: 'Visão de Cores'
  }

  // Dados para gráficos
  const chartData = testResults.map(result => ({
    name: testNames[result.testType],
    score: result.score,
    level: result.level
  }))

  const pieData = [
    { name: 'Acertos', value: averageScore, color: '#10b981' },
    { name: 'Erros', value: 100 - averageScore, color: '#ef4444' }
  ]

  // Gerar recomendações baseadas nos resultados
  const generateRecommendations = () => {
    const recommendations = []
    
    const acuityResult = testResults.find(r => r.testType === 'acuity')
    const contrastResult = testResults.find(r => r.testType === 'contrast')
    const colorResult = testResults.find(r => r.testType === 'color')

    if (acuityResult && acuityResult.score < 70) {
      recommendations.push({
        type: 'warning',
        title: 'Acuidade Visual Reduzida',
        message: 'Seus resultados sugerem possível redução na nitidez da visão. Recomendamos consulta oftalmológica.',
        priority: 'high'
      })
    }

    if (contrastResult && contrastResult.score < 60) {
      recommendations.push({
        type: 'warning',
        title: 'Sensibilidade ao Contraste Baixa',
        message: 'Dificuldade para distinguir contrastes pode afetar a visão noturna e em ambientes com pouca luz.',
        priority: 'medium'
      })
    }

    if (colorResult && colorResult.score < 50) {
      recommendations.push({
        type: 'info',
        title: 'Possível Deficiência Cromática',
        message: 'Os resultados sugerem dificuldade na percepção de certas cores. Isso é comum e geralmente não afeta a qualidade de vida.',
        priority: 'low'
      })
    }

    if (userProfile.age > 40 && averageScore < 80) {
      recommendations.push({
        type: 'info',
        title: 'Mudanças Relacionadas à Idade',
        message: 'Algumas alterações visuais são normais com o envelhecimento. Exames regulares são importantes.',
        priority: 'medium'
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        title: 'Resultados Satisfatórios',
        message: 'Seus resultados estão dentro dos parâmetros normais. Continue cuidando da sua saúde visual.',
        priority: 'low'
      })
    }

    return recommendations
  }

  const recommendations = generateRecommendations()

  // Função para exportar resultados
  const exportResults = async () => {
    setIsExporting(true)
    
    const exportData = {
      user: {
        name: userProfile.name,
        age: userProfile.age,
        gender: userProfile.gender,
        usesGlasses: userProfile.usesGlasses,
        lensType: userProfile.lensType,
        visualDifficulties: userProfile.visualDifficulties,
        healthHistory: userProfile.healthHistory
      },
      results: testResults.map(result => ({
        testType: result.testType,
        score: result.score,
        level: result.level,
        completedAt: result.completedAt,
        responses: result.responses
      })),
      summary: {
        averageScore,
        totalTests: testResults.length,
        completedAt: new Date(),
        recommendations: recommendations.map(r => ({
          type: r.type,
          title: r.title,
          message: r.message
        }))
      }
    }

    try {
      // Simular envio via webhook (substitua pela URL real)
      const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://webhook.site/your-unique-url'
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData)
      })

      if (response.ok) {
        alert('Resultados enviados com sucesso!')
      } else {
        throw new Error('Erro no envio')
      }
    } catch (error) {
      console.error('Erro ao enviar resultados:', error)
      
      // Fallback: download como JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `visiotest-results-${userProfile.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('Resultados baixados como arquivo JSON!')
    }
    
    setIsExporting(false)
  }

  // Função para compartilhar
  const shareResults = async () => {
    const shareText = `Completei meus testes de visão no VisioTest+!\n\nResultados:\n${testResults.map(r => `${testNames[r.testType]}: ${r.score}%`).join('\n')}\n\nMédia geral: ${averageScore}%`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meus Resultados VisioTest+',
          text: shareText
        })
      } catch (error) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Resultados copiados para a área de transferência!')
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header dos Resultados */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Testes Concluídos!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Aqui estão seus resultados detalhados
          </p>
        </div>

        {/* Informações do Usuário */}
        <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Informações do Teste
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Nome:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {userProfile.name}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Idade:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {userProfile.age} anos
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Concluído em:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-white">
                {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* Score Geral */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{averageScore}%</div>
              <div className="text-sm opacity-90">Score Geral</div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Média dos {testResults.length} testes realizados
          </p>
        </div>
      </div>

      {/* Resultados por Teste */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testResults.map((result) => {
          const Icon = testIcons[result.testType]
          const getScoreColor = (score: number) => {
            if (score >= 80) return 'text-green-600'
            if (score >= 60) return 'text-yellow-600'
            return 'text-red-600'
          }

          return (
            <div key={result.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {testNames[result.testType]}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nível {result.level}
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                  {result.score}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      result.score >= 80 ? 'bg-green-500' :
                      result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {result.responses.filter((r: any) => r.correct).length} de {result.responses.length} corretas
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Desempenho por Teste
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Distribuição Geral
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {entry.name}: {entry.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Recomendações Personalizadas
        </h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const getIcon = () => {
              switch (rec.type) {
                case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
                case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
                default: return <Eye className="w-5 h-5 text-blue-500" />
              }
            }

            const getBgColor = () => {
              switch (rec.type) {
                case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }
            }

            return (
              <div key={index} className={`p-4 rounded-lg border ${getBgColor()}`}>
                <div className="flex items-start gap-3">
                  {getIcon()}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {rec.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {rec.message}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={exportResults}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
        >
          <Download className="w-5 h-5" />
          {isExporting ? 'Exportando...' : 'Exportar Resultados'}
        </button>
        
        <button
          onClick={shareResults}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
        >
          <Share2 className="w-5 h-5" />
          Compartilhar
        </button>
        
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          Novo Teste
        </button>
      </div>

      {/* Detalhes Técnicos */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detalhes Técnicos
          </h3>
          <div className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
            ↓
          </div>
        </button>
        
        {showDetails && (
          <div className="mt-6 space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {testNames[result.testType]}
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p>Nível de dificuldade: {result.level}</p>
                  <p>Questões respondidas: {result.responses.length}</p>
                  <p>Acertos: {result.responses.filter((r: any) => r.correct).length}</p>
                  <p>Precisão: {result.score}%</p>
                  <p>Concluído em: {new Date(result.completedAt).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}