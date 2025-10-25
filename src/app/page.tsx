'use client'

import { useState } from 'react'
import { Eye, Moon, Sun, Shield, Award, Users, TrendingUp } from 'lucide-react'

export default function VisioTestApp() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark')
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-white'
    }`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  VisioTest+
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Teste de Visão Profissional
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bem-vindo ao VisioTest+
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Plataforma profissional de testes de visão com tecnologia avançada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                9 Tipos de Teste
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Avaliação completa da sua visão com diferentes tipos de teste
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                100% Seguro
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Seus dados são protegidos com criptografia avançada
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Resultados Precisos
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tecnologia avançada para resultados confiáveis
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Comece seu teste agora
            </h3>
            <p className="text-blue-100 mb-6">
              Por apenas R$ 1,00, tenha acesso a uma avaliação completa da sua visão
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Iniciar Teste
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Seguro</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">9</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Tipos de Teste</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">10k+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Usuários</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Precisão</div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                VisioTest+
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
              Plataforma profissional de testes de visão com tecnologia avançada, 
              resultados personalizados e recomendações baseadas em seu perfil único. 
              Cuidamos da sua saúde visual com precisão e acessibilidade.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Pagamento seguro
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                Dados protegidos
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                Resultados precisos
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Recomendações personalizadas
              </div>
            </div>

            {/* Disclaimer Médico */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-4xl mx-auto">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Disclaimer Médico:</strong> O VisioTest+ é uma ferramenta de triagem e não substitui 
                consultas oftalmológicas profissionais. Os resultados são indicativos e devem ser 
                complementados por avaliação médica especializada. Sempre consulte um oftalmologista 
                para diagnósticos precisos e tratamentos adequados.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2024 VisioTest+. Desenvolvido com tecnologia avançada para cuidar da sua visão.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}