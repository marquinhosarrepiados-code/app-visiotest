'use client'

import { useState, useEffect } from 'react'
import { VisionTestSession } from '@/lib/types'
import { calculatePersonalizedScore } from '@/lib/testConfig'
import { sessionService, webhookService } from '@/lib/firebaseService'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  Download, 
  Share2, 
  RefreshCw, 
  Eye, 
  TrendingUp, 
  Award, 
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'

interface TestResultsProps {
  session: VisionTestSession
  onRestart: () => void
  onNewTest: () => void
}

export function TestResults({ session, onRestart, onNewTest }: TestResultsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [webhookSent, setWebhookSent] = useState(false)
  const [webhookAttempted, setWebhookAttempted] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    saveSession()
    sendWebhook()
  }, [])

  const saveSession = async () => {
    setIsSaving(true)
    try {
      await sessionService.create(session)
      console.log('Sessão salva com sucesso')
    } catch (error) {
      console.error('Erro ao salvar sessão:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const sendWebhook = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL
    
    // Não tentar enviar webhook se a URL não estiver configurada ou for placeholder
    if (!webhookUrl || 
        webhookUrl === 'https://webhook.site/your-webhook-url' || 
        webhookUrl.includes('your-webhook-url') ||
        webhookUrl === '') {
      console.log('Webhook URL não configurada - pulando envio')
      setWebhookAttempted(true)
      return
    }
    
    const payload = {
      userId: session.userId,
      userProfile: session.userProfile,
      session: session,
      timestamp: new Date().toISOString()
    }

    try {
      setWebhookAttempted(true)
      const success = await webhookService.sendResults(payload, webhookUrl)
      setWebhookSent(success)
      if (success) {
        console.log('Webhook enviado com sucesso para:', webhookUrl)
      }
    } catch (error) {
      console.error('Erro ao enviar webhook:', error)
      setWebhookSent(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900'
    return 'bg-red-100 dark:bg-red-900'
  }

  const getRecommendations = () => {
    const recommendations = []
    
    if (session.overallScore >= 90) {
      recommendations.push('Excelente visão! Continue cuidando da sua saúde ocular.')
    } else if (session.overallScore >= 70) {
      recommendations.push('Boa visão geral. Considere exames regulares.')
    } else if (session.overallScore >= 50) {
      recommendations.push('Alguns aspectos da visão podem precisar de atenção.')
    } else {
      recommendations.push('Recomendamos consultar um oftalmologista.')
    }

    // Recomendações baseadas no perfil
    if (session.userProfile.age > 40) {
      recommendations.push('Após os 40 anos, exames anuais são recomendados.')
    }

    if (session.userProfile.usesGlasses) {
      recommendations.push('Verifique se seus óculos estão com o grau atualizado.')
    }

    if (session.userProfile.visualDifficulties.includes('visao_noturna')) {
      recommendations.push('Evite dirigir à noite sem avaliação profissional.')
    }

    return recommendations
  }

  const chartData = session.testResults.map(result => ({
    name: result.testType.replace('_', ' ').toUpperCase(),
    score: result.score,
    accuracy: Math.round(result.accuracy * 100),
    time: Math.round(result.timeSpent / 1000)
  }))

  const pieData = [
    { name: 'Acertos', value: session.testResults.reduce((acc, r) => acc + r.responses.filter(resp => resp.isCorrect).length, 0), color: '#10B981' },
    { name: 'Erros', value: session.testResults.reduce((acc, r) => acc + r.responses.filter(resp => !resp.isCorrect).length, 0), color: '#EF4444' }
  ]

  const timeData = session.testResults.map((result, index) => ({
    test: `Teste ${index + 1}`,
    time: Math.round(result.timeSpent / 1000)
  }))

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meus Resultados VisioTest+',
          text: `Acabei de fazer testes de visão no VisioTest+! Pontuação geral: ${session.overallScore}%`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      setShowShareModal(true)
    }
  }

  const handleDownload = () => {
    const reportData = {
      usuario: session.userProfile.name,
      idade: session.userProfile.age,
      data: session.completedAt.toLocaleDateString('pt-BR'),
      pontuacao_geral: session.overallScore,
      testes_realizados: session.testResults.length,
      resultados: session.testResults.map(r => ({
        tipo: r.testType,
        pontuacao: r.score,
        precisao: Math.round(r.accuracy * 100),
        tempo: Math.round(r.timeSpent / 1000)
      })),
      recomendacoes: getRecommendations()
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visiotest-resultados-${session.userProfile.name.replace(/\s+/g, '-')}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header com Pontuação Principal */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className={`w-32 h-32 ${getScoreBackground(session.overallScore)} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(session.overallScore)}`}>
                {session.overallScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Pontuação Geral
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Resultados Completos
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {session.userProfile.name} • {session.testResults.length} teste(s) realizado(s)
          </p>

          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {isSaving ? (
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Salvando...
              </div>
            ) : (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvo
              </div>
            )}
            
            {webhookAttempted && (
              <div className={`flex items-center ${webhookSent ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {webhookSent ? 'Enviado' : 'Webhook não configurado'}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onNewTest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Eye className="w-5 h-5 mr-2" />
              Fazer Outro Teste
            </button>
            
            <button
              onClick={handleShare}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartilhar
            </button>
            
            <button
              onClick={handleDownload}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar Relatório
            </button>
            
            <button
              onClick={onRestart}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Novo Usuário
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(session.testResults.reduce((acc, r) => acc + r.accuracy, 0) / session.testResults.length * 100)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Precisão Média</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {session.testResults.reduce((acc, r) => acc + r.responses.filter(resp => resp.isCorrect).length, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total de Acertos</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(session.testResults.reduce((acc, r) => acc + r.timeSpent, 0) / 1000 / 60)}min
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Tempo Total</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {session.testResults.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Testes Realizados</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras - Pontuações */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <BarChart className="w-6 h-6 mr-2" />
            Pontuações por Teste
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
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name === 'score' ? 'Pontuação' : 'Precisão']}
                labelFormatter={(label) => `Teste: ${label}`}
              />
              <Bar dataKey="score" fill="#3B82F6" name="score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Acertos vs Erros */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Distribuição de Respostas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Linha - Tempo por Teste */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          Tempo de Execução por Teste
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="test" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}s`, 'Tempo']} />
            <Line type="monotone" dataKey="time" stroke="#8B5CF6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recomendações Personalizadas */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2" />
          Recomendações Personalizadas
        </h3>
        
        <div className="space-y-4">
          {getRecommendations().map((recommendation, index) => (
            <div key={index} className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer Médico */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Importante:</p>
              <p>
                Estes resultados são apenas indicativos e não substituem uma consulta oftalmológica profissional. 
                Para diagnósticos precisos e tratamentos, sempre consulte um especialista em saúde ocular.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Compartilhamento */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Compartilhar Resultados
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Copie o link abaixo para compartilhar seus resultados:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
              <code className="text-sm break-all">{window.location.href}</code>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  setShowShareModal(false)
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Copiar Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}