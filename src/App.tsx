import React, { useState } from 'react'
import Layout from './components/Layout'
import Chat from './components/Chat'
import Complaints from './components/Complaints'
import Documents from './components/Documents'
import Analysis from './components/Analysis'
import Dashboard from './components/Dashboard'

type Tab = 'chat' | 'complaints' | 'documents' | 'analysis' | 'dashboard'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      >
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'complaints' && <Complaints />}
        {activeTab === 'documents' && <Documents />}
        {activeTab === 'analysis' && <Analysis />}
        {activeTab === 'dashboard' && <Dashboard />}
      </Layout>
    </div>
  )
}

export default App
