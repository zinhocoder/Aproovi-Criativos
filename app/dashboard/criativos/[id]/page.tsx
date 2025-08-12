"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  Download,
  Share2,
  MoreHorizontal,
  Eye,
  Clock,
  Calendar,
  Pencil,
  Loader2,
  Upload,
  Plus,
  FileImage,
  Edit3,
  Trash2,
  ImageIcon,
  History
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useCreatives } from "@/hooks/use-creatives"
import { Creative, Comment } from "@/lib/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiService } from "@/lib/api"
import { Carousel } from "@/components/ui/carousel"

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
  const [versoes, setVersoes] = useState<string[]>([]) // URLs das versões do criativo
  const [isUploadingVersion, setIsUploadingVersion] = useState(false)
  const [comentarios, setComentarios] = useState<Comment[]>([]) // Histórico de comentários
  const [isUpdatingImage, setIsUpdatingImage] = useState(false)
  const [isLoadingCreative, setIsLoadingCreative] = useState(true)
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
      // Buscar criativo específico por ID
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
    // Sempre buscar dados atualizados do criativo quando a página carrega
    fetchCreativeDetails()
  }, [criativoId]) // Remover fetchCreativeDetails da dependência para evitar loop

  // Debug: log do criativo atual
  useEffect(() => {
    if (criativo) {
      console.log('Criativo atualizado:', criativo)
      console.log('URL atual:', criativo.url)
      console.log('Comentários:', criativo.comentarios)
      console.log('Comentário antigo:', criativo.comentario)
    }
  }, [criativo])

  // Inicializar dados quando o criativo for carregado
  useEffect(() => {
    if (criativo) {
      console.log('Inicializando dados do criativo:', criativo.id)
      console.log('Criativo completo:', criativo)
      
      // Inicializar legenda
      setLegenda(criativo.legenda || "")
      setCopy("") // Remover referência a criativo.copy
      
      // Para carrosséis, mostrar todas as imagens do campo 'arquivos'
      let imagensCarrossel = [criativo.url] // Sempre incluir a imagem principal
      
      if (criativo.arquivos) {
        try {
          const arquivosData = JSON.parse(criativo.arquivos)
          if (Array.isArray(arquivosData)) {
            // Adicionar todas as URLs dos arquivos do carrossel
            imagensCarrossel = arquivosData.map(arquivo => arquivo.url)
          }
        } catch (error) {
          console.error('Erro ao parsear arquivos do carrossel:', error)
        }
      }
      
      // Adicionar versões adicionais se existirem
      if (criativo.versoes) {
        try {
          const versoesData = JSON.parse(criativo.versoes)
          if (Array.isArray(versoesData)) {
            const urlsVersoes = versoesData.map(versao => versao.url)
            imagensCarrossel = [...imagensCarrossel, ...urlsVersoes]
          }
        } catch (error) {
          console.error('Erro ao parsear versões:', error)
        }
      }
      
      setVersoes(imagensCarrossel)
      
      // Carregar histórico de comentários
      console.log('Tentando carregar comentários:', criativo.comentarios)
      console.log('Tipo de comentários:', typeof criativo.comentarios)
      
      let comentariosArray: Comment[] = []
      
      if (criativo.comentarios) {
        try {
          const comentariosData = JSON.parse(criativo.comentarios)
          console.log('Comentários parseados:', comentariosData)
          console.log('Tipo dos comentários parseados:', typeof comentariosData)
          console.log('É array?', Array.isArray(comentariosData))
          
          if (Array.isArray(comentariosData)) {
            comentariosArray = comentariosData
            console.log('Comentários carregados com sucesso:', comentariosArray)
          } else {
            console.log('Comentários não são um array:', comentariosData)
            comentariosArray = []
          }
        } catch (error) {
          console.error('Erro ao parsear comentários:', error)
          comentariosArray = []
        }
      } else {
        console.log('Nenhum comentário encontrado no criativo')
        comentariosArray = []
      }
      
      // Verificar se há comentário antigo (compatibilidade)
      if (criativo.comentario && comentariosArray.length === 0) {
        console.log('Encontrado comentário antigo:', criativo.comentario)
        comentariosArray = [{
          id: 'legacy-comment',
          texto: criativo.comentario,
          autor: criativo.uploadedBy?.name || 'Usuário',
          autorId: criativo.uploadedById || 'unknown',
          createdAt: criativo.createdAt
        }]
      }
      
      setComentarios(comentariosArray)
      console.log('Comentários finais definidos:', comentariosArray)
    }
  }, [criativo])

  // Função para formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    } catch {
      return 'Data inválida'
    }
  }

  // Função para obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'reprovado':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
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

  const handleAprovar = async () => {
    if (!criativo) return

    setIsSubmitting(true)

    try {
      await updateStatus(criativo.id, 'aprovado')

      if (comentario.trim()) {
        await addComment(criativo.id, comentario)
        setComentario("")
      }

      toast({
        title: "Criativo aprovado!",
        description: "O criativo foi aprovado com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao aprovar criativo:', error)
      // O erro já é tratado no hook useCreatives
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReprovar = async () => {
    if (!criativo) return

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
      await updateStatus(criativo.id, 'reprovado', comentario)
      setComentario("")

      toast({
        title: "Criativo reprovado",
        description: "O criativo foi reprovado.",
      })
    } catch (error) {
      console.error('Erro ao reprovar criativo:', error)
      // O erro já é tratado no hook useCreatives
    } finally {
      setIsSubmitting(false)
    }
  }

  const adicionarComentario = async () => {
    if (!criativo || !comentario.trim()) return

    setIsSubmitting(true)

    try {
      await addComment(criativo.id, comentario)
      setComentario("")

      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
      // O erro já é tratado no hook useCreatives
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddVersion = () => {
    fileInputRef.current?.click()
  }

  const handleVersionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0 || !criativo) return

    // Validar todos os arquivos
    for (const file of files) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast({
          title: "Tipo de arquivo inválido",
          description: `Arquivo ${file.name}: Por favor, selecione apenas arquivos de imagem ou vídeo.`,
          variant: "destructive",
        })
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `Arquivo ${file.name}: Por favor, selecione um arquivo menor que 50MB.`,
          variant: "destructive",
        })
        return
      }
    }

    setIsUploadingVersion(true)

    try {
      // Processar todos os arquivos
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Usar a API real para adicionar versão
        const updatedCreative = await addCreativeVersion(criativo.id, file)
        
        // Atualizar o criativo local com os novos dados
        if (updatedCreative) {
          // Atualizar o estado local com os novos dados
          setVersoes(prev => {
            const novasVersoes: string[] = []
            
            // Adicionar imagem principal atualizada (nova versão)
            novasVersoes.push(updatedCreative.url)
            
            // Adicionar arquivos do carrossel se existirem
            if (updatedCreative.arquivos) {
              try {
                const arquivosData = JSON.parse(updatedCreative.arquivos)
                if (Array.isArray(arquivosData)) {
                  arquivosData.forEach(arquivo => {
                    if (arquivo.url && arquivo.url !== updatedCreative.url) {
                      novasVersoes.push(arquivo.url)
                    }
                  })
                }
              } catch (error) {
                console.error('Erro ao parsear arquivos do carrossel:', error)
              }
            }
            
            // Adicionar versões adicionais se existirem
            if (updatedCreative.versoes) {
              try {
                const versoesData = JSON.parse(updatedCreative.versoes)
                if (Array.isArray(versoesData)) {
                  versoesData.forEach(versao => {
                    if (versao.url && versao.url !== updatedCreative.url) {
                      novasVersoes.push(versao.url)
                    }
                  })
                }
              } catch (error) {
                console.error('Erro ao parsear versões:', error)
              }
            }
            
            return novasVersoes
          })

          // Mostrar progresso para cada arquivo
          const numeroVersao = i + 1
          toast({
            title: `Versão V${numeroVersao} adicionada`,
            description: `${file.name} foi adicionado como nova versão.`,
          })
        }
      }

      if (files.length > 1) {
        toast({
          title: "Todas as versões adicionadas!",
          description: `${files.length} novas versões foram adicionadas com sucesso.`,
        })
      }
    } catch (error) {
      console.error('Erro ao adicionar versão:', error)
      // O erro já é tratado no hook addCreativeVersion
    } finally {
      setIsUploadingVersion(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeVersion = (index: number) => {
    setVersoes(prev => prev.filter((_, i) => i !== index))
    toast({
      title: "Versão removida",
      description: "A versão foi removida com sucesso.",
    })
  }

  // Deletar criativo
  const handleDeleteCreative = async () => {
    if (!criativo) return
    
    const confirmDelete = confirm(`Tem certeza que deseja remover o criativo "${criativo.titulo || criativo.fileName}"? Esta ação não pode ser desfeita.`)
    if (!confirmDelete) return

    try {
      await deleteCreative(criativo.id)
      router.push('/dashboard/criativos')
    } catch (error) {
      console.error('Erro ao deletar criativo:', error)
    }
  }

  // Alterar imagem principal
  const handleUpdateImage = () => {
    imageInputRef.current?.click()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !criativo) return

    // Validar arquivo
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem ou vídeo.",
        variant: "destructive",
      })
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, selecione um arquivo menor que 50MB.",
        variant: "destructive",
      })
      return
    }

    setIsUpdatingImage(true)

    try {
      await updateCreativeImage(criativo.id, file)
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error)
    } finally {
      setIsUpdatingImage(false)
    }
  }

  // Adicionar comentário ao histórico
  const handleAddCommentToHistory = async () => {
    if (!comentario.trim() || !criativo) return

    setIsSubmitting(true)

    try {
      console.log('Adicionando comentário ao histórico:', comentario)
      const novoComentario = await addCommentToHistory(criativo.id, comentario)
      
      if (novoComentario) {
        console.log('Novo comentário criado:', novoComentario)
        // Recarregar dados do criativo para garantir sincronização
        await fetchCreativeDetails()
        setComentario("")
      } else {
        console.log('Nenhum comentário retornado da API')
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para compartilhar link do cliente
  const handleShare = async () => {
    if (!criativo) return

    try {
      // Construir o link do painel do cliente
      const clientUrl = `${window.location.origin}/cliente/criativos/${criativo.id}`
      
      // Copiar para a área de transferência
      await navigator.clipboard.writeText(clientUrl)
      
      toast({
        title: "Link copiado!",
        description: "O link do painel do cliente foi copiado para a área de transferência.",
      })
    } catch (error) {
      console.error('Erro ao copiar link:', error)
      
      // Fallback para navegadores que não suportam clipboard API
      const clientUrl = `${window.location.origin}/cliente/criativos/${criativo.id}`
      
      // Criar elemento temporário para copiar
      const textArea = document.createElement('textarea')
      textArea.value = clientUrl
      document.body.appendChild(textArea)
      textArea.select()
      
      try {
        document.execCommand('copy')
        toast({
          title: "Link copiado!",
          description: "O link do painel do cliente foi copiado para a área de transferência.",
        })
      } catch (fallbackError) {
        console.error('Erro no fallback de cópia:', fallbackError)
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link automaticamente. Copie manualmente: " + clientUrl,
          variant: "destructive",
        })
      } finally {
        document.body.removeChild(textArea)
      }
    }
  }

  // Se não encontrou o criativo
  if (!criativo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/criativos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div>
            {isLoadingCreative ? (
              <>
                <h1 className="text-3xl font-bold tracking-tight">Carregando...</h1>
                <p className="text-muted-foreground">Buscando dados do criativo.</p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight">Criativo não encontrado</h1>
                <p className="text-muted-foreground">O criativo solicitado não foi encontrado.</p>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/criativos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
              </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{criativo.fileName}</h1>
          <p className="text-muted-foreground">
            Criado por {criativo.uploadedBy.name} em {formatDate(criativo.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusBadgeVariant(criativo.status)}>
            {getStatusIcon(criativo.status)}
            {translateStatus(criativo.status)}
          </Badge>
          
          {/* Botões de ação */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateImage}
            disabled={isUpdatingImage}
          >
            {isUpdatingImage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Alterar Imagem
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteCreative}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remover
          </Button>
          
          {/* Input oculto para alterar imagem */}
          <Input
            ref={imageInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visualizacao">Visualização</TabsTrigger>
              <TabsTrigger value="legenda">Legenda & Copy</TabsTrigger>
              <TabsTrigger value="versoes">Versões</TabsTrigger>
            </TabsList>

            <TabsContent value="visualizacao" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visualização Original</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Visualização na resolução original para manter a qualidade
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Carrossel de versões */}
                  {(() => {
                    // Preparar array de imagens para o carrossel
                    const imagens: string[] = []
                    
                    // Adicionar imagem principal
                    if (criativo?.url) {
                      imagens.push(criativo.url)
                    }
                    
                    // Adicionar versões se existirem
                    if (criativo?.versoes) {
                      try {
                        const versoesData = JSON.parse(criativo.versoes)
                        if (Array.isArray(versoesData)) {
                          versoesData.forEach((versao: any) => {
                            if (versao.url) {
                              imagens.push(versao.url)
                            }
                          })
                        }
                      } catch (error) {
                        console.error('Erro ao parsear versões:', error)
                      }
                    }
                    
                    // Adicionar arquivos de carrossel se existirem
                    if (criativo?.arquivos) {
                      try {
                        const arquivosData = JSON.parse(criativo.arquivos)
                        if (Array.isArray(arquivosData)) {
                          arquivosData.forEach((arquivo: any) => {
                            if (arquivo.url && !imagens.includes(arquivo.url)) {
                              imagens.push(arquivo.url)
                            }
                          })
                        }
                      } catch (error) {
                        console.error('Erro ao parsear arquivos:', error)
                      }
                    }
                    
                    return (
                      <Carousel
                        images={imagens}
                        className="w-full"
                        showArrows={imagens.length > 1}
                        showDots={imagens.length > 1}
                        autoPlay={false}
                      />
                    )
                  })()}
                  
                  {/* Informações das versões */}
                  {(() => {
                    const totalVersoes = 1 + 
                      (criativo?.versoes ? (() => {
                        try {
                          const versoesData = JSON.parse(criativo.versoes)
                          return Array.isArray(versoesData) ? versoesData.length : 0
                        } catch {
                          return 0
                        }
                      })() : 0) +
                      (criativo?.arquivos ? (() => {
                        try {
                          const arquivosData = JSON.parse(criativo.arquivos)
                          return Array.isArray(arquivosData) ? arquivosData.length : 0
                        } catch {
                          return 0
                        }
                      })() : 0)
                    
                    if (totalVersoes > 1) {
                      return (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Versões disponíveis ({totalVersoes})</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>• <strong>Versão Principal:</strong> {criativo?.fileName}</div>
                            {criativo?.versoes && (() => {
                              try {
                                const versoesData = JSON.parse(criativo.versoes)
                                if (Array.isArray(versoesData)) {
                                  return versoesData.map((versao: any, index: number) => (
                                    <div key={index}>
                                      • <strong>Versão {index + 1}:</strong> {versao.filename || `Versão ${index + 1}`}
                                    </div>
                                  ))
                                }
                              } catch (error) {
                                console.error('Erro ao parsear versões:', error)
                              }
                              return null
                            })()}
                            {criativo?.arquivos && (() => {
                              try {
                                const arquivosData = JSON.parse(criativo.arquivos)
                                if (Array.isArray(arquivosData) && arquivosData.length > 1) {
                                  return arquivosData.map((arquivo: any, index: number) => (
                                    <div key={index}>
                                      • <strong>Carrossel {index + 1}:</strong> {arquivo.filename || `Imagem ${index + 1}`}
                                    </div>
                                  ))
                                }
                              } catch (error) {
                                console.error('Erro ao parsear arquivos:', error)
                              }
                              return null
                            })()}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Original
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="legenda" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Legenda & Copy</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingLegenda(!isEditingLegenda)}
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    {isEditingLegenda ? 'Salvar' : 'Editar'}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Legenda Principal</label>
                    {isEditingLegenda ? (
                      <Textarea
                        value={legenda}
                        onChange={(e) => setLegenda(e.target.value)}
                        placeholder="Digite a legenda principal..."
                        className="mt-2 min-h-[100px]"
                      />
                    ) : (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          {legenda || "Nenhuma legenda definida"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Copy Alternativa</label>
                    {isEditingLegenda ? (
                      <Textarea
                        value={copy}
                        onChange={(e) => setCopy(e.target.value)}
                        placeholder="Digite uma copy alternativa..."
                        className="mt-2 min-h-[100px]"
                      />
                    ) : (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          {copy || "Nenhuma copy alternativa definida"}
                        </p>
                      </div>
                    )}
                  </div>

                  {isEditingLegenda && (
                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => setIsEditingLegenda(false)}>
                        Salvar Alterações
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingLegenda(false)}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="versoes" className="space-y-4">
              <Card>
                                 <CardHeader className="flex flex-row items-center justify-between">
                   <CardTitle>Histórico de Versões</CardTitle>
                   <div className="flex items-center gap-2">
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={handleShare}
                     >
                       <Share2 className="mr-2 h-4 w-4" />
                       Compartilhar
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={handleAddVersion}
                       disabled={isUploadingVersion}
                     >
                       {isUploadingVersion ? (
                         <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Enviando...
                         </>
                       ) : (
                         <>
                           <Plus className="mr-2 h-4 w-4" />
                           Adicionar Versão
                         </>
                       )}
                     </Button>
                   </div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleVersionUpload}
                    className="hidden"
                    multiple
                  />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Versão Principal (Original) */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="default" className="text-xs">
                          V1 - Original
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Criado em {formatDate(criativo?.createdAt || '')}
                        </span>
                      </div>
                      <div className="relative group">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-primary/20">
                          {criativo?.url && (
                            <img
                              src={criativo.url}
                              alt="Versão original"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver em Tela Cheia
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    {/* Carrossel Original (se existir) */}
                    {criativo?.arquivos && (() => {
                      try {
                        const arquivosData = JSON.parse(criativo.arquivos)
                        if (Array.isArray(arquivosData) && arquivosData.length > 1) {
                          return (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary" className="text-xs">
                                  Carrossel Original
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {arquivosData.length} imagens
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {arquivosData.map((arquivo, index) => (
                                  <div key={`carrossel-${index}`} className="relative group">
                                    <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
                                      <img
                                        src={arquivo.url}
                                        alt={`Imagem ${index + 1} do carrossel`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="absolute top-1 left-1">
                                      <Badge variant="outline" className="text-xs bg-background/80">
                                        {index + 1}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        }
                      } catch (error) {
                        console.error('Erro ao parsear arquivos do carrossel:', error)
                      }
                      return null
                    })()}

                    {/* Versões Adicionais */}
                    {criativo?.versoes && (() => {
                      try {
                        const versoesData = JSON.parse(criativo.versoes)
                        if (Array.isArray(versoesData) && versoesData.length > 0) {
                          return (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="outline" className="text-xs">
                                  Versões Adicionais
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {versoesData.length} versão(ões)
                                </span>
                              </div>
                              <div className="space-y-4">
                                {versoesData.map((versao, index) => (
                                  <div key={`version-${index}`} className="relative group">
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          V{versao.version || index + 2}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                          {versao.createdAt ? formatDate(versao.createdAt) : 'Data não disponível'}
                                        </span>
                                      </div>
                                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                              <Download className="mr-2 h-4 w-4" />
                                              Download
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                              <Eye className="mr-2 h-4 w-4" />
                                              Ver em Tela Cheia
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                              className="text-red-600"
                                              onClick={() => removeVersion(index)}
                                            >
                                              <XCircle className="mr-2 h-4 w-4" />
                                              Remover Versão
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                    <div className="aspect-square bg-muted rounded-lg overflow-hidden border mt-2">
                                      <img
                                        src={versao.url}
                                        alt={`Versão ${versao.version || index + 2}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        }
                      } catch (error) {
                        console.error('Erro ao parsear versões:', error)
                      }
                      return null
                    })()}

                    {/* Mensagem quando não há versões */}
                    {(!criativo?.versoes || (() => {
                      try {
                        const versoesData = JSON.parse(criativo.versoes || '[]')
                        return !Array.isArray(versoesData) || versoesData.length === 0
                      } catch {
                        return true
                      }
                    })()) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p className="text-sm">Nenhuma versão adicional ainda.</p>
                        <p className="text-xs mt-1">Clique em "Adicionar Versão" para criar uma nova versão deste criativo.</p>
                      </div>
                    )}


                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Histórico de comentários */}
              {comentarios.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <h4 className="font-medium">Histórico de Comentários ({comentarios.length})</h4>
                  </div>
                  
                  {comentarios.map((comentarioItem, index) => (
                    <div key={comentarioItem.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {comentarioItem.autor ? comentarioItem.autor.charAt(0).toUpperCase() : '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{comentarioItem.autor || 'Usuário'}</span>
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comentarioItem.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comentarioItem.texto}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comentário antigo (compatibilidade) */}
              {criativo.comentario && comentarios.length === 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Usuário</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(criativo.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{criativo.comentario}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Textarea
                  placeholder="Adicione um comentário ao histórico..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddCommentToHistory}
                    disabled={!comentario.trim() || isSubmitting}
                    size="sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Adicionar ao Histórico
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(criativo.status)}
                  <span className="font-medium">{translateStatus(criativo.status)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Autor</label>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{criativo.uploadedBy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{criativo.uploadedBy.name}</span>
                </div>
                  </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Criação</label>
                <p className="mt-1">{formatDate(criativo.createdAt)}</p>
                  </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome do Arquivo</label>
                <p className="mt-1 text-sm break-all">{criativo.fileName}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleAprovar}
                disabled={criativo.status === 'aprovado' || isSubmitting}
                className="w-full"
                variant="outline"
              >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aprovar
                    </>
                  )}
                </Button>

              <Button
                onClick={handleReprovar}
                disabled={criativo.status === 'reprovado' || isSubmitting}
                className="w-full"
                variant="outline"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reprovar
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
