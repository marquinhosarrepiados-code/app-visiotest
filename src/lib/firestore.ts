import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import { UserProfile, TestResult } from '@/app/page'

// Coleções do Firestore
const USERS_COLLECTION = 'users'
const RESULTS_COLLECTION = 'testResults'

// Tipos para Firestore (com Timestamp)
type FirestoreUserProfile = Omit<UserProfile, 'createdAt'> & {
  createdAt: Timestamp
}

type FirestoreTestResult = Omit<TestResult, 'completedAt'> & {
  completedAt: Timestamp
}

// Funções para Usuários
export const saveUserProfile = async (userProfile: UserProfile): Promise<string> => {
  try {
    const firestoreProfile: FirestoreUserProfile = {
      ...userProfile,
      createdAt: Timestamp.fromDate(userProfile.createdAt)
    }
    
    const docRef = await addDoc(collection(db, USERS_COLLECTION), firestoreProfile)
    return docRef.id
  } catch (error) {
    console.error('Erro ao salvar perfil do usuário:', error)
    throw error
  }
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('id', '==', userId),
      limit(1)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return null
    }
    
    const doc = querySnapshot.docs[0]
    const data = doc.data() as FirestoreUserProfile
    
    return {
      ...data,
      createdAt: data.createdAt.toDate()
    }
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error)
    throw error
  }
}

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreUserProfile
      return {
        ...data,
        createdAt: data.createdAt.toDate()
      }
    })
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    throw error
  }
}

// Funções para Resultados de Testes
export const saveTestResult = async (testResult: TestResult): Promise<string> => {
  try {
    const firestoreResult: FirestoreTestResult = {
      ...testResult,
      completedAt: Timestamp.fromDate(testResult.completedAt)
    }
    
    const docRef = await addDoc(collection(db, RESULTS_COLLECTION), firestoreResult)
    return docRef.id
  } catch (error) {
    console.error('Erro ao salvar resultado do teste:', error)
    throw error
  }
}

export const saveTestResults = async (testResults: TestResult[]): Promise<string[]> => {
  try {
    const promises = testResults.map(result => saveTestResult(result))
    return await Promise.all(promises)
  } catch (error) {
    console.error('Erro ao salvar resultados dos testes:', error)
    throw error
  }
}

export const getUserTestResults = async (userId: string): Promise<TestResult[]> => {
  try {
    const q = query(
      collection(db, RESULTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreTestResult
      return {
        ...data,
        completedAt: data.completedAt.toDate()
      }
    })
  } catch (error) {
    console.error('Erro ao buscar resultados do usuário:', error)
    throw error
  }
}

export const getAllTestResults = async (): Promise<TestResult[]> => {
  try {
    const q = query(
      collection(db, RESULTS_COLLECTION),
      orderBy('completedAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreTestResult
      return {
        ...data,
        completedAt: data.completedAt.toDate()
      }
    })
  } catch (error) {
    console.error('Erro ao buscar todos os resultados:', error)
    throw error
  }
}

// Função para buscar resultados por tipo de teste
export const getTestResultsByType = async (testType: 'acuity' | 'contrast' | 'color'): Promise<TestResult[]> => {
  try {
    const q = query(
      collection(db, RESULTS_COLLECTION),
      where('testType', '==', testType),
      orderBy('completedAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreTestResult
      return {
        ...data,
        completedAt: data.completedAt.toDate()
      }
    })
  } catch (error) {
    console.error(`Erro ao buscar resultados do tipo ${testType}:`, error)
    throw error
  }
}

// Função para deletar dados do usuário (GDPR compliance)
export const deleteUserData = async (userId: string): Promise<void> => {
  try {
    // Deletar perfil do usuário
    const userQuery = query(
      collection(db, USERS_COLLECTION),
      where('id', '==', userId)
    )
    const userSnapshot = await getDocs(userQuery)
    
    const deleteUserPromises = userSnapshot.docs.map(doc => deleteDoc(doc.ref))
    
    // Deletar resultados dos testes
    const resultsQuery = query(
      collection(db, RESULTS_COLLECTION),
      where('userId', '==', userId)
    )
    const resultsSnapshot = await getDocs(resultsQuery)
    
    const deleteResultsPromises = resultsSnapshot.docs.map(doc => deleteDoc(doc.ref))
    
    // Executar todas as deleções
    await Promise.all([...deleteUserPromises, ...deleteResultsPromises])
    
    console.log(`Dados do usuário ${userId} deletados com sucesso`)
  } catch (error) {
    console.error('Erro ao deletar dados do usuário:', error)
    throw error
  }
}

// Função para estatísticas gerais
export const getGeneralStats = async () => {
  try {
    const [usersSnapshot, resultsSnapshot] = await Promise.all([
      getDocs(collection(db, USERS_COLLECTION)),
      getDocs(collection(db, RESULTS_COLLECTION))
    ])
    
    const totalUsers = usersSnapshot.size
    const totalTests = resultsSnapshot.size
    
    // Calcular estatísticas dos resultados
    const results = resultsSnapshot.docs.map(doc => doc.data() as FirestoreTestResult)
    
    const averageScores = {
      acuity: 0,
      contrast: 0,
      color: 0
    }
    
    const testCounts = {
      acuity: 0,
      contrast: 0,
      color: 0
    }
    
    results.forEach(result => {
      averageScores[result.testType] += result.score
      testCounts[result.testType]++
    })
    
    // Calcular médias
    Object.keys(averageScores).forEach(testType => {
      const type = testType as keyof typeof averageScores
      if (testCounts[type] > 0) {
        averageScores[type] = Math.round(averageScores[type] / testCounts[type])
      }
    })
    
    return {
      totalUsers,
      totalTests,
      averageScores,
      testCounts
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas gerais:', error)
    throw error
  }
}