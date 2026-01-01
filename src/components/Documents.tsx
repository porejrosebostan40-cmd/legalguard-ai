import React, { useState } from 'react';

type Document = {
  id: number;
  name: string;
  type: 'приговор' | 'жалоба' | 'ходатайство' | 'протокол' | 'доказательство' | 'иное';
  date: string;
  size: string;
  status: 'загружено' | 'в обработке' | 'проанализировано' | 'использовано';
  description: string;
};

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: 'Приговор Ленинского районного суда',
      type: 'приговор',
      date: '15.12.2024',
      size: '2.4 МБ',
      status: 'проанализировано',
      description: 'Основной приговор по делу №2-1234/2024. Выявлены 3 процессуальных нарушения.'
    },
    {
      id: 2,
      name: 'Апелляционная жалоба (черновик)',
      type: 'жалоба',
      date: '20.12.2024',
      size: '1.1 МБ',
      status: 'использовано',
      description: 'Сгенерирована AI на основе анализа приговора. Требуется подпись.'
    },
    {
      id: 3,
      name: 'Ходатайство об ознакомлении с материалами дела',
      type: 'ходатайство',
      date: '10.12.2024',
      size: '0.8 МБ',
      status: 'загружено',
      description: 'Подано в суд первой инстанции 11.12.2024'
    },
    {
      id: 4,
      name: 'Протокол судебного заседания',
      type: 'протокол',
      date: '05.12.2024',
      size: '3.2 МБ',
      status: 'в обработке',
      description: 'Загружен для анализа процессуальных нарушений'
    },
    {
      id: 5,
      name: 'Заключение эксперта',
      type: 'доказательство',
      date: '01.12.2024',
      size: '4.5 МБ',
      status: 'загружено',
      description: 'Судебная почерковедческая экспертиза'
    },
    {
      id: 6,
      name: 'Кассационная жалоба',
      type: 'жалоба',
      date: '25.12.2024',
      size: '1.5 МБ',
      status: 'в обработке',
      description: 'Подготовка к подаче в кассационную инстанцию'
    }
  ]);

  const [newDocument, setNewDocument] = useState<Omit<Document, 'id' | 'status'>>({
    name: '',
    type: 'иное',
    date: new Date().toLocaleDateString('ru-RU'),
    size: '0 МБ',
    description: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('все');
  const [filterStatus, setFilterStatus] = useState<string>('все');

  const documentTypes = ['все', 'приговор', 'жалоба', 'ходатайство', 'протокол', 'доказательство', 'иное'];
  const statusTypes = ['все', 'загружено', 'в обработке', 'проанализировано', 'использовано'];

  const handleAddDocument = () => {
    if (!newDocument.name.trim()) {
      alert('Введите название документа');
      return;
    }

    const newDoc: Document = {
      id: documents.length + 1,
      ...newDocument,
      status: 'загружено'
    };

    setDocuments([newDoc, ...documents]);
    setNewDocument({
      name: '',
      type: 'иное',
      date: new Date().toLocaleDateString('ru-RU'),
      size: '0 МБ',
      description: ''
    });
  };

  const handleDeleteDocument = (id: number) => {
    if (window.confirm('Удалить этот документ?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const handleAnalyzeDocument = (id: number) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === id ? { ...doc, status: 'проанализировано' } : doc
    ));
    alert('Документ отправлен на анализ. Результаты будут в чате.');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'все' || doc.type === filterType;
    const matchesStatus = filterStatus === 'все' || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'загружено': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'в обработке': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'проанализировано': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'использовано': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'приговор': return '⚖️';
      case 'жалоба': return '📝';
      case 'ходатайство': return '📄';
      case 'протокол': return '📋';
      case 'доказательство': return '🔍';
      case 'иное': return '📎';
      default: return '📎';
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Управление документами дела
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Храните, анализируйте и управляйте всеми документами по уголовному делу в одном месте
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Добавление документа */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Добавить документ
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Название документа
                  </label>
                  <input
                    type="text"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                    placeholder="Например: Приговор суда от..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Тип документа
                  </label>
                  <select
                    value={newDocument.type}
                    onChange={(e) => setNewDocument({...newDocument, type: e.target.value as Document['type']})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="приговор">Приговор</option>
                    <option value="жалоба">Жалоба</option>
                    <option value="ходатайство">Ходатайство</option>
                    <option value="протокол">Протокол</option>
                    <option value="доказательство">Доказательство</option>
                    <option value="иное">Иное</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Дата
                    </label>
                    <input
                      type="text"
                      value={newDocument.date}
                      onChange={(e) => setNewDocument({...newDocument, date: e.target.value})}
                      placeholder="ДД.ММ.ГГГГ"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Размер
                    </label>
                    <input
                      type="text"
                      value={newDocument.size}
                      onChange={(e) => setNewDocument({...newDocument, size: e.target.value})}
                      placeholder="0 МБ"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Описание
                  </label>
                  <textarea
                    value={newDocument.description}
                    onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                    placeholder="Краткое описание документа..."
                    className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                <button
                  onClick={handleAddDocument}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium"
                >
                  Добавить документ
                </button>

                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Максимальный размер файла: 10 МБ. Поддерживаемые форматы: PDF, DOC, DOCX, JPEG, PNG.
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                📊 Статистика документов
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Всего документов:</span>
                  <span className="font-semibold">{documents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Проанализировано:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {documents.filter(d => d.status === 'проанализировано').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">В обработке:</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {documents.filter(d => d.status === 'в обработке').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Использовано в жалобах:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {documents.filter(d => d.status === 'использовано').length}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Быстрые действия
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const unanalyzed = documents.filter(d => d.status !== 'проанализировано');
                      if (unanalyzed.length > 0) {
                        alert(`Отправлено ${unanalyzed.length} документов на анализ. Проверьте чат.`);
                        setDocuments(docs => docs.map(doc => 
                          unanalyzed.some(u => u.id === doc.id) 
                            ? { ...doc, status: 'проанализировано' }
                            : doc
                        ));
                      } else {
                        alert('Все документы уже проанализированы.');
                      }
                    }}
                    className="w-full text-left p-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  >
                    🔍 Проанализировать все документы
                  </button>
                  <button
                    onClick={() => {
                      const complaintDocs = documents.filter(d => d.type === 'жалоба');
                      if (complaintDocs.length > 0) {
                        alert(`У вас ${complaintDocs.length} жалоб. Перейдите во вкладку "Жалобы" для редактирования.`);
                      } else {
                        alert('У вас нет созданных жалоб.');
                      }
                    }}
                    className="w-full text-left p-2 text-sm bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-green-900/50"
                  >
                    📝 Перейти к жалобам
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - Список документов */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Все документы ({filteredDocuments.length})
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Поиск документов..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      {documentTypes.map(type => (
                        <option key={type} value={type}>
                          {type === 'все' ? 'Все типы' : type}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      {statusTypes.map(status => (
                        <option key={status} value={status}>
                          {status === 'все' ? 'Все статусы' : status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {filteredDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="text-2xl">
                              {getTypeIcon(doc.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                  {doc.name}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(doc.status)}`}>
                                  {doc.status}
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span>Тип: {doc.type}</span>
                                <span>Дата: {doc.date}</span>
                                <span>Размер: {doc.size}</span>
                              </div>
                              
                              <p className="text-gray-700 dark:text-gray-300">
                                {doc.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {doc.status !== 'проанализировано' && doc.type === 'приговор' && (
                              <button
                                onClick={() => handleAnalyzeDocument(doc.id)}
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Анализ
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="px-3 py-1 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Документы не найдены
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500">
                      {searchTerm || filterType !== 'все' || filterStatus !== 'все' 
                        ? 'Попробуйте изменить параметры поиска' 
                        : 'Добавьте первый документ используя форму слева'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Информация о типах документов */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                📋 Типы документов и их назначение
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span>⚖️</span>
                    <span className="font-medium">Приговор</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Основной документ для анализа. AI ищет процессуальные нарушения для апелляции.
                  </p>
                </div>
                
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span>📝</span>
                    <span className="font-medium">Жалоба</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Апелляционные/кассационные жалобы, сгенерированные AI на основе анализа.
                  </p>
                </div>
                
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span>📄</span>
                    <span className="font-medium">Ходатайство</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Заявления сторон в ходе процесса. Могут содержать нарушения для обжалования.
                  </p>
                </div>
                
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span>📋</span>
                    <span className="font-medium">Протокол</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Протоколы судебных заседаний. Анализируются на предмет процессуальных нарушений.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
