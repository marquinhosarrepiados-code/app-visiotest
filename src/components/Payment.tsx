'use client'

import { useState } from 'react'
import { CreditCard, DollarSign, Check, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PaymentProps {
  userId: string
  onPaymentComplete: () => void
  onCancel: () => void
}

export function Payment({ userId, onPaymentComplete, onCancel }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus('processing')

    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Salvar pagamento no banco
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          amount: 1.00,
          status: 'completed',
          payment_method: paymentMethod
        })

      if (error) throw error

      setPaymentStatus('success')
      
      // Aguardar um pouco para mostrar sucesso
      setTimeout(() => {
        onPaymentComplete()
      }, 1500)

    } catch (error) {
      console.error('Erro no pagamento:', error)
      setPaymentStatus('error')
      setIsProcessing(false)
    }
  }

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pagamento Aprovado!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Seu pagamento de R$ 1,00 foi processado com sucesso.
          </p>
          <div className="animate-pulse text-blue-600 dark:text-blue-400">
            Iniciando testes...
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'error') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erro no Pagamento
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Houve um problema ao processar seu pagamento. Tente novamente.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setPaymentStatus('idle')
                setIsProcessing(false)
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
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
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pagamento do Teste
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Para realizar os testes de visão personalizados
          </p>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400">
            R$ 1,00
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Escolha a forma de pagamento:
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-700">
              <input
                type="radio"
                name="payment"
                value="pix"
                checked={paymentMethod === 'pix'}
                onChange={(e) => setPaymentMethod(e.target.value as 'pix')}
                className="w-4 h-4 text-blue-600 mr-3"
              />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold text-xs">PIX</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">PIX</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Pagamento instantâneo</div>
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-700">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                className="w-4 h-4 text-blue-600 mr-3"
              />
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Cartão de Crédito</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, Elo</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                Pagar R$ 1,00
              </>
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 disabled:opacity-50 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Incluso no teste:</strong> Avaliação completa de acuidade visual, 
            teste de contraste e percepção de cores, com relatório personalizado 
            baseado no seu perfil.
          </p>
        </div>
      </div>
    </div>
  )
}