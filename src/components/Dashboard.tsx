import React, { useState, useEffect } from 'react';

type CaseStat = {
  id: number;
  title: string;
  value: string | number;
  change: string;
  icon: string;
  color: string;
};

type RecentActivity = {
  id: number;
  action: string;
  time: string;
  document: string;
  status: 'success' | 'warning' | 'error' | 'info';
};

type TimelineEvent = {
  id: number;
  date: string;
  title: string;
  description: string;
  type: 'court' | 'document' | 'analysis' | 'complaint';
};

const Dashboard: React.FC = () => {
  const [caseStats, setCaseStats] = useState<CaseStat[]>([
    { id: 1, title: 'Всего документов', value: '12', change: '+2', icon: '📄', color: 'blue' },
    { id: 2, title: 'Проанализировано AI', value: '8', change: '+3', icon: '🤖', color: 'green' },
    { id: 3, title: 'Жалобы составлены', value: '3', change: '+1', icon: '📝', color: 'purple' },
    { id: 4, title: 'Процессуальные нарушения', value: '14', change: '+4', icon: '⚖️', color: 'red' },
    { id: 5, title: 'Дней до апелляции', value: '7', change: '-1', icon: '⏳', color: 'yellow' },
    { id: 6, title: 'Успешность апелляций', value: '78%', change: '+5%', icon: '📈', color: 'teal' },
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    { id: 1, action: 'Анализ приговора', time: '10 мин назад', document: 'Приговор №2-1234/2024', status: 'success' },
    { id: 2, action: 'Составление жалобы', time: '45 мин назад', document: 'Апелляционная жалоба', status: 'success' },
    { id: 3, action: 'Загрузка документа', time: '2 часа назад', document: 'Протокол заседания', status: 'info' },
    { id: 4, action: 'Поиск практики', time: '3 часа назад', document: 'ст. 389.15 УПК', status: 'success' },
    { id: 5, action: 'Требуется подпись', time: '5 часов назад', document: 'Кассационная жалоба', status: 'warning' },
  ]);

  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    { id: 1, date: '15.12.2024', title: 'Вынесен приговор', description: 'Ленинский районный суд, дело №2-1234/2024', type: 'court' },
    { id: 2, date: '16.12.2024', title: 'Анализ AI', description: 'Выявлено 5 процессуальных нарушений', type: 'analysis' },
    { id: 3, date: '17.12.2024', title: 'Составлена апелляция', description: 'Черновик жалобы сгенерирован AI', type: 'complaint' },
    { id: 4, date: '18.12.2024', title: 'Дополнительные документы', description: 'Загружены доказательства', type: 'document' },
    { id: 5, date: '20.12.2024', title: 'Поиск судебной практики', description: 'Найдено 3 похожих прецедента', type: 'analysis' },
    { id: 6, date: '25.12.2024', title: 'Подача жалобы', description: 'Срок до 25.12.2024', type: 'court' },
  ]);

  const [aiUsage, setAiUsage] = useState([
    { name: 'ChatGPT', value: 45, color: 'bg-green-500' },
    { name: 'GigaChat', value: 30, color: 'bg-blue-500' },
    { name: 'DeepSeek', value: 25, color: 'bg-purple-500' },
  ]);

  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 12,
    minutes: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes } = prev;
        
        if (minutes > 0) {
          minutes--;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
        }
        
        return { days, hours, minutes };
      });
    }, 60000); // Обновление каждую минуту

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'court': return '🏛️';
      case 'document': return '📄';
      case 'analysis': return '🤖';
      case 'complaint': return '📝';
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Панель управления делом
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Обзор прогресса по делу №2-1234/2024 "Иванов И.И."
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Срок подачи апелляции:</div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{timeLeft.days}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">дней</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{timeLeft.hours}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">часов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{timeLeft.minutes}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">минут</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика в карточках */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {caseStats.map((stat) => (
            <div key={stat.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <span className={`text-sm font-medium text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Активность */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-6">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Недавняя активность
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status === 'success' ? '✓' : 
                         activity.status === 'warning' ? '⚠' : 
                         activity.status === 'error' ? '✗' : 'i'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 dark:text-white">
                          {activity.action}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.document}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Таймлайн */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Хронология дела
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {timeline.map((event) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-lg">{getEventIcon(event.type)}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {event.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {event.date}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - AI и рекомендации */}
          <div className="space-y-6">
            {/* Использование AI */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Использование AI
              </h2>
              <div className="space-y-4">
                {aiUsage.map((ai, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{ai.name}</span>
                      <span className="font-medium">{ai.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${ai.color} h-2 rounded-full`}
                        style={{ width: `${ai.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium mb-2">Как используются AI:</p>
                  <ul className="space-y-1">
                    <li>• ChatGPT: анализ документов</li>
                    <li>• GigaChat: составление жалоб</li>
                    <li>• DeepSeek: поиск практики</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Рекомендации */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4">
                📋 Рекомендации
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="font-medium text-gray-800 dark:text-white mb-1">
                    Проверьте жалобу
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Кассационная жалоба требует вашей подписи и подачи до 25.12.2024
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="font-medium text-gray-800 dark:text-white mb-1">
                    Новые документы
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Загрузите протокол последнего заседания для анализа AI
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="font-medium text-gray-800 dark:text-white mb-1">
                    Поиск практики
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Найдено 3 новых прецедента по вашему типу нарушения
                  </p>
                </div>
              </div>
            </div>

            {/* Быстрые действия */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Быстрые действия
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium">
                  📝 Составить новую жалобу
                </button>
                <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 font-medium">
                  🔍 Проанализировать документы
                </button>
                <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 font-medium">
                  ⚖️ Найти судебную практику
                </button>
                <button className="w-full text-left p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium">
                  📄 Загрузить документы
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
