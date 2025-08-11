'use client';

import { useState } from 'react';
import { apiService } from '@/lib/api';

export default function TestApiPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    setStatus('Testando conexão...');
    
         try {
               const response = await apiService.login('admin@aproovi.com', 'admin123');
       const data = response;
      
      if (response.success) {
        setStatus(`✅ Backend funcionando! Resposta: ${JSON.stringify(data)}`);
      } else {
        setStatus(`❌ Erro: ${response.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      setStatus(`❌ Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de API</h1>
      
      <button 
        onClick={testBackend}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Testando...' : 'Testar Backend'}
      </button>
      
      {status && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{status}</pre>
        </div>
      )}
    </div>
  );
} 