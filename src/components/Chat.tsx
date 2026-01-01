import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Camera, Paperclip, User, Bot } from 'lucide-react'
import { GeminiService } from '../services/ai/gemini'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  type: 'text' | 'file'
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привет! Я LegalGuard AI. Загрузите приговор, и я найду процессуальные ошибки.',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() && !isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const gemini = new GeminiService()
      const response = await gemini.analyzeLegalText(input)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Ошибка соединения с AI. Проверьте API ключ.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileMessage: Message = {
      id: Date.now().toString(),
      content: `Файл загружен: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'file'
    }
    setMessages(prev => [...prev, fileMessage])

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      setInput(text)
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold dark:text-white">Юридический ассистент</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Анализ приговоров, поиск процессуальных ошибок
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-lg p-4 ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 dark:bg-gray-800 dark:text-white rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {msg.sender === 'user' ? 'Вы' : 'LegalGuard AI'}
                </span>
                <span className="text-xs opacity-75">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg rounded-bl-none p-4">
              <div className="flex items-center gap-2">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-sm dark:text-gray-300">Анализирую...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Введите текст приговора или вопрос..."
            className="flex-1 p-3 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />

          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Загрузить файл"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-lg ${
                isRecording
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Голосовой ввод"
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Сканировать документ"
            >
              <Camera className="w-5 h-5" />
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
          onChange={handleFileUpload}
        />

        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Поддерживаются: PDF, Word, изображения, текст. Максимальный размер: 10MB
        </div>
      </div>
    </div>
  )
}
