"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Upload, 
  Share2,
  Edit3,
  Save,
  X,
  Plus,
  History,
  Eye
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCreatives } from "@/hooks/use-creatives"
import { useEmpresas } from "@/hooks/use-empresas"
import { Carousel } from "@/components/ui/carousel"

interface Comment {
  id: string
  autor: string
  texto: string
  data: string
  autorId?: string
  createdAt: string
}

interface Version {
  url: string
  filename: string
  order?: number
  createdAt?: string
  version?: number
}

export default function CriativoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { 
    creatives, 
    updateStatus, 
    addComment, 
    addCreativeVersion, 
    deleteCreative, 
    updateCreativeImage, 
    addCommentToHistory,
    fetchCreatives,
    fetchCreativeById
  } = useCreatives()
  const criativoId = params.id as string
  
  const [comentario, setComentario] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("visualizacao")
  const [legenda, setLegenda] = useState("")
  const [copy, setCopy] = useState("")
  const [isEditingLegenda, setIsEditingLegenda] = useState(false)
  const [versoes, setVersoes] = useState<Version[]>([]) // Versões organizadas
  const [isUploadingVersion, setIsUploadingVersion] = useState(false)
  const [comentarios, setComentarios] = useState<Comment[]>([]) // Histórico de comentários
  const [isUpdatingImage, setIsUpdatingImage] = useState(false)
  const [isLoadingCreative, setIsLoadingCreative] = useState(true)
  const [isSharing, setIsSharing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Encontrar o criativo pelo ID
  const criativo = creatives.find(c => c.id === criativoId)

  // Função para buscar dados atualizados do criativo
  const fetchCreativeDetails = useCallback(async () => {
    if (!criativoId) return
    
    try {
      setIsLoadingCreative(true)
      console.log('Buscando criativo por ID:', criativoId)
      const result = await fetchCreativeById(criativoId)
      console.log('Resultado da busca:', result)
    } catch (error) {
      console.error('Erro ao buscar detalhes do criativo:', error)
    } finally {
      setIsLoadingCreative(false)
    }
  }, [criativoId, fetchCreativeById])

  // Buscar dados do criativo quando a página carrega
  useEffect(() => {
    fetchCreativeDetails()
  }, [fetchCreativeDetails])

  // Processar versões quando o criativo é carregado
  useEffect(() => {
    if (criativo) {
      // Processar versões do criativo
      const versoesProcessadas: Version[] = []
      
      // Adicionar versões se existirem
      if (criativo.versoes) {
        try {
          const versoesData = JSON.parse(criativo.versoes)
          if (Array.isArray(versoesData)) {
            versoesData.forEach((versao: any) => {
              if (versao.url) {
                versoesProcessadas.push({
                  url: versao.url,
                  filename: versao.filename || `Versão ${versao.version || versoesProcessadas.length + 1}`,
                  order: versao.version || versoesProcessadas.length + 1,
                  createdAt: versao.createdAt,
                  version: versao.version
                })
              }
            })
          }
        } catch (error) {
          console.error('Erro ao parsear versões:', error)
        }
      }
      
      setVersoes(versoesProcessadas)
      
      // Processar comentários
      if (criativo.comentarios) {
        try {
          const comentariosData = JSON.parse(criativo.comentarios)
          if (Array.isArray(comentariosData)) {
            setComentarios(comentariosData)
          }
        } catch (error) {
          console.error('Erro ao parsear comentários:', error)
        }
      }
      
      // Definir legenda e copy
      setLegenda(criativo.legenda || "")
      setCopy(criativo.comentario || "")
    }
  }, [criativo])

  const handleVersionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return
    
    if (!criativo) {
      toast({
        title: "Erro",
        description: "Criativo não encontrado",
        variant: "destructive",
      })
      return
    }

    setIsUploadingVersion(true)

    try {
      // Processar todos os arquivos
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Usar a API real para adicionar versão
        const updatedCreative = await addCreativeVersion(criativo.id, file)
        
        if (updatedCreative) {
          // Atualizar o estado local com os novos dados
          const novasVersoes: Version[] = []
          
          // Adicionar versões se existirem
          if (updatedCreative.versoes) {
            try {
              const versoesData = JSON.parse(updatedCreative.versoes)
              if (Array.isArray(versoesData)) {
                versoesData.forEach((versao: any) => {
                  if (versao.url) {
                    novasVersoes.push({
                      url: versao.url,
                      filename: versao.filename || `Versão ${versao.version || novasVersoes.length + 1}`,
                      order: versao.version || novasVersoes.length + 1,
                      createdAt: versao.createdAt,
                      version: versao.version
                    })
                  }
                })
              }
            } catch (error) {
              console.error('Erro ao parsear versões:', error)
            }
          }
          
          setVersoes(novasVersoes)

          // Mostrar progresso para cada arquivo
          const numeroVersao = i + 1
          toast({
            title: "Versão adicionada",
            description: `Versão ${numeroVersao} adicionada com sucesso!`,
          })
        }
      }
      
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (error) {
      console.error('Erro ao fazer upload da versão:', error)
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da versão",
        variant: "destructive",
      })
    } finally {
      setIsUploadingVersion(false)
    }
  }

  const handleShare = async () => {
    if (!criativo) return
    
    setIsSharing(true)
    
    try {
      // Simular processo de compartilhamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Compartilhado com sucesso",
        description: "O criativo foi compartilhado com o cliente",
      })
    } catch (error) {
      toast({
        title: "Erro ao compartilhar",
        description: "Ocorreu um erro ao compartilhar o criativo",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleStatusUpdate = async (newStatus: 'pendente' | 'aprovado' | 'reprovado') => {
    if (!criativo) return
    
    setIsSubmitting(true)
    
    try {
      await updateStatus(criativo.id, newStatus, comentario)
      
      if (comentario.trim()) {
        setComentario("")
      }
      
      toast({
        title: "Status atualizado",
        description: `Criativo marcado como ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async () => {
    if (!criativo || !comentario.trim()) return
    
    setIsSubmitting(true)
    
    try {
      await addComment(criativo.id, comentario)
      setComentario("")
      
      toast({
        title: "Comentário adicionado",
        description: "Comentário enviado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar comentário",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateLegenda = async () => {
    if (!criativo) return
    
    setIsEditingLegenda(false)
    
    try {
      // Aqui você implementaria a atualização da legenda
      toast({
        title: "Legenda atualizada",
        description: "Legenda salva com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar legenda",
        variant: "destructive",
      })
    }
  }

  if (isLoadingCreative) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-96 bg-muted rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!criativo) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Criativo não encontrado</h1>
          <Button onClick={() => router.push('/dashboard/criativos')}>
            Voltar aos Criativos
          </Button>
        </div>
      </div>
    )
  }

  // Preparar imagens para visualização organizada
  const imagensPrincipais = [criativo.url] // Primeira versão sempre em cima
  const imagensVersoes = versoes.map(v => v.url) // Outras versões embaixo

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard/criativos')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{criativo.titulo || criativo.fileName}</h1>
            <p className="text-muted-foreground">
              Criado por {criativo.uploadedBy.name} • {new Date(criativo.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={criativo.status === 'aprovado' ? 'default' : criativo.status === 'reprovado' ? 'destructive' : 'secondary'}>
            {criativo.status === 'aprovado' ? 'Aprovado' : criativo.status === 'reprovado' ? 'Reprovado' : 'Pendente'}
          </Badge>
          
          <Button 
            onClick={handleShare}
            disabled={isSharing}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            {isSharing ? 'Compartilhando...' : 'Compartilhar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualização Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visualização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="visualizacao">Versão Atual</TabsTrigger>
                  <TabsTrigger value="versoes">Histórico de Versões</TabsTrigger>
                </TabsList>
                
                <TabsContent value="visualizacao" className="space-y-4">
                  {/* Versão Principal (sempre em cima) */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Versão Principal</h4>
                    <Carousel
                      images={imagensPrincipais}
                      className="w-full"
                      showArrows={false}
                      showDots={false}
                      autoPlay={false}
                    />
                  </div>
                  
                  {/* Outras versões (embaixo) */}
                  {versoes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">Versões Adicionais</h4>
                      <Carousel
                        images={imagensVersoes}
                        className="w-full"
                        showArrows={versoes.length > 1}
                        showDots={versoes.length > 1}
                        autoPlay={false}
                      />
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="versoes" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Todas as Versões</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingVersion}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Versão
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Versão Principal */}
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                          <img src={criativo.url} alt="Versão Principal" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Versão Principal</p>
                          <p className="text-sm text-muted-foreground">{criativo.fileName}</p>
                        </div>
                        <Badge variant="default">Atual</Badge>
                      </div>
                      
                      {/* Versões Adicionais */}
                      {versoes.map((versao, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                            <img src={versao.url} alt={`Versão ${versao.version || index + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Versão {versao.version || index + 1}</p>
                            <p className="text-sm text-muted-foreground">{versao.filename}</p>
                            {versao.createdAt && (
                              <p className="text-xs text-muted-foreground">
                                {new Date(versao.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Badge variant="secondary">v{versao.version || index + 1}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Input para upload de versões (oculto) */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleVersionUpload}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>

        {/* Informações e Ações */}
        <div className="space-y-6">
          {/* Informações */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Título</Label>
                <p className="text-sm text-muted-foreground">{criativo.titulo || criativo.fileName}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Tipo</Label>
                <p className="text-sm text-muted-foreground">{criativo.tipo || 'Post'}</p>
              </div>
              
              {criativo.empresa && (
                <div>
                  <Label className="text-sm font-medium">Empresa</Label>
                  <p className="text-sm text-muted-foreground">{criativo.empresa.nome}</p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={criativo.status === 'aprovado' ? 'default' : criativo.status === 'reprovado' ? 'destructive' : 'secondary'}>
                    {criativo.status === 'aprovado' ? 'Aprovado' : criativo.status === 'reprovado' ? 'Reprovado' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legenda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Legenda
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingLegenda(!isEditingLegenda)}
                >
                  {isEditingLegenda ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingLegenda ? (
                <div className="space-y-2">
                  <Textarea
                    value={legenda}
                    onChange={(e) => setLegenda(e.target.value)}
                    placeholder="Digite a legenda..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleUpdateLegenda}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingLegenda(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {legenda || "Nenhuma legenda definida"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleStatusUpdate('aprovado')}
                  disabled={isSubmitting || criativo.status === 'aprovado'}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('reprovado')}
                  disabled={isSubmitting || criativo.status === 'reprovado'}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reprovar
                </Button>
              </div>
              
              <Button
                onClick={() => handleStatusUpdate('pendente')}
                disabled={isSubmitting || criativo.status === 'pendente'}
                variant="outline"
                className="w-full"
              >
                <Clock className="h-4 w-4 mr-2" />
                Marcar como Pendente
              </Button>
            </CardContent>
          </Card>

          {/* Comentários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comentários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {comentarios.length > 0 ? (
                  comentarios.map((comment, index) => (
                    <div key={index} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {comment.autor.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{comment.autor}</p>
                          <p className="text-xs text-muted-foreground">{comment.data}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.texto}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum comentário ainda
                  </p>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Adicione um comentário..."
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={isSubmitting || !comentario.trim()}
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Comentário
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
