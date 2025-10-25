'use client'

import { useState } from 'react'
import { UserRegistration } from '@/components/UserRegistration'
import { Payment } from '@/components/Payment'
import { VisionTests } from '@/components/VisionTests'
import { TestResults } from '@/components/TestResults'
import { Header } from '@/components/Header'

export type UserProfile = {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  phone: string
  usesGlasses: boolean
  lensType?: 'reading' | 'distance' | 'bifocal' | 'progressive'
  visualDifficulties: string[]
  healthHistory: string
  createdAt: Date
}

export type TestResult = {
  id: string
  userId: string
  testType: 'acuity' | 'contrast' | 'color'
  score: number
  level: number
  responses: any[]
  completedAt: Date
}

export default function VisioTestApp() {
  const [currentStep, setCurrentStep] = useState<'registration' | 'payment' | 'tests' | 'results'>('registration')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [darkMode, setDarkMode] = useState(false)

  const handleRegistrationComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    setCurrentStep('payment')
  }

  const handlePaymentComplete = () => {
    setCurrentStep('tests')
  }

  const handlePaymentCancel = () => {
    setCurrentStep('registration')
  }

  const handleTestsComplete = (results: TestResult[]) => {
    setTestResults(results)
    setCurrentStep('results')
  }

  const handleRestart = () => {
    setCurrentStep('registration')
    setUserProfile(null)
    setTestResults([])
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-white'
    }`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} onRestart={handleRestart} />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'registration' && (
          <UserRegistration onComplete={handleRegistrationComplete} />
        )}
        
        {currentStep === 'payment' && userProfile && (
          <Payment 
            userId={userProfile.id}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handlePaymentCancel}
          />
        )}
        
        {currentStep === 'tests' && userProfile && (
          <VisionTests 
            userProfile={userProfile} 
            onComplete={handleTestsComplete} 
          />
        )}
        
        {currentStep === 'results' && userProfile && testResults.length > 0 && (
          <TestResults 
            userProfile={userProfile} 
            testResults={testResults}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Medical Disclaimer */}
      <footer className="bg-blue-900 dark:bg-slate-800 text-white p-6 mt-12">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="font-semibold">Aviso Médico Importante</h3>
          </div>
          <p className="text-sm opacity-90 max-w-4xl mx-auto">
            O VisioTest+ é uma ferramenta de triagem visual e NÃO substitui consulta oftalmológica profissional. 
            Os resultados obtidos são indicativos e devem ser interpretados por um médico especialista. 
            Em caso de problemas visuais, procure sempre um oftalmologista qualificado.
          </p>
        </div>
      </footer>
    </div>
  )
}