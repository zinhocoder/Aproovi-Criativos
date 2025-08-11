import { useState, useEffect, useCallback } from 'react';
import { apiService, Creative } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useCreatives() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Buscar criativos
  const fetchCreatives = useCallback(async (empresaId?: string, status?: string, tipo?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCreatives(empresaId, status, tipo);
      
      if (response.success && response.data) {
        setCreatives(response.data);
      } else {
        setError(response.error || 'Erro ao buscar criativos');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Buscar criativo específico por ID
  const fetchCreativeById = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await apiService.getCreativeById(id);
      
      if (response.success && response.data) {
        // Atualizar o criativo na lista local ou adicionar se não existir
        setCreatives(prev => {
          const existingIndex = prev.findIndex(c => c.id === id);
          if (existingIndex >= 0) {
            // Atualizar criativo existente
            const updated = [...prev];
            updated[existingIndex] = response.data!;
            return updated;
          } else {
            // Adicionar novo criativo
            return [response.data!, ...prev];
          }
        });
        return response.data;
      } else {
        setError(response.error || 'Erro ao buscar criativo');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Upload de criativo
  const uploadCreative = async (file: File, titulo?: string, legenda?: string, tipo?: string, empresaId?: string) => {
    try {
      setLoading(true);
      const response = await apiService.uploadCreative(file, titulo, legenda, tipo, empresaId);
      
      if (response.success && response.data) {
        setCreatives(prev => [response.data!, ...prev]);
        toast({
          title: "Sucesso",
          description: response.message || "Criativo enviado com sucesso!",
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao enviar criativo');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload múltiplo de criativos (para carrossel)
  const uploadMultipleCreative = async (files: File[], legenda?: string, tipo?: string, titulo?: string, empresaId?: string) => {
    try {
      setLoading(true);
      const response = await apiService.uploadMultipleCreative(files, legenda, tipo, titulo, empresaId);
      
      if (response.success && response.data) {
        setCreatives(prev => [response.data!, ...prev]);
        toast({
          title: "Sucesso",
          description: response.message || `Carrossel com ${files.length} arquivos criado com sucesso!`,
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao enviar carrossel');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status
  const updateStatus = async (id: string, status: 'pendente' | 'aprovado' | 'reprovado', comentario?: string) => {
    try {
      const response = await apiService.updateCreativeStatus(id, status, comentario);
      
      if (response.success && response.data) {
        setCreatives(prev => 
          prev.map(creative => 
            creative.id === id ? response.data! : creative
          )
        );
        toast({
          title: "Status atualizado",
          description: response.message || `Status alterado para ${status}`,
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao atualizar status');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Adicionar comentário
  const addComment = async (id: string, comentario: string) => {
    try {
      const response = await apiService.addCommentToHistory(id, comentario);

      if (response.success && response.data) {
        setCreatives(prev =>
          prev.map(creative =>
            creative.id === id ? response.data! : creative
          )
        );
        toast({
          title: "Comentário adicionado",
          description: response.message || "Comentário adicionado com sucesso!",
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao adicionar comentário');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Filtrar criativos por status
  const getCreativesByStatus = (status: 'pendente' | 'aprovado' | 'reprovado') => {
    return creatives.filter(creative => creative.status === status);
  };

  // Adicionar versão a um criativo
  const addCreativeVersion = async (id: string, file: File) => {
    try {
      setLoading(true);
      const response = await apiService.addCreativeVersion(id, file);
      
      if (response.success && response.data) {
        // Atualizar o criativo na lista local com os novos dados
        setCreatives(prev => 
          prev.map(creative => 
            creative.id === id ? response.data! : creative
          )
        );
        
        console.log('Criativo atualizado após adicionar versão:', response.data);
        console.log('Nova URL:', response.data.url);
        
        toast({
          title: "Sucesso",
          description: response.message || "Nova versão adicionada com sucesso!",
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao adicionar versão');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar criativos na inicialização
  useEffect(() => {
    fetchCreatives();
  }, []);

  // Deletar criativo
  const deleteCreative = async (id: string) => {
    try {
      const response = await apiService.deleteCreative(id);
      
      if (response.success) {
        // Remover da lista local
        setCreatives(prev => prev.filter(creative => creative.id !== id));
        
        toast({
          title: "Sucesso",
          description: "Criativo removido com sucesso",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Alterar imagem do criativo
  const updateCreativeImage = async (id: string, file: File) => {
    try {
      const response = await apiService.updateCreativeImage(id, file);
      
      if (response.success && response.data) {
        // Atualizar na lista local
        setCreatives(prev => 
          prev.map(creative => 
            creative.id === id ? response.data! : creative
          )
        );
        
        toast({
          title: "Sucesso",
          description: "Imagem atualizada com sucesso",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Adicionar comentário ao histórico
  const addCommentToHistory = async (id: string, comentario: string) => {
    try {
      const response = await apiService.addCommentToHistory(id, comentario);
      
      if (response.success && response.data) {
        // Atualizar na lista local
        setCreatives(prev => 
          prev.map(creative => 
            creative.id === id ? response.data! : creative
          )
        );
        
        toast({
          title: "Sucesso",
          description: "Comentário adicionado ao histórico",
        });
        
        return response.data?.comentario; // Retornar o comentário criado
      } else {
        throw new Error(response.error || 'Erro ao adicionar comentário');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    creatives,
    loading,
    error,
    fetchCreatives,
    fetchCreativeById,
    uploadCreative,
    uploadMultipleCreative,
    updateStatus,
    addComment,
    addCreativeVersion,
    getCreativesByStatus,
    deleteCreative,
    updateCreativeImage,
    addCommentToHistory,
  };
} 