"use client"

import { useState, useCallback, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Eye,
  History,
  Star
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCreatives } from "@/hooks/use-creatives"
import { Carousel } from "@/components/ui/carousel"
import { Creative } from "@/lib/api"

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

export default function ClienteCriativoDetalhes() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { updateStatus, addComment, fetchCreativeById } = useCreatives()
  
  const [criativo, setCriativo] = useState<Creative | null>(null)
  const [loading, setLoading] = useState(true)
  const [comentarios, setComentarios] = useState<Comment[]>([])
  const [versoes, setVersoes] = useState<Version[]>([])
  const [novoComentario, setNovoComentario] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("visualizacao")
  
  const id = params.id as string

  // Função para buscar detalhes do criativo
  const fetchCreativeDetails = useCallback(async () => {
    if (!id) return
    
    try {
      setLoading(true)
      const response = await fetchCreativeById(id)
      if (response) {
        setCriativo(response)
        
        // Processar versões
        const versoesProcessadas: Version[] = []
        if (response.versoes) {
          try {
            const versoesData = JSON.parse(response.versoes)
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
        if (response.comentarios) {
          try {
            const comentariosData = JSON.parse(response.comentarios)
            if (Array.isArray(comentariosData)) {
              setComentarios(comentariosData)
            }
          } catch (error) {
            console.error('Erro ao parsear comentários:', error)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar criativo:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar criativo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [id, fetchCreativeById, toast])

  useEffect(() => {
    fetchCreativeDetails()
  }, [fetchCreativeDetails])

  const handleAprovar = async () => {
    if (!criativo) return
    
    setIsSubmitting(true)
    
    try {
      await updateStatus(criativo.id, 'aprovado', novoComentario)
      
      if (novoComentario.trim()) {
        setNovoComentario('')
      }
      
      toast({
        title: "Criativo aprovado!",
        description: "O criativo foi aprovado com sucesso.",
      })
      
      // Recarregar dados
      await fetchCreativeDetails()
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        description: "Ocorreu um erro ao tentar aprovar o criativo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReprovar = async () => {
    if (!criativo) return
    
    if (!novoComentario.trim()) {
      toast({
        title: "Comentário obrigatório",
        description: "É obrigatório escrever um comentário ao reprovar um criativo",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await updateStatus(criativo.id, 'reprovado', novoComentario)
      setNovoComentario('')
      
      toast({
        title: "Criativo reprovado",
        description: "O criativo foi reprovado.",
      })
      
      // Recarregar dados
      await fetchCreativeDetails()
    } catch (error) {
      toast({
        title: "Erro ao reprovar",
        description: "Ocorreu um erro ao tentar reprovar o criativo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async () => {
    if (!criativo || !novoComentario.trim()) return
    
    setIsSubmitting(true)
    
    try {
      await addComment(criativo.id, novoComentario)
      setNovoComentario('')
      
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso.",
      })
      
      // Recarregar dados
      await fetchCreativeDetails()
    } catch (error) {
      toast({
        title: "Erro ao adicionar comentário",
        description: "Ocorreu um erro ao tentar adicionar o comentário.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
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
          <Button onClick={() => router.push('/cliente')}>
            Voltar ao Painel
          </Button>
        </div>
      </div>
    )
  }

  // Preparar imagens para visualização organizada
  const imagensPrincipais = [criativo.url] // Primeira versão sempre em cima
  const imagensVersoes = versoes.map(v => v.url) // Outras versões embaixo
  const totalVersoes = 1 + versoes.length

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/cliente')}>
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
                  
                  {/* Informações das versões */}
                  {totalVersoes > 1 && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Versões disponíveis ({totalVersoes})</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• <strong>Versão Principal:</strong> {criativo.fileName}</div>
                        {versoes.map((versao, index) => (
                          <div key={index}>
                            • <strong>Versão {versao.version || index + 1}:</strong> {versao.filename}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="versoes" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      <h4 className="font-medium">Todas as Versões</h4>
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
                <label className="text-sm font-medium text-muted-foreground">Título</label>
                <p className="text-sm">{criativo.titulo || criativo.fileName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <p className="text-sm">{criativo.tipo || 'Post'}</p>
              </div>
              
              {criativo.empresa && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                  <p className="text-sm">{criativo.empresa.nome}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={criativo.status === 'aprovado' ? 'default' : criativo.status === 'reprovado' ? 'destructive' : 'secondary'}>
                    {criativo.status === 'aprovado' ? 'Aprovado' : criativo.status === 'reprovado' ? 'Reprovado' : 'Pendente'}
                  </Badge>
                </div>
              </div>
              
              {criativo.legenda && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Legenda</label>
                  <p className="text-sm">{criativo.legenda}</p>
                </div>
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
                  onClick={handleAprovar}
                  disabled={isSubmitting || criativo.status === 'aprovado'}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
                <Button
                  onClick={handleReprovar}
                  disabled={isSubmitting || criativo.status === 'reprovado'}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reprovar
                </Button>
              </div>
              
              <Button
                onClick={() => updateStatus(criativo.id, 'pendente')}
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
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  placeholder="Adicione um comentário..."
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={isSubmitting || !novoComentario.trim()}
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