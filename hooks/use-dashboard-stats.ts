import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

export interface DashboardStats {
  totalEmpresas: number;
  totalCriativos: number;
  taxaAprovacao: number;
  tempoMedioAprovacao: number;
  criativosPorStatus: {
    pendente: number;
    aprovado: number;
    reprovado: number;
  };
  criativosRecentes: Array<{
    id: string;
    titulo: string;
    status: string;
    empresa: string;
    createdAt: string;
  }>;
  empresasAtivas: Array<{
    id: string;
    nome: string;
    totalCriativos: number;
    taxaAprovacao: number;
  }>;
  empresasComPendentes: Array<{
    id: string;
    nome: string;
    criativosPendentes: number;
    totalCriativos: number;
  }>;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar empresas
      const empresasResponse = await apiService.getEmpresas();
      const empresas = empresasResponse.success ? empresasResponse.data : [];

      // Buscar todos os criativos
      const criativosResponse = await apiService.getAllCreatives();
      const criativos = criativosResponse.success ? criativosResponse.data : [];

      // Calcular estatísticas
      const totalEmpresas = empresas.length;
      const totalCriativos = criativos.length;

      // Calcular criativos por status
      const criativosPorStatus = {
        pendente: criativos.filter(c => c.status === 'pendente').length,
        aprovado: criativos.filter(c => c.status === 'aprovado').length,
        reprovado: criativos.filter(c => c.status === 'reprovado').length,
      };

      // Calcular taxa de aprovação
      const taxaAprovacao = totalCriativos > 0 
        ? Math.round((criativosPorStatus.aprovado / totalCriativos) * 100)
        : 0;

      // Calcular tempo médio de aprovação (simplificado)
      const criativosAprovados = criativos.filter(c => c.status === 'aprovado');
      const tempoMedioAprovacao = criativosAprovados.length > 0 ? 1.2 : 0; // Placeholder

      // Criativos recentes (últimos 5)
      const criativosRecentes = criativos
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(c => ({
          id: c.id,
          titulo: c.titulo || 'Sem título',
          status: c.status,
          empresa: c.empresa?.nome || 'Empresa não encontrada',
          createdAt: c.createdAt,
        }));

      // Empresas mais ativas
      const empresasAtivas = empresas.map(empresa => {
        const criativosDaEmpresa = criativos.filter(c => c.empresaId === empresa.id);
        const aprovados = criativosDaEmpresa.filter(c => c.status === 'aprovado').length;
        const taxaAprovacaoEmpresa = criativosDaEmpresa.length > 0 
          ? Math.round((aprovados / criativosDaEmpresa.length) * 100)
          : 0;

        return {
          id: empresa.id,
          nome: empresa.nome,
          totalCriativos: criativosDaEmpresa.length,
          taxaAprovacao: taxaAprovacaoEmpresa,
        };
      }).sort((a, b) => b.totalCriativos - a.totalCriativos).slice(0, 4);

      // Empresas com criativos pendentes
      const empresasComPendentes = empresas.map(empresa => {
        const criativosDaEmpresa = criativos.filter(c => c.empresaId === empresa.id);
        const pendentes = criativosDaEmpresa.filter(c => c.status === 'pendente').length;

        return {
          id: empresa.id,
          nome: empresa.nome,
          criativosPendentes: pendentes,
          totalCriativos: criativosDaEmpresa.length,
        };
      }).filter(empresa => empresa.criativosPendentes > 0)
        .sort((a, b) => b.criativosPendentes - a.criativosPendentes)
        .slice(0, 4);

      const dashboardStats: DashboardStats = {
        totalEmpresas,
        totalCriativos,
        taxaAprovacao,
        tempoMedioAprovacao,
        criativosPorStatus,
        criativosRecentes,
        empresasAtivas,
        empresasComPendentes,
      };

      setStats(dashboardStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas';
      setError(errorMessage);
      console.error('Erro ao buscar estatísticas do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
} 