'use client'

import { useState } from 'react'
import { UserProfile, PaymentData } from '@/lib/types'
import { paymentService } from '@/lib/firebaseService'
import { CreditCard, Smartphone, ArrowLeft, Check, AlertCircle } from 'lucide-react'

interface PaymentScreenProps {
  userProfile: UserProfile
  onPaymentComplete: (payment: PaymentData) => void
  onBack: () => void
}

export function PaymentScreen({ userProfile, onPaymentComplete, onBack }: PaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPixCode, setShowPixCode] = useState(false)
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const PAYMENT_AMOUNT = 1.00

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4)
    }
    return numbers
  }

  const validateCardData = () => {
    const newErrors: Record<string, string> = {}

    if (!cardData.number.replace(/\s/g, '') || cardData.number.replace(/\s/g, '').length < 16) {
      newErrors.number = 'Número do cartão inválido'
    }

    if (!cardData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!cardData.expiry || cardData.expiry.length < 5) {
      newErrors.expiry = 'Data de validade inválida'
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const simulatePixPayment = async (): Promise<PaymentData> => {
    // Simular processamento PIX
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const payment: Omit<PaymentData, 'id' | 'createdAt'> = {
      userId: userProfile.id,
      amount: PAYMENT_AMOUNT,
      method: 'pix',
      status: 'completed',
      transactionId: `PIX_${Date.now()}`,
      completedAt: new Date()
    }

    return await paymentService.create(payment)
  }

  const simulateCreditCardPayment = async (): Promise<PaymentData> => {
    // Simular processamento cartão
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const payment: Omit<PaymentData, 'id' | 'createdAt'> = {
      userId: userProfile.id,
      amount: PAYMENT_AMOUNT,
      method: 'credit_card',
      status: 'completed',
      transactionId: `CC_${Date.now()}`,
      completedAt: new Date()
    }

    return await paymentService.create(payment)
  }

  const handlePixPayment = async () => {
    setIsProcessing(true)
    setShowPixCode(true)

    try {
      const payment = await simulatePixPayment()
      onPaymentComplete(payment)
    } catch (error) {
      console.error('Erro no pagamento PIX:', error)
      setErrors({ payment: 'Erro ao processar pagamento PIX. Tente novamente.' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreditCardPayment = async () => {
    if (!validateCardData()) {
      return
    }

    setIsProcessing(true)

    try {
      const payment = await simulateCreditCardPayment()
      onPaymentComplete(payment)
    } catch (error) {
      console.error('Erro no pagamento cartão:', error)
      setErrors({ payment: 'Erro ao processar pagamento. Tente novamente.' })
    } finally {
      setIsProcessing(false)
    }
  }

  const generatePixCode = () => {
    return `00020126580014BR.GOV.BCB.PIX0136${userProfile.id}520400005303986540${PAYMENT_AMOUNT.toFixed(2)}5802BR5925VISIOTEST LTDA6009SAO PAULO62070503***6304`
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pagamento Seguro
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Valor: R$ {PAYMENT_AMOUNT.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>

        {/* Resumo do Usuário */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Resumo do Cadastro
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p><strong>Nome:</strong> {userProfile.name}</p>
            <p><strong>Idade:</strong> {userProfile.age} anos</p>
            <p><strong>Cidade:</strong> {userProfile.city}</p>
            <p><strong>Usa óculos:</strong> {userProfile.usesGlasses ? 'Sim' : 'Não'}</p>
            {userProfile.usesGlasses && userProfile.lensType && (
              <p><strong>Tipo de lente:</strong> {userProfile.lensType}</p>
            )}
          </div>
        </div>

        {!paymentMethod && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Escolha a forma de pagamento:
            </h3>
            
            {/* PIX */}
            <button
              onClick={() => setPaymentMethod('pix')}
              className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 dark:text-white">PIX</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Pagamento instantâneo e seguro
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 dark:text-green-400">
                  R$ {PAYMENT_AMOUNT.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Aprovação imediata</p>
              </div>
            </button>

            {/* Cartão de Crédito */}
            <button
              onClick={() => setPaymentMethod('credit_card')}
              className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Cartão de Crédito</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Visa, Mastercard, Elo
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 dark:text-blue-400">
                  R$ {PAYMENT_AMOUNT.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Processamento seguro</p>
              </div>
            </button>
          </div>
        )}

        {/* PIX Payment */}
        {paymentMethod === 'pix' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pagamento via PIX
              </h3>
              
              {!showPixCode ? (
                <button
                  onClick={handlePixPayment}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Gerando código PIX...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-5 h-5 mr-2" />
                      Gerar Código PIX
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Código PIX gerado com sucesso!
                    </p>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <code className="text-xs break-all text-gray-800 dark:text-gray-200">
                        {generatePixCode()}
                      </code>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Copie e cole este código no seu app de banco
                    </p>
                  </div>
                  
                  {isProcessing && (
                    <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-2"></div>
                      Aguardando confirmação do pagamento...
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={() => {
                setPaymentMethod(null)
                setShowPixCode(false)
                setIsProcessing(false)
              }}
              className="w-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Voltar às opções de pagamento
            </button>
          </div>
        )}

        {/* Credit Card Payment */}
        {paymentMethod === 'credit_card' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Dados do Cartão de Crédito
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  value={cardData.number}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    number: formatCardNumber(e.target.value) 
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  value={cardData.name}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    name: e.target.value.toUpperCase() 
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="NOME COMO NO CARTÃO"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Validade
                  </label>
                  <input
                    type="text"
                    value={cardData.expiry}
                    onChange={(e) => setCardData(prev => ({ 
                      ...prev, 
                      expiry: formatExpiry(e.target.value) 
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="MM/AA"
                    maxLength={5}
                  />
                  {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => setCardData(prev => ({ 
                      ...prev, 
                      cvv: e.target.value.replace(/\D/g, '') 
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            <button
              onClick={handleCreditCardPayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando pagamento...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pagar R$ {PAYMENT_AMOUNT.toFixed(2).replace('.', ',')}
                </>
              )}
            </button>
            
            <button
              onClick={() => setPaymentMethod(null)}
              className="w-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Voltar às opções de pagamento
            </button>
          </div>
        )}

        {/* Security Info */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800 dark:text-green-200">
              <p className="font-medium mb-1">Pagamento 100% Seguro</p>
              <p>
                Seus dados são protegidos com criptografia SSL de 256 bits. 
                Não armazenamos informações do cartão de crédito.
              </p>
            </div>
          </div>
        </div>

        {errors.payment && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-200 text-sm">{errors.payment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}