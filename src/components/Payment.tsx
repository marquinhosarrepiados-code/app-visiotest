'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, Check, X, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PaymentProps {
  userId: string
  onPaymentComplete: () => void
  onCancel: () => void
}

export function Payment({ userId, onPaymentComplete, onCancel }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Salvar pagamento no Supabase
      await supabase
        .from('payments')
        .insert({
          user_id: userId,
          amount: 1.00,
          method: paymentMethod,
          status: 'completed'
        })

      setShowSuccess(true)
      setTimeout(() => {
        onPaymentComplete()
      }, 2000)
    } catch (error) {
      console.error('Erro no pagamento:', error)
      setIsProcessing(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pagamento Aprovado!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Redirecionando para os testes...
          </p>
          <div className="animate-pulse text-blue-600 dark:text-blue-400">
            Preparando testes de visão...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pagamento
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Complete o pagamento para acessar os testes
          </p>
        </div>

        {/* Valor */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            R$ 1,00
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Acesso completo aos 12 testes de visão
          </p>
        </div>

        {/* Métodos de Pagamento */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => setPaymentMethod('pix')}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              paymentMethod === 'pix'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">PIX</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Pagamento instantâneo
                </div>
              </div>
              {paymentMethod === 'pix' && (
                <Check className="w-5 h-5 text-blue-600 ml-auto" />
              )}
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              paymentMethod === 'card'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">Cartão de Crédito</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Visa, Mastercard, Elo
                </div>
              </div>
              {paymentMethod === 'card' && (
                <Check className="w-5 h-5 text-blue-600 ml-auto" />
              )}
            </div>
          </button>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={!paymentMethod || isProcessing}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Pagar R$ 1,00
                <Check className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {/* Segurança */}
        <div className="mt-6 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            🔒 Pagamento 100% seguro e criptografado
          </p>
        </div>
      </div>
    </div>
  )
}