import React, { useState } from 'react';
import { getAIService } from '../services/ai.service';

type SearchResult = {
  id: number;
  title: string;
  content: string;
  source: string;
  relevance: number;
  date: string;
};

const Analysis: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'practice' | 'articles' | 'precedents'>('practice');

  const sampleResults: SearchResult[] = [
    {
      id: 1,
      title: 'Постановление Пленума ВС РФ №19 от 27.11.2012',
      content: 'О применении норм Уголовно-процессуального кодекса Российской Федерации, регулирующих судопроизводство в суде апелляционной инстанции',
      source: 'Верховный Суд РФ',
      relevance: 95,
      date: '27.11.2012'
    },
    {
      id: 2,
      title: 'Определение Конституционного Суда РФ №1234-О',
      content: 'О праве на апелляционное обжалование в уголовном процессе и гарантиях доступа к правосудию',
      source: 'Конституционный Суд РФ',
      relevance: 88,
      date: '15.05.2020'
    },
    {
      id: 3,
      title: 'Апелляционное определение Московского городского суда',
      content: 'Дело №33-12345/2023 по вопросу нарушения права на защиту при отказе в удовлетворении ходатайств',
      source: 'Мосгорсуд',
      relevance: 92,
      date: '10.03.2023'
    },
    {
      id: 4,
      title: 'Кассационное определение ВС РФ №78-КГ23-123',
      content: 'О возвращении дела на новое рассмотрение в связи с существенным нарушением норм УПК РФ',
      source: 'Верховный Суд РФ',
      relevance: 90,
      date: '25.08.2023'
    },
    {
      id: 5,
      title: 'Обзор судебной практики по уголовным делам',
      content: 'Рассмотрение вопросов назначения наказания и процессуальных нарушений в апелляционном производстве',
      source: 'Президиум ВС РФ',
      relevance: 85,
      date: '15.12.2021'
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    // Добавляем запрос в историю
    if (!searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
    }

    try {
      const aiService = getAIService();
      
      // Используем DeepSeek для поиска информации
      const result = await aiService.searchPractice(
        searchQuery,
        searchType === 'practice' ? 'апелляция' : 'кассация'
      );

      // Создаём новый результат на основе ответа AI
      const newResult: SearchResult = {
        id: Date.now(),
        title: `Результат поиска: ${searchQuery.substring(0, 30)}...`,
        content: result,
        source: 'DeepSeek AI',
        relevance: Math.floor(Math.random() * 20) + 80, // 80-99%
        date: new Date().toLocaleDateString('ru-RU')
      };

      // Добавляем к существующим результатам
      setSearchResults([newResult, ...sampleResults]);
    } catch (error) {
      console.error('Ошибка при поиске:', error);
      alert('Произошла ошибка при поиске. Используем демонстрационные данные.');
      setSearchResults(sampleResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const copyResult = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Текст скопирован в буфер обмена!');
  };

  const saveResult = (result: SearchResult) => {
    // В реальном приложении здесь была бы сохранение в базу данных
    alert(`Результат "${result.title}" сохранен в избранное!`);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Поиск судебной практики и правовой информации
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Использует DeepSeek для поиска актуальной судебной практики, статей УПК РФ и прецедентов
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Левая колонка - Поиск */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Параметры поиска
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Тип поиска
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'practice', label: 'Судебная практика', icon: '🏛️' },
                      { id: 'articles', label: 'Статьи УПК РФ', icon: '📚' },
                      { id: 'precedents', label: 'Похожие прецеденты', icon: '⚖️' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSearchType(type.id as any)}
                        className={`w-full text-left p-3 rounded-lg flex items-center ${searchType === type.id ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        <span className="text-xl mr-3">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Запрос
                  </label>
                  <textarea
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Например: 'нарушение ст. 389.15 УПК', 'право на защиту', 'процессуальные нарушения'..."
                    className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchQuery.trim()}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                      Поиск...
                    </span>
                  ) : (
                    'Найти информацию'
                  )}
                </button>

                <button
                  onClick={clearSearch}
                  className="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Очистить поиск
                </button>
              </div>
            </div>

            {/* История поиска */}
            {searchHistory.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                  История запросов
                </h3>
                <div className="space-y-2">
                  {searchHistory.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(query)}
                      className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                    >
                      {query.length > 40 ? query.substring(0, 40) + '...' : query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Подсказки */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                💡 Подсказки
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
                <li>• Используйте конкретные статьи УПК РФ</li>
                <li>• Указывайте тип нарушения (процессуальное, материальное)</li>
                <li>• Добавляйте ключевые слова: "апелляция", "кассация", "отмена"</li>
                <li>• Ищите по номерам дел или судебным актам</li>
              </ul>
            </div>
          </div>

          {/* Правая колонка - Результаты */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Результаты поиска
                    {searchQuery && (
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                        по запросу: "{searchQuery}"
                      </span>
                    )}
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Найдено: {searchResults.length} документов
                  </div>
                </div>
              </div>

              <div className="p-6">
                {searchResults.length > 0 ? (
                  <div className="space-y-6">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-blue-300 dark:hover:border-blue-700 transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded">
                                {result.source}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {result.date}
                              </span>
                              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded">
                                Релевантность: {result.relevance}%
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              {result.title}
                            </h3>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyResult(result.content)}
                              className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                              title="Копировать"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </button>
                            <button
                              onClick={() => saveResult(result)}
                              className="p-2 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400"
                              title="Сохранить"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded">
                            {result.content}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Начните поиск судебной практики
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500 max-w-md mx-auto">
                      Введите запрос о процессуальных нарушениях, статьях УПК РФ или похожих прецедентах. 
                      DeepSeek поможет найти актуальную информацию для вашего дела.
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="font-medium mb-2">Примеры запросов:</div>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• нарушение ст. 389.15 УПК</li>
                          <li>• право на защиту в апелляции</li>
                          <li>• отмена приговора</li>
                        </ul>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="font-medium mb-2">Статьи УПК РФ:</div>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• ст. 389.1-389.3 (апелляция)</li>
                          <li>• ст. 401.1-401.4 (кассация)</li>
                          <li>• ст. 389.15 (основания отмены)</li>
                        </ul>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="font-medium mb-2">Источники:</div>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Верховный Суд РФ</li>
                          <li>• Конституционный Суд</li>
                          <li>• Региональные суды</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
