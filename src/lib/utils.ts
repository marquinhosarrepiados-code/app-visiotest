// Utility functions for VisioTest+

// Gerar ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Formatar data para exibição
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Calcular idade baseada na data de nascimento
export const calculateAge = (birthDate: Date): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// Validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Calcular score baseado em respostas
export const calculateScore = (responses: any[]): number => {
  if (responses.length === 0) return 0
  
  const correctAnswers = responses.filter(response => response.correct).length
  return Math.round((correctAnswers / responses.length) * 100)
}

// Determinar nível de dificuldade baseado no perfil do usuário
export const determineDifficultyLevel = (userProfile: any): number => {
  let level = 1
  
  // Ajustar baseado na idade
  if (userProfile.age > 60) level += 1
  if (userProfile.age > 40) level += 0.5
  
  // Ajustar baseado no uso de óculos
  if (userProfile.usesGlasses) {
    if (userProfile.lensType === 'progressive' || userProfile.lensType === 'bifocal') {
      level += 1
    }
  }
  
  // Ajustar baseado nas dificuldades visuais
  if (userProfile.visualDifficulties.length > 2) {
    level += 1
  }
  
  return Math.min(Math.ceil(level), 5) // Máximo nível 5
}

// Gerar recomendações baseadas nos resultados
export const generateRecommendations = (userProfile: any, testResults: any[]) => {
  const recommendations = []
  
  const averageScore = testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length
  
  // Recomendações baseadas no score geral
  if (averageScore < 60) {
    recommendations.push({
      type: 'urgent',
      title: 'Consulta Oftalmológica Recomendada',
      message: 'Seus resultados sugerem possíveis problemas visuais. Recomendamos consulta com oftalmologista.',
      priority: 'high'
    })
  } else if (averageScore < 80) {
    recommendations.push({
      type: 'warning',
      title: 'Acompanhamento Recomendado',
      message: 'Alguns resultados podem indicar alterações visuais. Considere consulta oftalmológica.',
      priority: 'medium'
    })
  }
  
  // Recomendações específicas por teste
  testResults.forEach(result => {
    if (result.testType === 'acuity' && result.score < 70) {
      recommendations.push({
        type: 'warning',
        title: 'Acuidade Visual Reduzida',
        message: 'Possível necessidade de correção visual ou atualização de óculos.',
        priority: 'high'
      })
    }
    
    if (result.testType === 'contrast' && result.score < 60) {
      recommendations.push({
        type: 'info',
        title: 'Sensibilidade ao Contraste Baixa',
        message: 'Pode afetar visão noturna e em ambientes com pouca luz.',
        priority: 'medium'
      })
    }
    
    if (result.testType === 'color' && result.score < 50) {
      recommendations.push({
        type: 'info',
        title: 'Possível Deficiência Cromática',
        message: 'Dificuldade na percepção de certas cores. Geralmente não requer tratamento.',
        priority: 'low'
      })
    }
  })
  
  // Recomendações baseadas na idade
  if (userProfile.age > 40 && !recommendations.some(r => r.type === 'urgent')) {
    recommendations.push({
      type: 'info',
      title: 'Exames Regulares Recomendados',
      message: 'Após os 40 anos, exames oftalmológicos anuais são importantes.',
      priority: 'low'
    })
  }
  
  // Se não há problemas, dar feedback positivo
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

// Converter resultados para formato de exportação
export const formatResultsForExport = (userProfile: any, testResults: any[]) => {
  return {
    exportDate: new Date().toISOString(),
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
      testName: getTestName(result.testType),
      score: result.score,
      level: result.level,
      completedAt: result.completedAt,
      responses: result.responses.map(response => ({
        correct: response.correct,
        userAnswer: response.userAnswer,
        correctAnswer: response.correctAnswer,
        timestamp: response.timestamp
      }))
    })),
    summary: {
      totalTests: testResults.length,
      averageScore: Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length),
      recommendations: generateRecommendations(userProfile, testResults)
    }
  }
}

// Obter nome do teste em português
export const getTestName = (testType: string): string => {
  const testNames = {
    acuity: 'Acuidade Visual',
    contrast: 'Sensibilidade ao Contraste',
    color: 'Visão de Cores'
  }
  
  return testNames[testType as keyof typeof testNames] || testType
}

// Validar dados do perfil do usuário
export const validateUserProfile = (profile: any): { isValid: boolean; errors: string[] } => {
  const errors = []
  
  if (!profile.name || profile.name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres')
  }
  
  if (!profile.age || profile.age < 5 || profile.age > 120) {
    errors.push('Idade deve estar entre 5 e 120 anos')
  }
  
  if (!profile.gender || !['male', 'female', 'other'].includes(profile.gender)) {
    errors.push('Gênero é obrigatório')
  }
  
  if (profile.usesGlasses && !profile.lensType) {
    errors.push('Tipo de lente é obrigatório para usuários de óculos')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Gerar cores para gráficos
export const generateChartColors = (count: number): string[] => {
  const baseColors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#f97316', // orange
    '#84cc16', // lime
    '#ec4899', // pink
    '#6b7280'  // gray
  ]
  
  const colors = []
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length])
  }
  
  return colors
}

// Debounce function para otimizar performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function para limitar chamadas
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Função para detectar dispositivo móvel
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// Função para detectar modo escuro do sistema
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}