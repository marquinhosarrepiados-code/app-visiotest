// Serviços do Firebase para VisioTest+
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import { UserProfile, VisionTestSession, TestResult, PaymentData, WebhookPayload } from './types'

// Coleções do Firestore
const COLLECTIONS = {
  users: 'users',
  sessions: 'vision_test_sessions',
  payments: 'payments',
  results: 'test_results'
}

// Verificar se Firebase está configurado
const isFirebaseAvailable = () => {
  return db !== null && db !== undefined
}

// Serviços de Usuário
export const userService = {
  async create(userProfile: Omit<UserProfile, 'id' | 'createdAt'>): Promise<UserProfile> {
    try {
      // Se Firebase não estiver configurado, simular criação local
      if (!isFirebaseAvailable()) {
        const mockUser: UserProfile = {
          ...userProfile,
          id: `user_${Date.now()}`,
          createdAt: new Date()
        }
        
        // Salvar no localStorage como fallback
        const existingUsers = JSON.parse(localStorage.getItem('visiotest_users') || '[]')
        existingUsers.push(mockUser)
        localStorage.setItem('visiotest_users', JSON.stringify(existingUsers))
        
        return mockUser
      }

      const docRef = await addDoc(collection(db, COLLECTIONS.users), {
        ...userProfile,
        createdAt: Timestamp.now()
      })
      
      const newUser: UserProfile = {
        ...userProfile,
        id: docRef.id,
        createdAt: new Date()
      }
      
      return newUser
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      
      // Fallback para localStorage em caso de erro
      const mockUser: UserProfile = {
        ...userProfile,
        id: `user_${Date.now()}`,
        createdAt: new Date()
      }
      
      try {
        const existingUsers = JSON.parse(localStorage.getItem('visiotest_users') || '[]')
        existingUsers.push(mockUser)
        localStorage.setItem('visiotest_users', JSON.stringify(existingUsers))
        return mockUser
      } catch (localError) {
        throw new Error('Falha ao salvar dados do usuário')
      }
    }
  },

  async getById(userId: string): Promise<UserProfile | null> {
    try {
      if (!isFirebaseAvailable()) {
        const existingUsers = JSON.parse(localStorage.getItem('visiotest_users') || '[]')
        return existingUsers.find((user: UserProfile) => user.id === userId) || null
      }

      const docRef = doc(db, COLLECTIONS.users, userId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate()
        } as UserProfile
      }
      
      return null
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  },

  async update(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      if (!isFirebaseAvailable()) {
        const existingUsers = JSON.parse(localStorage.getItem('visiotest_users') || '[]')
        const userIndex = existingUsers.findIndex((user: UserProfile) => user.id === userId)
        if (userIndex !== -1) {
          existingUsers[userIndex] = { ...existingUsers[userIndex], ...updates }
          localStorage.setItem('visiotest_users', JSON.stringify(existingUsers))
        }
        return
      }

      const docRef = doc(db, COLLECTIONS.users, userId)
      await updateDoc(docRef, updates)
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw new Error('Falha ao atualizar usuário')
    }
  }
}

// Serviços de Sessão de Teste
export const sessionService = {
  async create(session: Omit<VisionTestSession, 'id' | 'createdAt'>): Promise<VisionTestSession> {
    try {
      if (!isFirebaseAvailable()) {
        const mockSession: VisionTestSession = {
          ...session,
          id: `session_${Date.now()}`,
          createdAt: new Date()
        }
        
        const existingSessions = JSON.parse(localStorage.getItem('visiotest_sessions') || '[]')
        existingSessions.push(mockSession)
        localStorage.setItem('visiotest_sessions', JSON.stringify(existingSessions))
        
        return mockSession
      }

      const docRef = await addDoc(collection(db, COLLECTIONS.sessions), {
        ...session,
        completedAt: Timestamp.fromDate(session.completedAt),
        createdAt: Timestamp.now()
      })
      
      const newSession: VisionTestSession = {
        ...session,
        id: docRef.id,
        createdAt: new Date()
      }
      
      return newSession
    } catch (error) {
      console.error('Erro ao criar sessão:', error)
      throw new Error('Falha ao criar sessão de teste')
    }
  },

  async getByUserId(userId: string): Promise<VisionTestSession[]> {
    try {
      if (!isFirebaseAvailable()) {
        const existingSessions = JSON.parse(localStorage.getItem('visiotest_sessions') || '[]')
        return existingSessions.filter((session: VisionTestSession) => session.userId === userId)
      }

      const q = query(
        collection(db, COLLECTIONS.sessions),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const sessions: VisionTestSession[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        sessions.push({
          id: doc.id,
          ...data,
          completedAt: data.completedAt.toDate(),
          createdAt: data.createdAt.toDate()
        } as VisionTestSession)
      })
      
      return sessions
    } catch (error) {
      console.error('Erro ao buscar sessões:', error)
      return []
    }
  },

  async getById(sessionId: string): Promise<VisionTestSession | null> {
    try {
      if (!isFirebaseAvailable()) {
        const existingSessions = JSON.parse(localStorage.getItem('visiotest_sessions') || '[]')
        return existingSessions.find((session: VisionTestSession) => session.id === sessionId) || null
      }

      const docRef = doc(db, COLLECTIONS.sessions, sessionId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          completedAt: data.completedAt.toDate(),
          createdAt: data.createdAt.toDate()
        } as VisionTestSession
      }
      
      return null
    } catch (error) {
      console.error('Erro ao buscar sessão:', error)
      return null
    }
  }
}

// Serviços de Pagamento
export const paymentService = {
  async create(payment: Omit<PaymentData, 'id' | 'createdAt'>): Promise<PaymentData> {
    try {
      if (!isFirebaseAvailable()) {
        const mockPayment: PaymentData = {
          ...payment,
          id: `payment_${Date.now()}`,
          createdAt: new Date()
        }
        
        const existingPayments = JSON.parse(localStorage.getItem('visiotest_payments') || '[]')
        existingPayments.push(mockPayment)
        localStorage.setItem('visiotest_payments', JSON.stringify(existingPayments))
        
        return mockPayment
      }

      const docRef = await addDoc(collection(db, COLLECTIONS.payments), {
        ...payment,
        completedAt: payment.completedAt ? Timestamp.fromDate(payment.completedAt) : null,
        createdAt: Timestamp.now()
      })
      
      const newPayment: PaymentData = {
        ...payment,
        id: docRef.id,
        createdAt: new Date()
      }
      
      return newPayment
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      throw new Error('Falha ao processar pagamento')
    }
  },

  async updateStatus(paymentId: string, status: PaymentData['status'], transactionId?: string): Promise<void> {
    try {
      if (!isFirebaseAvailable()) {
        const existingPayments = JSON.parse(localStorage.getItem('visiotest_payments') || '[]')
        const paymentIndex = existingPayments.findIndex((payment: PaymentData) => payment.id === paymentId)
        if (paymentIndex !== -1) {
          existingPayments[paymentIndex].status = status
          if (transactionId) {
            existingPayments[paymentIndex].transactionId = transactionId
          }
          if (status === 'completed') {
            existingPayments[paymentIndex].completedAt = new Date()
          }
          localStorage.setItem('visiotest_payments', JSON.stringify(existingPayments))
        }
        return
      }

      const docRef = doc(db, COLLECTIONS.payments, paymentId)
      const updates: any = { status }
      
      if (transactionId) {
        updates.transactionId = transactionId
      }
      
      if (status === 'completed') {
        updates.completedAt = Timestamp.now()
      }
      
      await updateDoc(docRef, updates)
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error)
      throw new Error('Falha ao atualizar status do pagamento')
    }
  }
}

// Serviço de Webhook
export const webhookService = {
  async sendResults(payload: WebhookPayload, webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'VisioTest+ Webhook/1.0'
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`)
      }
      
      console.log('Webhook enviado com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao enviar webhook:', error)
      return false
    }
  }
}

// Utilitários
export const firestoreUtils = {
  // Converter timestamp do Firestore para Date
  timestampToDate(timestamp: any): Date {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate()
    }
    return new Date(timestamp)
  },

  // Converter Date para timestamp do Firestore
  dateToTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date)
  }
}