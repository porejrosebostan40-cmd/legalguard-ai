import React, { useState } from 'react';
import { getAIService } from '../services/ai.service';

const Complaints: React.FC = () => {
  const [complaintText, setComplaintText] = useState('');
  const [generatedComplaint, setGeneratedComplaint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [caseInfo, setCaseInfo] = useState({
    caseNumber: '',
    courtName: '',
    verdictDate: '',
    clientName: '',
    complaintType: 'апелляционная' as 'апелляционная' | 'кассационная'
  });

  const handleGenerateComplaint = async () => {
    if (!complaintText.trim()) {
      alert('Введите текст приговора или описание нарушений');
      return;
    }

    setIsLoading(true);

    try {
      const aiService = getAIService();
      
      // Сначала анализируем текст для выявления нарушений
      const analysis = await aiService.analyzeVerdict(complaintText);
      
      // Затем составляем жалобу на основе анализа
      const draft = await aiService.draftAppeal(analysis, {
        caseNumber: caseInfo.caseNumber || '2-1234/2024',
        courtName: caseInfo.courtName || 'Московский городской суд',
        verdictDate: caseInfo.verdictDate || '15.12.2024',
        clientName: caseInfo.clientName || 'Иванов И.И.'
      });

      setGeneratedComplaint(draft);
    } catch (error) {
      console.error('Ошибка при составлении жалобы:', error);
      alert('Произошла ошибка при составлении жалобы. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaseInfoChange = (field: keyof typeof caseInfo, value: string) => {
    setCaseInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedComplaint);
    alert('Жалоба скопирована в буфер обмена!');
  };

  const clearForm = () => {
    setComplaintText('');
    setGeneratedComplaint('');
    setCaseInfo({
      caseNumber: '',
      courtName: '',
      verdictDate: '',
      clientName: '',
      complaintType: 'апелляционная'
    });
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Составление апелляционных и кассационных жалоб
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Использует GigaChat для профессионального оформления юридических документов
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левая колонка - Ввод данных */}
          <div className="space-y-6">
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
                Текст приговора / описание нарушений
              </h2>
              
              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Вставьте текст приговора или опишите процессуальные нарушения, которые хотите обжаловать..."
                className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
              />
              
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleGenerateComplaint}
                  disabled={isLoading || !complaintText.trim()}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                      Составление жалобы...
                    </span>
                  ) : (
                    'Составить жалобу'
                  )}
                </button>
                
                <button
                  onClick={clearForm}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Очистить
                </button>
              </div>
            </div>
          </div>

          {/* Правая колонка - Результат */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {generatedComplaint ? 'Готовая жалоба' : 'Результат'}
              </h2>
              
              {generatedComplaint && (
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Копировать
                </button>
              )}
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              {generatedComplaint ? (
                <pre className="p-4 max-h-[600px] overflow-y-auto whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200">
                  {generatedComplaint}
                </pre>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">Жалоба ещё не сгенерирована</p>
                  <p className="text-sm">Заполните форму слева и нажмите "Составить жалобу"</p>
                  <p className="text-xs mt-4 text-gray-400 dark:text-gray-500">
                    Используется GigaChat для стилизации и оформления документа
                  </p>
                </div>
              )}
            </div>
            
            {generatedComplaint && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Что дальше?</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>1. Проверьте данные в шапке жалобы (номер дела, суд, дату)</li>
                  <li>2. Дополните мотивировочную часть конкретными доказательствами</li>
                  <li>3. Приложите копии документов, на которые есть ссылки</li>
                  <li>4. Подпишите жалобу и направьте в суд в установленный срок</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
