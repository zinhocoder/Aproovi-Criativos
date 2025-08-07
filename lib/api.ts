const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aproovi-backend-wandering-violet-6242.fly.dev/api';

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
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    // Não definir Content-Type para FormData (deixar o browser definir)
    const isFormData = options.body instanceof FormData;
    
    const config: RequestInit = {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
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
    const url = `/creatives${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Creative[]>(url);
  }

  async uploadCreative(file: File, titulo?: string, legenda?: string, tipo?: string, empresaId?: string): Promise<ApiResponse<Creative>> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    
    if (titulo) formData.append('titulo', titulo);
    if (legenda) formData.append('legenda', legenda);
    if (tipo) formData.append('tipo', tipo);
    if (empresaId) formData.append('empresaId', empresaId);

    const response = await fetch(`${API_BASE_URL}/creatives/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  async uploadMultipleCreative(files: File[], legenda?: string, tipo?: string, titulo?: string, empresaId?: string): Promise<ApiResponse<Creative>> {
    const token = this.getAuthToken();
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

    const response = await fetch(`${API_BASE_URL}/creatives/upload-multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  async updateCreativeStatus(id: string, status: 'pendente' | 'aprovado' | 'reprovado'): Promise<ApiResponse<Creative>> {
    return this.request<Creative>(`/creatives/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async addCreativeComment(id: string, comentario: string): Promise<ApiResponse<Creative>> {
    return this.request<Creative>(`/creatives/${id}/comment`, {
      method: 'PUT',
      body: JSON.stringify({ comentario }),
    });
  }

  async addCreativeVersion(id: string, file: File): Promise<ApiResponse<Creative>> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/creatives/${id}/versions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Autenticação
  async login(email: string, password: string, userType: 'agency' | 'client' = 'agency'): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType }),
    });
  }

  async register(name: string, email: string, password: string, userType: 'agency' | 'client' = 'agency'): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, userType }),
    });
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Deletar criativo (soft delete)
  async deleteCreative(id: string): Promise<ApiResponse<Creative>> {
    return this.request<Creative>(`/creatives/${id}`, {
      method: 'DELETE',
    });
  }

  // Alterar imagem principal do criativo
  async updateCreativeImage(id: string, file: File): Promise<ApiResponse<Creative>> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/creatives/${id}/image`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  }

  // Adicionar comentário ao histórico
  async addCommentToHistory(id: string, comentario: string): Promise<ApiResponse<Creative & { comentario: Comment }>> {
    return this.request<Creative & { comentario: Comment }>(`/creatives/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comentario }),
    });
  }

  // ===== EMPRESAS =====

  // Listar empresas
  async getEmpresas(includeInactive: boolean = false): Promise<ApiResponse<Empresa[]>> {
    return this.request<Empresa[]>(`/empresas?includeInactive=${includeInactive}`);
  }

  // Criar empresa
  async createEmpresa(nome: string, descricao?: string, clienteEmail?: string, logo?: File): Promise<ApiResponse<Empresa>> {
    const formData = new FormData();
    formData.append('nome', nome);
    if (descricao) formData.append('descricao', descricao);
    if (clienteEmail) formData.append('clienteEmail', clienteEmail);
    if (logo) formData.append('logo', logo);

    return this.request<Empresa>('/empresas', {
      method: 'POST',
      body: formData,
    });
  }

  // Buscar empresa por ID
  async getEmpresaById(id: string): Promise<ApiResponse<Empresa>> {
    return this.request<Empresa>(`/empresas/${id}`);
  }

  // Buscar empresa por e-mail do cliente
  async getEmpresaByClienteEmail(email: string): Promise<ApiResponse<Empresa>> {
    return this.request<Empresa>(`/empresas/cliente/${encodeURIComponent(email)}`);
  }

  // Verificar se e-mail está registrado em empresa (endpoint público)
  async verifyClientEmail(email: string): Promise<ApiResponse<{ empresa: string; email: string }>> {
    const response = await fetch(`${API_BASE_URL}/empresas/verify-email/${encodeURIComponent(email)}`, {
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

    return this.request<Empresa>(`/empresas/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  // Deletar empresa (desativar)
  async deleteEmpresa(id: string): Promise<ApiResponse<Empresa>> {
    return this.request<Empresa>(`/empresas/${id}`, {
      method: 'DELETE',
    });
  }

  // Listar criativos de uma empresa
  async getCreativesByEmpresa(id: string, status?: string, tipo?: string): Promise<ApiResponse<Creative[]>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (tipo) params.append('tipo', tipo);
    
    const queryString = params.toString();
    const url = `/empresas/${id}/creatives${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Creative[]>(url);
  }
}

export const apiService = new ApiService(); 