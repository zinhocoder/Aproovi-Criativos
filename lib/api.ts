const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aproovi-backend-wandering-violet-6242.fly.dev';

export interface Creative {
  id: string;
  url: string;
  fileName: string;
  titulo?: string;
  status: 'pendente' | 'aprovado' | 'reprovado';
  comentario?: string;
  comentarios?: string; // JSON string com histórico de comentários
  legenda?: string;
  tipo?: string;
  arquivos?: string; // JSON string
  versoes?: string; // JSON string
  deletedAt?: string; // Data de soft delete
  uploadedBy: {
    name: string;
  };
  uploadedById: string;
  empresa?: {
    id: string;
    nome: string;
  };
  empresaId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Empresa {
  id: string;
  nome: string;
  descricao?: string;
  logo?: string;
  clienteEmail: string;
  ativa: boolean;
  createdBy: {
    name: string;
  };
  createdById: string;
  _count: {
    creatives: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  texto: string;
  autor: string;
  autorId: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {


  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Não definir Content-Type para FormData (deixar o browser definir)
    const isFormData = options.body instanceof FormData;
    
    const config: RequestInit = {
      credentials: 'include', // Incluir cookies
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Verificar se a resposta é válida
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Tratamento específico para erros de rede
      if (error instanceof Error && error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Servidor temporariamente indisponível. Tente novamente em alguns segundos.');
      }
      
      throw error;
    }
  }

  // Criativos
  async getCreatives(empresaId?: string, status?: string, tipo?: string): Promise<ApiResponse<Creative[]>> {
    const params = new URLSearchParams();
    if (empresaId) params.append('empresaId', empresaId);
    if (status) params.append('status', status);
    if (tipo) params.append('tipo', tipo);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/creatives?${queryString}` : '/api/creatives';
    
    return this.request<Creative[]>(endpoint);
  }

  // Buscar criativo específico por ID
  async getCreativeById(id: string): Promise<ApiResponse<Creative>> {
    return this.request<Creative>(`/api/creatives/${id}`);
  }

  async uploadCreative(file: File, titulo?: string, legenda?: string, tipo?: string, empresaId?: string): Promise<ApiResponse<Creative>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (titulo) formData.append('titulo', titulo);
    if (legenda) formData.append('legenda', legenda);
    if (tipo) formData.append('tipo', tipo);
    if (empresaId) formData.append('empresaId', empresaId);

    return this.request<Creative>('/api/creatives/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async uploadMultipleCreative(files: File[], legenda?: string, tipo?: string, titulo?: string, empresaId?: string): Promise<ApiResponse<Creative>> {
    const formData = new FormData();
    
    // Adicionar todos os arquivos
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    // Adicionar metadados
    if (legenda) formData.append('legenda', legenda);
    if (tipo) formData.append('tipo', tipo);
    if (titulo) formData.append('titulo', titulo);
    if (empresaId) formData.append('empresaId', empresaId);
    formData.append('fileCount', files.length.toString());

    return this.request<Creative>('/api/creatives/upload-multiple', {
      method: 'POST',
      body: formData,
    });
  }

  async updateCreativeStatus(id: string, status: 'pendente' | 'aprovado' | 'reprovado', comentario?: string): Promise<ApiResponse<Creative>> {
    return this.request<Creative>(`/api/creatives/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, comentario }),
    });
  }

  async addCreativeComment(id: string, comentario: string): Promise<ApiResponse<Creative>> {
    return this.request<Creative>(`/api/creatives/${id}/comment`, {
      method: 'PUT',
      body: JSON.stringify({ comentario }),
    });
  }

  async addCreativeVersion(id: string, file: File): Promise<ApiResponse<Creative>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<Creative>(`/api/creatives/${id}/versions`, {
      method: 'POST',
      body: formData,
    });
  }

  // Autenticação
  async login(email: string, password: string, userType: 'agency' | 'client' = 'agency'): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType }),
    });
  }

  async register(name: string, email: string, password: string, userType: 'agency' | 'client' = 'agency', accessKey?: string): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, userType, accessKey }),
    });
  }

  async checkAgencyRegistration(accessKey: string): Promise<ApiResponse<{ available: boolean; message: string }>> {
    return this.request<{ available: boolean; message: string }>(`/api/auth/check-agency-registration?accessKey=${encodeURIComponent(accessKey)}`, {
      method: 'GET',
    });
  }



  // Deletar criativo (soft delete)
  async deleteCreative(id: string): Promise<ApiResponse<Creative>> {
    return this.request<Creative>(`/api/creatives/${id}`, {
      method: 'DELETE',
    });
  }

  // Alterar imagem principal do criativo
  async updateCreativeImage(id: string, file: File): Promise<ApiResponse<Creative>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<Creative>(`/api/creatives/${id}/image`, {
      method: 'PUT',
      body: formData,
    });
  }

  // Adicionar comentário ao histórico
  async addCommentToHistory(id: string, comentario: string): Promise<ApiResponse<Creative & { comentario: Comment }>> {
    return this.request<Creative & { comentario: Comment }>(`/api/creatives/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comentario }),
    });
  }

  // ===== EMPRESAS =====

  // Listar empresas
  async getEmpresas(includeInactive: boolean = false): Promise<ApiResponse<Empresa[]>> {
    return this.request<Empresa[]>(`/api/empresas?includeInactive=${includeInactive}`);
  }

  // Criar empresa
  async createEmpresa(nome: string, descricao?: string, clienteEmail?: string, logo?: File): Promise<ApiResponse<Empresa>> {
    const formData = new FormData();
    formData.append('nome', nome);
    if (descricao) formData.append('descricao', descricao);
    if (clienteEmail) formData.append('clienteEmail', clienteEmail);
    if (logo) formData.append('logo', logo);

    return this.request<Empresa>('/api/empresas', {
      method: 'POST',
      body: formData,
    });
  }

  // Buscar empresa por ID
  async getEmpresaById(id: string): Promise<ApiResponse<Empresa>> {
    return this.request<Empresa>(`/api/empresas/${id}`);
  }

  // Buscar empresa por e-mail do cliente
  async getEmpresaByClienteEmail(email: string): Promise<ApiResponse<Empresa>> {
    return this.request<Empresa>(`/api/empresas/cliente/${encodeURIComponent(email)}`);
  }

  // Verificar se e-mail está registrado em empresa (endpoint público)
  async verifyClientEmail(email: string): Promise<ApiResponse<{ empresa: string; email: string }>> {
    const url = `${API_BASE_URL}/api/empresas/verify-email/${encodeURIComponent(email)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  // Atualizar empresa
  async updateEmpresa(id: string, data: { nome?: string; descricao?: string; ativa?: boolean; logo?: File }): Promise<ApiResponse<Empresa>> {
    const formData = new FormData();
    if (data.nome !== undefined) formData.append('nome', data.nome);
    if (data.descricao !== undefined) formData.append('descricao', data.descricao);
    if (data.ativa !== undefined) formData.append('ativa', data.ativa.toString());
    if (data.logo) formData.append('logo', data.logo);

    return this.request<Empresa>(`/api/empresas/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  // Deletar empresa (desativar)
  async deleteEmpresa(id: string): Promise<ApiResponse<Empresa>> {
    return this.request<Empresa>(`/api/empresas/${id}`, {
      method: 'DELETE',
    });
  }

  // Listar criativos de uma empresa
  async getCreativesByEmpresa(id: string, status?: string, tipo?: string): Promise<ApiResponse<Creative[]>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (tipo) params.append('tipo', tipo);
    
    const queryString = params.toString();
    const url = `/api/empresas/${id}/creatives${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Creative[]>(url);
  }

  // ===== RECUPERAÇÃO DE SENHA =====

  // Solicitar recuperação de senha
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Validar token de reset
  async validateResetToken(token: string): Promise<ApiResponse<{ valid: boolean }>> {
    return this.request<{ valid: boolean }>(`/api/auth/validate-reset-token/${token}`, {
      method: 'GET',
    });
  }

  // Redefinir senha
  async resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // ===== SESSÃO =====

  // Logout
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Verificar sessão
  async checkSession(): Promise<ApiResponse<{ authenticated: boolean; user?: any }>> {
    try {
      const url = `${API_BASE_URL}/api/auth/check-session`;
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      // Para check-session, não lançar erro se não autenticado
      if (response.status === 401) {
        return {
          success: false,
          data: { authenticated: false },
          message: data.message || 'Não autenticado'
        };
      }
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      return {
        success: false,
        data: { authenticated: false },
        message: 'Erro ao verificar sessão'
      };
    }
  }

  // Atualizar perfil
  async updateProfile(name: string): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>('/api/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }
}

export const apiService = new ApiService(); 