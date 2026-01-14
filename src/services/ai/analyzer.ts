// Временная заглушка анализатора
export async function analyzeDocumentWithAI(file: File, jurisdiction: string): Promise<any> {
  console.log('[ЗАГЛУШКА] Анализ документа:', file.name);
  
  return {
    documentType: 'ДОГОВОР',
    summary: 'Это тестовая заглушка. Настройте подключение к реальной AI-модели.',
    risks: [
      { description: 'AI-модель не подключена', severity: 'high' },
      { description: 'Требуется настройка API-ключа', severity: 'medium' }
    ],
    suggestions: [
      '1. Получите API-ключ от провайдера AI',
      '2. Добавьте ключ в настройки приложения',
      '3. Реализуйте вызов модели в этом файле'
    ],
    citations: [],
    confidence: 0.1
  };
}
