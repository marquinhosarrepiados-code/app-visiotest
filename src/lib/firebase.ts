// Configuração do Firebase para VisioTest+
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { FirebaseConfig } from './types'

// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
}

// Verificar se as configurações do Firebase estão definidas
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => value !== "")

let app: any = null
let db: any = null
let auth: any = null

if (isFirebaseConfigured) {
  try {
    // Inicializar Firebase apenas se configurado
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error)
  }
}

// Exportar instâncias (podem ser null se não configurado)
export { db, auth }
export default app