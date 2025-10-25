'use client'

import { Eye, Moon, Sun, RefreshCw } from 'lucide-react'

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
  onRestart: () => void
}

export function Header({ darkMode, setDarkMode, onRestart }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-lg border-b border-gray-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                VisioTest+
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Testes de Visão Completos
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              title={darkMode ? 'Modo claro' : 'Modo escuro'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Restart Button */}
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              title="Reiniciar testes"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Teste</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}