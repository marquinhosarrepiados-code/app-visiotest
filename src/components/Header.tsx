'use client'

import { Moon, Sun, RotateCcw } from 'lucide-react'

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
  onRestart: () => void
}

export function Header({ darkMode, setDarkMode, onRestart }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-lg border-b-4 border-blue-600">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                VisioTest<span className="text-blue-600">+</span>
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Teste de Visão Profissional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRestart}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              title="Reiniciar Teste"
            >
              <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}