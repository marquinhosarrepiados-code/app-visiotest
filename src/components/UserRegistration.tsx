'use client'

import { useState } from 'react'
import { UserProfile } from '@/lib/types'
import { userService } from '@/lib/firebaseService'
import { User, Phone, MapPin, Eye, Heart, AlertCircle } from 'lucide-react'

interface UserRegistrationProps {
  onComplete: (profile: UserProfile) => void
}

export function UserRegistration({ onComplete }: UserRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    city: '',
    usesGlasses: false,
    lensType: '',
    visualDifficulties: [] as string[],
    healthHistory: [] as string[]
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const visualDifficultyOptions = [
    'visao_noturna',
    'daltonismo', 
    'miopia',
    'hipermetropia',
    'astigmatismo',
    'presbiopia',
    'glaucoma_familia',
    'catarata_familia'
  ]

  const healthHistoryOptions = [
    'diabetes',
    'hipertensao',
    'enxaqueca',
    'uso_medicamentos',
    'cirurgia_ocular',
    'trauma_ocular',
    'doenca_autoimune',
    'historico_familiar'
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    const age = parseInt(formData.age)
    if (!formData.age || age < 5 || age > 120) {
      newErrors.age = 'Idade deve estar entre 5 e 120 anos'
    }

    if (!formData.gender) {
      newErrors.gender = 'Gênero é obrigatório'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato: (11) 99999-9999'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória'
    }

    if (formData.usesGlasses && !formData.lensType) {
      newErrors.lensType = 'Selecione o tipo de lente'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, phone: formatted }))
  }

  const handleCheckboxChange = (
    field: 'visualDifficulties' | 'healthHistory',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const userProfile: Omit<UserProfile, 'id' | 'createdAt'> = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender as 'masculino' | 'feminino' | 'outro',
        phone: formData.phone,
        city: formData.city.trim(),
        usesGlasses: formData.usesGlasses,
        lensType: formData.lensType as 'perto' | 'longe' | 'multifocal' | 'bifocal' | undefined,
        visualDifficulties: formData.visualDifficulties,
        healthHistory: formData.healthHistory
      }

      const createdProfile = await userService.create(userProfile)
      onComplete(createdProfile)
    } catch (error) {
      console.error('Erro ao criar perfil:', error)
      setErrors({ submit: 'Erro ao salvar dados. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyLabel = (key: string) => {
    const labels: Record<string, string> = {
      visao_noturna: 'Dificuldade para enxergar à noite',
      daltonismo: 'Dificuldade para distinguir cores',
      miopia: 'Dificuldade para ver de longe',
      hipermetropia: 'Dificuldade para ver de perto',
      astigmatismo: 'Visão embaçada ou distorcida',
      presbiopia: 'Dificuldade para focar objetos próximos',
      glaucoma_familia: 'Histórico familiar de glaucoma',
      catarata_familia: 'Histórico familiar de catarata'
    }
    return labels[key] || key
  }

  const getHealthLabel = (key: string) => {
    const labels: Record<string, string> = {
      diabetes: 'Diabetes',
      hipertensao: 'Hipertensão arterial',
      enxaqueca: 'Enxaqueca frequente',
      uso_medicamentos: 'Uso regular de medicamentos',
      cirurgia_ocular: 'Cirurgia ocular prévia',
      trauma_ocular: 'Trauma ou lesão ocular',
      doenca_autoimune: 'Doença autoimune',
      historico_familiar: 'Histórico familiar de problemas oculares'
    }
    return labels[key] || key
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Cadastro Completo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Preencha seus dados para personalizar os testes de visão
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Seu nome completo"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Idade *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Sua idade"
                min="5"
                max="120"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Telefone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Cidade *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Sua cidade"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gênero *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['masculino', 'feminino', 'outro'].map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="capitalize text-gray-700 dark:text-gray-300">{gender}</span>
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          {/* Informações sobre Óculos */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Informações Visuais
            </h3>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.usesGlasses}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    usesGlasses: e.target.checked,
                    lensType: e.target.checked ? prev.lensType : ''
                  }))}
                  className="mr-3"
                />
                <span className="text-gray-700 dark:text-gray-300">Uso óculos ou lentes de contato</span>
              </label>
            </div>

            {formData.usesGlasses && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Lente *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['perto', 'longe', 'multifocal', 'bifocal'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="lensType"
                        value={type}
                        checked={formData.lensType === type}
                        onChange={(e) => setFormData(prev => ({ ...prev, lensType: e.target.value }))}
                        className="mr-2"
                      />
                      <span className="capitalize text-gray-700 dark:text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.lensType && <p className="text-red-500 text-sm mt-1">{errors.lensType}</p>}
              </div>
            )}
          </div>

          {/* Dificuldades Visuais */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              Dificuldades Visuais (selecione todas que se aplicam)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visualDifficultyOptions.map((difficulty) => (
                <label key={difficulty} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.visualDifficulties.includes(difficulty)}
                    onChange={() => handleCheckboxChange('visualDifficulties', difficulty)}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {getDifficultyLabel(difficulty)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Histórico de Saúde */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Histórico de Saúde
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {healthHistoryOptions.map((condition) => (
                <label key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.healthHistory.includes(condition)}
                    onChange={() => handleCheckboxChange('healthHistory', condition)}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {getHealthLabel(condition)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Disclaimer Médico */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Importante:</p>
                <p>
                  Este teste não substitui uma consulta oftalmológica profissional. 
                  Os resultados são apenas indicativos e devem ser complementados 
                  por avaliação médica especializada.
                </p>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Salvando dados...
              </>
            ) : (
              'Continuar para Pagamento'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}