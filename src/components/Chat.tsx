import React, { useState, useRef, useEffect } from 'react';
import { getAIService } from '../services/ai.service';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! Я ваш AI-помощник по уголовным делам. Вы можете ввести текст приговора, и я помогу найти процессуальные нарушения для апелляции или кассации.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Используем наш новый AI сервис
      const aiService = getAIService();
      
      // Определяем тип запроса
      const text = inputText.toLowerCase();
      let response: string;

      if (text.includes('составь') || text.includes('жалоб') || text.includes('шаблон')) {
        // Если запрос на составление жалобы
        response = await aiService.draftAppeal(
          inputText,
          {
            caseNumber: '2-1234/2024',
            courtName: 'Московский городской суд',
            verdictDate: '15.12.2024',
            clientName: 'Иванов И.И.',
          }
        );
      } else if (text.includes('практик') || text.includes('стать') || text.includes('упк')) {
        // Если запрос на поиск практики
        response = await aiService.searchPractice(inputText, 'апелляция');
      } else {
        // По умолчанию - анализ приговора
        response = await aiService.analyzeVerdict(inputText);
      }

      // Добавляем ответ AI
      const aiMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Ошибка при обработке запроса:', error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: 'Чат очищен. Чем могу помочь?',
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Заголовок */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              AI Помощник по уголовным делам
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Анализ приговоров, составление жалоб, поиск практики
            </p>
          </div>
          <button
            onClick={clearChat}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition"
          >
            Очистить чат
          </button>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.text}</div>
              <div
                className={`text-xs mt-2 ${
                  message.sender === 'user'
                    ? 'text-blue-200'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex space-x-2">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите текст приговора, запрос на поиск практики или попросите составить жалобу..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="self-end px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              ChatGPT: анализ
            </span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              GigaChat: жалобы
            </span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              DeepSeek: практика
            </span>
          </div>
          <p className="mt-2">
            Примеры запросов: "Проанализируй этот приговор", "Составь апелляционную жалобу", "Найди практику по ст. 389.15 УПК РФ"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
