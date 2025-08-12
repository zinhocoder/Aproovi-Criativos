"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  MessageSquare,
  Eye,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  Play
} from 'lucide-react'
import { useClientCompany } from '@/hooks/use-client-company'
import { useCreatives } from '@/hooks/use-creatives'
import { Creative, apiService } from '@/lib/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'
// import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Loader2 } from 'lucide-react'

export default function ClientDashboard() {
  // Removido useProtectedRoute - AuthGuard no layout já protege a rota
  const { company, loading: companyLoading } = useClientCompany()
  const { 
    updateStatus, 
    addComment
  } = useCreatives()
  const { toast } = useToast()

  // Estado local para criativos do cliente (isolado)
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [creativesLoading, setCreativesLoading] = useState(true)
  const [creativesError, setCreativesError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [comentario, setComentario] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Função local para buscar criativos apenas da empresa
  const fetchCompanyCreatives = async (empresaId: string) => {
    try {
      setCreativesLoading(true)
      setCreativesError(null)
      
      const response = await apiService.getCreatives(empresaId)
      
      if (response.success && response.data) {
        setCreatives(response.data)
        console.log(`✅ Carregados ${response.data.length} criativos para empresa ${empresaId}`)
        return response.data // Retornar os dados para uso nas funções
      } else {
        setCreativesError(response.error || 'Erro ao buscar criativos')
        setCreatives([])
        return []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setCreativesError(errorMessage)
      setCreatives([])
      console.error('❌ Erro ao buscar criativos:', errorMessage)
      return []
    } finally {
      setCreativesLoading(false)
    }
  }

  // Buscar criativos da empresa quando a empresa for carregada
  useEffect(() => {
    if (company?.id) {
      console.log(`🔍 Buscando criativos para empresa: ${company.nome} (${company.id})`)
      fetchCompanyCreatives(company.id)
    }
  }, [company?.id])

  // Filtrar criativos
  const filteredCreatives = creatives.filter(creative => {
    const matchesSearch = creative.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creative.legenda?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || creative.status === statusFilter
    const matchesTipo = tipoFilter === 'all' || creative.tipo === tipoFilter
    
    return matchesSearch && matchesStatus && matchesTipo
  })

  // Contar criativos por status
  const statusCounts = {
    total: creatives.length,
    pendente: creatives.filter(c => c.status === 'pendente').length,
    aprovado: creatives.filter(c => c.status === 'aprovado').length,
    reprovado: creatives.filter(c => c.status === 'reprovado').length,
  }

  // Função para aprovar criativo
  const handleAprovar = async (creative: Creative) => {
    setIsSubmitting(true)
    try {
      const response = await updateStatus(creative.id, 'aprovado', comentario)
      
      setComentario('')
      
      // Recarregar criativos após aprovação
      if (company?.id) {
        const updatedCreatives = await fetchCompanyCreatives(company.id)
        
        // Atualizar o criativo selecionado no modal
        const updatedCreative = updatedCreatives?.find(c => c.id === creative.id)
        if (updatedCreative) {
          setSelectedCreative(updatedCreative)
        }
      }
      
      // Fechar modal e mostrar sucesso
      setDialogOpen(false)
      
    } catch (error) {
      console.error('Erro ao aprovar:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para reprovar criativo
  const handleReprovar = async (creative: Creative) => {
    // Verificar se há comentário quando reprovar
    if (!comentario.trim()) {
      toast({
        title: "Comentário obrigatório",
        description: "É obrigatório escrever um comentário ao reprovar um criativo",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    try {
      const response = await updateStatus(creative.id, 'reprovado', comentario)
      
      setComentario('')
      
      // Recarregar criativos após reprovação
      if (company?.id) {
        const updatedCreatives = await fetchCompanyCreatives(company.id)
        
        // Atualizar o criativo selecionado no modal
        const updatedCreative = updatedCreatives?.find(c => c.id === creative.id)
        if (updatedCreative) {
          setSelectedCreative(updatedCreative)
        }
      }
      
      // Fechar modal e mostrar sucesso
      setDialogOpen(false)
      
      toast({
        title: "Criativo reprovado",
        description: "O criativo foi reprovado com sucesso",
      })
      
    } catch (error) {
      console.error('Erro ao reprovar:', error)
      toast({
        title: "Erro ao reprovar",
        description: "Ocorreu um erro ao reprovar o criativo",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para adicionar comentário
  const handleAddComment = async (creative: Creative) => {
    if (!comentario.trim()) return
    
    setIsSubmitting(true)
    try {
      await addComment(creative.id, comentario)
      setComentario('')
      
      // Recarregar criativos após comentário
      if (company?.id) {
        const updatedCreatives = await fetchCompanyCreatives(company.id)
        
        // Atualizar o criativo selecionado no modal
        const updatedCreative = updatedCreatives?.find(c => c.id === creative.id)
        if (updatedCreative) {
          setSelectedCreative(updatedCreative)
        }
      }
      
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'reprovado':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  // Função para obter cor do badge
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'aprovado':
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case 'reprovado':
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    }
  }

  // Função para traduzir status
  const translateStatus = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado'
      case 'reprovado':
        return 'Reprovado'
      default:
        return 'Pendente'
    }
  }

  // Função para obter ícone do tipo
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'video':
      case 'reels':
      case 'motion':
        return <Play className="h-4 w-4" />
      default:
        return <ImageIcon className="h-4 w-4" />
    }
  }

  if (companyLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-6"></div>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Empresa não encontrada</h1>
          <p className="text-muted-foreground">
            Não foi possível carregar as informações da empresa.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Meus Criativos
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize, aprove e comente os criativos da {company.nome}
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">criativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pendente}</div>
            <p className="text-xs text-muted-foreground">aguardando análise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.aprovado}</div>
            <p className="text-xs text-muted-foreground">prontos para uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reprovados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.reprovado}</div>
            <p className="text-xs text-muted-foreground">precisam ajustes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por título ou legenda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="aprovado">Aprovados</SelectItem>
                <SelectItem value="reprovado">Reprovados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="carrossel">Carrossel</SelectItem>
                <SelectItem value="reels">Reels</SelectItem>
                <SelectItem value="motion">Motion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Criativos */}
      <Card>
        <CardHeader>
          <CardTitle>Criativos ({filteredCreatives.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {creativesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCreatives.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum criativo encontrado
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || tipoFilter !== 'all'
                  ? 'Tente ajustar os filtros para encontrar criativos.'
                  : 'Ainda não há criativos para esta empresa.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCreatives.map((creative) => (
                <div
                  key={creative.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={creative.url}
                        alt={creative.titulo || 'Criativo'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTipoIcon(creative.tipo || 'post')}
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {creative.titulo || 'Sem título'}
                        </h3>
                        <Badge className={getStatusBadgeVariant(creative.status)}>
                          {translateStatus(creative.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground space-x-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(creative.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {creative.uploadedBy.name}
                        </div>
                        {creative.legenda && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span className="truncate max-w-32">{creative.legenda}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCreative(creative)
                        setDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        window.location.href = `/cliente/criativos/${creative.id}`
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Mais detalhes
                    </Button>

                    {creative.status === 'pendente' && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Aprovar Criativo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja aprovar este criativo? Esta ação pode ser desfeita posteriormente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Comentário (opcional)</label>
                              <Textarea
                                placeholder="Adicione um comentário sobre a aprovação..."
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                rows={3}
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleAprovar(creative)}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {isSubmitting ? 'Aprovando...' : 'Aprovar'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <XCircle className="h-4 w-4 mr-1" />
                              Reprovar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reprovar Criativo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja reprovar este criativo? Adicione um comentário explicando os motivos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Comentário *</label>
                              <Textarea
                                placeholder="Explique os motivos da reprovação..."
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                rows={3}
                                required
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                             <AlertDialogAction
                                 onClick={() => handleReprovar(creative)}
                                 disabled={isSubmitting}
                                 className="bg-red-600 hover:bg-red-700"
                               >
                                 {isSubmitting ? 'Reprovando...' : 'Reprovar'}
                               </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCreative(creative)
                        setDialogOpen(true)
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Comentar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Visualização */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCreative && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getTipoIcon(selectedCreative.tipo || 'post')}
                  {selectedCreative.titulo || 'Criativo sem título'}
                  <Badge className={getStatusBadgeVariant(selectedCreative.status)}>
                    {translateStatus(selectedCreative.status)}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Imagem/Vídeo */}
                <div className="flex justify-center">
                  <div className="max-w-2xl w-full">
                    <img
                      src={selectedCreative.url}
                      alt={selectedCreative.titulo || 'Criativo'}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                {/* Informações */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">INFORMAÇÕES</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo:</span>
                        <span className="font-medium">{selectedCreative.tipo || 'Post'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Criado em:</span>
                        <span className="font-medium">
                          {format(new Date(selectedCreative.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Enviado por:</span>
                        <span className="font-medium">{selectedCreative.uploadedBy.name}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">LEGENDA/COPY</h4>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {selectedCreative.legenda || 'Nenhuma legenda fornecida'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comentários */}
                {/* Histórico de Comentários */}
                {(() => {
                  let comentarios = []
                  if (selectedCreative.comentarios) {
                    try {
                      const comentariosData = JSON.parse(selectedCreative.comentarios)
                      if (Array.isArray(comentariosData)) {
                        comentarios = comentariosData
                      }
                    } catch (error) {
                      console.error('Erro ao parsear comentários:', error)
                    }
                  }
                  
                  // Se não há comentários múltiplos, mostrar comentário único (compatibilidade)
                  if (comentarios.length === 0 && selectedCreative.comentario) {
                    comentarios = [{
                      id: '1',
                      texto: selectedCreative.comentario,
                      autor: 'Sistema',
                      createdAt: selectedCreative.updatedAt
                    }]
                  }
                  
                  return comentarios.length > 0 ? (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">COMENTÁRIOS ({comentarios.length})</h4>
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {comentarios.map((comentarioItem, index) => (
                          <div key={comentarioItem.id || index} className="flex gap-3 p-3 bg-muted rounded-lg">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback>
                                {comentarioItem.autor ? comentarioItem.autor.charAt(0).toUpperCase() : '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{comentarioItem.autor || 'Usuário'}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(comentarioItem.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </span>
                              </div>
                              <p className="text-sm text-foreground">{comentarioItem.texto}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                })()}

                {/* Ações no Dialog */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  {selectedCreative.status === 'pendente' && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprovar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Aprovar Criativo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja aprovar este criativo?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Comentário (opcional)</label>
                            <Textarea
                              placeholder="Adicione um comentário sobre a aprovação..."
                              value={comentario}
                              onChange={(e) => setComentario(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                handleAprovar(selectedCreative)
                              }}
                              disabled={isSubmitting}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isSubmitting ? 'Aprovando...' : 'Aprovar'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reprovar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reprovar Criativo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja reprovar este criativo? Adicione um comentário explicando os motivos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Comentário *</label>
                            <Textarea
                              placeholder="Explique os motivos da reprovação..."
                              value={comentario}
                              onChange={(e) => setComentario(e.target.value)}
                              rows={3}
                              required
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                         <AlertDialogAction
                               onClick={() => {
                                 handleReprovar(selectedCreative)
                               }}
                               disabled={isSubmitting}
                               className="bg-red-600 hover:bg-red-700"
                             >
                               {isSubmitting ? 'Reprovando...' : 'Reprovar'}
                             </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  <div className="flex-1">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Adicione um comentário..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        rows={2}
                      />
                      <Button
                        onClick={() => handleAddComment(selectedCreative)}
                        disabled={!comentario.trim() || isSubmitting}
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Enviando...' : 'Comentar'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}