import React, { ReactNode } from 'react'
import { MessageSquare, FileText, Folder, BarChart, Settings, Moon, Sun } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
  isDarkMode: boolean
  onThemeToggle: () => void
}

export default function Layout({ children, activeTab, onTabChange, isDarkMode, onThemeToggle }: LayoutProps) {
  const tabs = [
    { id: 'chat', label: 'Чат', icon: MessageSquare },
    { id: 'complaints', label: 'Жалобы', icon: FileText },
    { id: 'documents', label: 'Досье', icon: Folder },
    { id: 'analysis', label: 'Анализ', icon: BarChart },
    { id: 'dashboard', label: 'Статистика', icon: Settings },
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">LG</span>
            </div>
            <div>
              <h1 className="text-xl font-bold dark:text-white">LegalGuard AI</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">v3.7 PRO</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-bold">AI</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-700 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="mt-auto p-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <div className="hidden md:block">
                <p className="font-medium dark:text-white">Адвокат</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Смирнов А.А.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-3">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            Режим: <span className="font-medium">PRECEDENT LOCK</span>
            Версия: <span className="font-medium">3.7.0</span>
          </div>
          <div>
            <span className="text-green-500">●</span> AI онлайн
          </div>
        </div>
      </footer>
    </div>
  )
}
