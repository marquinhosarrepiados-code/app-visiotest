// Tipos para o aplicativo VisioTest+

export interface UserProfile {
  id: string
  name: string
  age: number
  gender: 'masculino' | 'feminino' | 'outro'
  phone: string
  city: string
  usesGlasses: boolean
  lensType?: 'perto' | 'longe' | 'multifocal' | 'bifocal'
  visualDifficulties: string[]
  healthHistory: string[]
  createdAt: Date
}

export interface TestResult {
  id: string
  testType: TestType
  score: number
  maxScore: number
  accuracy: number
  timeSpent: number
  responses: TestResponse[]
  completedAt: Date
}

export interface TestResponse {
  questionId: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeSpent: number
}

export interface VisionTestSession {
  id: string
  userId: string
  userProfile: UserProfile
  testResults: TestResult[]
  overallScore: number
  recommendations: string[]
  completedAt: Date
  createdAt: Date
}

export interface PaymentData {
  id: string
  userId: string
  amount: number
  method: 'pix' | 'credit_card'
  status: 'pending' | 'completed' | 'failed'
  transactionId?: string
  completedAt?: Date
  createdAt: Date
}

export type TestType = 
  | 'acuidade_basica'
  | 'acuidade_avancada'
  | 'contraste_baixo'
  | 'contraste_alto'
  | 'cores_basico'
  | 'cores_avancado'
  | 'campo_visual'
  | 'visao_noturna'
  | 'astigmatismo'

export interface TestConfig {
  id: TestType
  name: string
  description: string
  icon: string
  difficulty: 'fácil' | 'médio' | 'difícil'
  estimatedTime: number
  questions: TestQuestion[]
}

export interface TestQuestion {
  id: string
  type: 'multiple_choice' | 'direction' | 'color_match' | 'size_comparison'
  question: string
  options?: string[]
  correctAnswer: string
  imageUrl?: string
  difficulty: number
}

export interface WebhookPayload {
  userId: string
  userProfile: UserProfile
  session: VisionTestSession
  timestamp: string
}

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}