'use client'

import { useState } from 'react'
import { User, Calendar, Eye, Heart, ChevronRight } from 'lucide-react'
import { UserProfile } from '@/app/page'

interface UserRegistrationProps {
  onComplete: (profile: UserProfile) => void
}

export function UserRegistration({ onComplete }: UserRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    usesGlasses: false,
    lensType: '' as 'reading' | 'distance' | 'bifocal' | 'progressive' | '',
    visualDifficulties: [] as string[],
    healthHistory: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const visualDifficultyOptions = [
    'Visão embaçada',
    'Dificuldade para ler',
    'Sensibilidade à luz',
    'Visão noturna prejudicada',
    'Dores de cabeça frequentes',
    'Olhos secos',
    'Visão dupla',
    'Manchas na visão'
  ]

  const handleDifficultyChange = (difficulty: string) => {
    setFormData(prev => ({
      ...prev,
      visualDifficulties: prev.visualDifficulties.includes(difficulty)
        ? prev.visualDifficulties.filter(d => d !== difficulty)
        : [...prev.visualDifficulties, difficulty]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.age || parseInt(formData.age) < 5 || parseInt(formData.age) > 120) {
      newErrors.age = 'Idade deve estar entre 5 e 120 anos'
    }
    if (!formData.gender) newErrors.gender = 'Gênero é obrigatório'
    if (formData.usesGlasses && !formData.lensType) {
      newErrors.lensType = 'Tipo de lente é obrigatório para usuários de óculos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const profile: UserProfile = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      age: parseInt(formData.age),
      gender: formData.gender as 'male' | 'female' | 'other',
      usesGlasses: formData.usesGlasses,
      lensType: formData.lensType || undefined,
      visualDifficulties: formData.visualDifficulties,
      healthHistory: formData.healthHistory.trim(),
      createdAt: new Date()
    }

    onComplete(profile)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Cadastro do Usuário
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Preencha seus dados para personalizar os testes de visão
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
              } bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Digite seu nome completo"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Idade e Gênero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Idade *
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.age ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                } bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Sua idade"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gênero *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.gender ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                } bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
          </div>

          {/* Uso de Óculos */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.usesGlasses}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  usesGlasses: e.target.checked,
                  lensType: e.target.checked ? prev.lensType : ''
                }))}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Uso óculos ou lentes de contato
              </span>
            </label>
          </div>

          {/* Tipo de Lente */}
          {formData.usesGlasses && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Lente *
              </label>
              <select
                value={formData.lensType}
                onChange={(e) => setFormData(prev => ({ ...prev, lensType: e.target.value as any }))}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.lensType ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                } bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Selecione o tipo</option>
                <option value="reading">Leitura (perto)</option>
                <option value="distance">Distância (longe)</option>
                <option value="bifocal">Bifocal</option>
                <option value="progressive">Progressiva</option>
              </select>
              {errors.lensType && <p className="text-red-500 text-sm mt-1">{errors.lensType}</p>}
            </div>
          )}

          {/* Dificuldades Visuais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dificuldades Visuais (selecione todas que se aplicam)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {visualDifficultyOptions.map((difficulty) => (
                <label key={difficulty} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.visualDifficulties.includes(difficulty)}
                    onChange={() => handleDifficultyChange(difficulty)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {difficulty}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Histórico de Saúde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Heart className="w-4 h-4 inline mr-1" />
              Histórico de Saúde Ocular
            </label>
            <textarea
              value={formData.healthHistory}
              onChange={(e) => setFormData(prev => ({ ...prev, healthHistory: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva qualquer histórico de problemas oculares, cirurgias, medicamentos ou condições relevantes..."
            />
          </div>

          {/* Botão Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            Iniciar Testes de Visão
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}