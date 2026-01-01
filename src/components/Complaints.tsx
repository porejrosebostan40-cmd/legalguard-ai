import React, { useState } from 'react';
import { getAIService } from '../services/ai.service';

type WorkflowStep = {
  id: number;
  title: string;
  ai: 'DeepSeek' | 'ChatGPT' | 'GigaChat';
  content: string;
  status: 'pending' | 'processing' | 'completed';
};

const Complaints: React.FC = () => {
  const [complaintText, setComplaintText] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [finalComplaint, setFinalComplaint] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [caseInfo, setCaseInfo] = useState({
    caseNumber: '',
    courtName: '',
    verdictDate: '',
    clientName: '',
    complaintType: 'апелляционная' as 'апелляционная' | 'кассационная'
  });

  const initializeWorkflow = () => {
    return [
      {
        id: 1,
        title: 'Анализ документа и поиск нарушений',
        ai: 'DeepSeek',
        content: 'Ожидание начала анализа...',
        status: 'pending' as const
      },
      {
        id: 2,
        title: 'Составление черновика жалобы',
        ai: 'ChatGPT',
        content: 'Ожидание результатов анализа...',
        status: 'pending' as const
      },
      {
        id: 3,
        title: 'Стилизация под судейский язык',
        ai: 'GigaChat',
        content: 'Ожидание черновика...',
        status: 'pending' as const
      },
      {
        id: 4,
        title: 'Утверждение окончательного варианта',
        ai: 'ChatGPT',
        content: 'Ожидание стилизованного текста...',
        status: 'pending' as const
      }
    ];
  };

  const handleGenerateComplaint = async () => {
    if (!complaintText.trim()) {
      alert('Введите текст приговора или документа для анализа');
      return;
    }

    // Инициализируем рабочий процесс
    const steps = initializeWorkflow();
    setWorkflowSteps(steps);
    setFinalComplaint('');
    setIsProcessing(true);
    setActiveStep(0);

    try {
      const aiService = getAIService();
      
      // Обновляем статус первого шага
      updateStepStatus(1, 'processing', 'DeepSeek анализирует документ...');

      // Запускаем полный рабочий цикл
      const result = await aiService.fullComplaintWorkflow(
        complaintText,
        {
          caseNumber: caseInfo.caseNumber || '2-1234/2024',
          courtName: caseInfo.courtName || 'Московский городской суд',
          verdictDate: caseInfo.verdictDate || '15.12.2024',
          clientName: caseInfo.clientName || 'Иванов И.И.',
          complaintType: caseInfo.complaintType
        }
      );

      // Обновляем шаги по мере выполнения
      await simulateWorkflowProgress(result);
      
      // Сохраняем финальный результат
      setFinalComplaint(result.finalComplaint);
      
    } catch (error) {
      console.error('Ошибка при составлении жалобы:', error);
      alert('Произошла ошибка при составлении жалобы. Попробуйте еще раз.');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateStepStatus = (stepId: number, status: WorkflowStep['status'], content?: string) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            status, 
            content: content || step.content,
            ...(status === 'processing' && { content: content || step.content })
          }
        : step
    ));
    setActiveStep(stepId - 1);
  };

  const simulateWorkflowProgress = async (result: any) => {
    // Шаг 1: DeepSeek анализ
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStepStatus(1, 'completed', result.step1);
    
    // Шаг 2: ChatGPT черновик
    updateStepStatus(2, 'processing', 'ChatGPT создаёт черновик на основе анализа...');
    await new Promise(resolve => setTimeout(resolve, 1200));
    updateStepStatus(2, 'completed', result.step2);
    
    // Шаг 3: GigaChat стилизация
    updateStepStatus(3, 'processing', 'GigaChat стилизует текст под судейский язык...');
    await new Promise(resolve => setTimeout(resolve, 900));
    updateStepStatus(3, 'completed', result.step3);
    
    // Шаг 4: ChatGPT утверждение
    updateStepStatus(4, 'processing', 'ChatGPT проверяет и утверждает окончательный вариант...');
    await new Promise(resolve => setTimeout(resolve, 800));
    updateStepStatus(4, 'completed', result.step4);
  };

  const handleCaseInfoChange = (field: keyof typeof caseInfo, value: string) => {
    setCaseInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearForm = () => {
    setComplaintText('');
    setWorkflowSteps([]);
    setFinalComplaint('');
    setCaseInfo({
      caseNumber: '',
      courtName: '',
      verdictDate: '',
      clientName: '',
      complaintType: 'апелляционная'
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalComplaint);
    alert('Жалоба скопирована в буфер обмена!');
  };

  const getStepStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'completed': return '✅';
      default: return '⏳';
    }
  };

  const getAIIcon = (ai: WorkflowStep['ai']) => {
    switch (ai) {
      case 'DeepSeek': return '🔍';
      case 'ChatGPT': return '🤖';
      case 'GigaChat': return '🎨';
      default: return '🤖';
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Автоматическое составление жалоб
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Использует трёхэтапную AI-систему: DeepSeek → ChatGPT → GigaChat → ChatGPT
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Ввод данных */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Информация по делу
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Тип жалобы
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCaseInfo(prev => ({...prev, complaintType: 'апелляционная'}))}
                      className={`px-4 py-2 rounded-lg ${caseInfo.complaintType === 'апелляционная' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      Апелляционная
                    </button>
                    <button
                      onClick={() => setCaseInfo(prev => ({...prev, complaintType: 'кассационная'}))}
                      className={`px-4 py-2 rounded-lg ${caseInfo.complaintType === 'кассационная' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      Кассационная
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Номер дела
                  </label>
                  <input
                    type="text"
                    value={caseInfo.caseNumber}
                    onChange={(e) => handleCaseInfoChange('caseNumber', e.target.value)}
                    placeholder="Например: 2-1234/2024"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Наименование суда
                  </label>
                  <input
                    type="text"
                    value={caseInfo.courtName}
                    onChange={(e) => handleCaseInfoChange('courtName', e.target.value)}
                    placeholder="Например: Московский городской суд"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Дата приговора
                    </label>
                    <input
                      type="text"
                      value={caseInfo.verdictDate}
                      onChange={(e) => handleCaseInfoChange('verdictDate', e.target.value)}
                      placeholder="ДД.ММ.ГГГГ"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ФИО клиента
                    </label>
                    <input
                      type="text"
                      value={caseInfo.clientName}
                      onChange={(e) => handleCaseInfoChange('clientName', e.target.value)}
                      placeholder="Иванов Иван Иванович"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Текст для анализа
              </h2>
              
              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Вставьте текст приговора, протокола или другого документа для анализа..."
                className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
              />
              
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleGenerateComplaint}
                  disabled={isProcessing || !complaintText.trim()}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                      Рабочий процесс...
                    </span>
                  ) : (
                    'Запустить рабочий процесс'
                  )}
                </button>
                
                <button
                  onClick={clearForm}
                  disabled={isProcessing}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Очистить
                </button>
              </div>
            </div>

            {/* Архитектура системы */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                🏗️ Архитектура системы
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-3">
                    <span>🔍</span>
                  </div>
                  <div>
                    <div className="font-medium">1. DeepSeek</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Анализ документа, поиск нарушений</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
                    <span>🤖</span>
                  </div>
                  <div>
                    <div className="font-medium">2. ChatGPT (центр)</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Составление черновика, координация</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mr-3">
                    <span>🎨</span>
                  </div>
                  <div>
                    <div className="font-medium">3. GigaChat</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Стилизация под судейский язык</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
                    <span>🤖</span>
                  </div>
                  <div>
                    <div className="font-medium">4. ChatGPT (финал)</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Утверждение окончательного варианта</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - Рабочий процесс и результат */}
          <div className="lg:col-span-2 space-y-6">
            {/* Рабочий процесс */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Рабочий процесс AI-системы
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Процесс составления жалобы проходит через 4 этапа с участием трёх ИИ
                </p>
              </div>
              
              <div className="p-6">
                {workflowSteps.length > 0 ? (
                  <div className="space-y-4">
                    {workflowSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`border rounded-lg p-4 ${activeStep === index ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{getStepStatusIcon(step.status)}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                  {step.title}
                                </h3>
                                <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                  {step.ai}
                                </span>
                                <span className="text-xl">{getAIIcon(step.ai)}</span>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Шаг {step.id} из 4
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            step.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : step.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {step.status === 'completed' ? 'Завершено' : 
                             step.status === 'processing' ? 'В процессе' : 'Ожидание'}
                          </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded">
                          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 dark:text-gray-300">
                            {step.content}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Рабочий процесс не запущен
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500 max-w-md mx-auto">
                      Заполните форму слева и запустите процесс составления жалобы.
                      Система автоматически пройдёт через все 4 этапа с участием трёх ИИ.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Результат */}
            {finalComplaint && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Готовая жалоба
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Утверждённый ChatGPT документ, готовый к использованию
                      </p>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Копировать
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <pre className="p-4 max-h-[500px] overflow-y-auto whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900">
                      {finalComplaint}
                    </pre>
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                      ✅ Рабочий процесс завершён успешно
                    </h3>
                    <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                      <li>• Все 4 этапа выполнены автоматически</li>
                      <li>• Документ проверен и утверждён ChatGPT</li>
                      <li>• Готов к подписанию и подаче в суд</li>
                      <li>• Рекомендуется проверить персональные данные</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
