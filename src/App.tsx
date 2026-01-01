import React, { useState } from 'react';
import Chat from './components/Chat';
import Complaints from './components/Complaints';
import Analysis from './components/Analysis';
import Documents from './components/Documents';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'complaints' | 'analysis' | 'documents' | 'dashboard'>('chat');

  const tabs = [
    { id: 'chat', label: '💬 Чат с AI', component: <Chat /> },
    { id: 'complaints', label: '📝 Жалобы', component: <Complaints /> },
    { id: 'analysis', label: '🔍 Поиск практики', component: <Analysis /> },
    { id: 'documents', label: '📁 Документы', component: <Documents /> },
    { id: 'dashboard', label: '📊 Панель', component: <Dashboard /> },
  ];

  const renderContent = () => {
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.component : <Chat />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Заголовок приложения */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                LegalGuard AI
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Помощник по уголовным делам РФ
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Дело №2-1234/2024
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                Войти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Навигация */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Основное содержимое */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Футер */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2024 LegalGuard AI. Все права защищены.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Анализ судебных документов, поиск процессуальных ошибок
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 mr-2">AI системы:</span>
                <span className="inline-flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded">ChatGPT</span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded">GigaChat</span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs rounded">DeepSeek</span>
                </span>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Версия 1.0.0
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
