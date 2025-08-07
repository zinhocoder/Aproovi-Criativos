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
import { useState, useEffect, useRef } from "react"
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
    addCommentToHistory 
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Encontrar o criativo pelo ID
  const criativo = creatives.find(c => c.id === criativoId)

  // Inicializar dados quando o criativo for carregado
  useEffect(() => {
    if (criativo) {
      // Inicializar legenda e copy
      setLegenda(criativo.legenda || "")
      setCopy(criativo.copy || "")
      
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

    setIsSubmitting(true)

    try {
      await updateStatus(criativo.id, 'reprovado')

      if (comentario.trim()) {
        await addComment(criativo.id, comentario)
        setComentario("")
      }

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
        await addCreativeVersion(criativo.id, file)
        
        // Atualizar a lista local de versões também
        const reader = new FileReader()
        reader.onloadend = () => {
          setVersoes(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)

        // Mostrar progresso para cada arquivo
        const numeroVersao = versoes.length + i + 1 // Calcular número da versão baseado no total atual
        toast({
          title: `Versão V${numeroVersao} adicionada`,
          description: `${file.name} foi adicionado como nova versão.`,
        })
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
      const novoComentario = await addCommentToHistory(criativo.id, comentario)
      
      if (novoComentario) {
        // Adicionar à lista local
        setComentarios(prev => [...prev, novoComentario])
        setComentario("")
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
    } finally {
      setIsSubmitting(false)
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
            <h1 className="text-3xl font-bold tracking-tight">Criativo não encontrado</h1>
            <p className="text-muted-foreground">O criativo solicitado não foi encontrado.</p>
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
                  {/* Verificar se é carrossel para mostrar todas as imagens */}
                  {criativo?.arquivos && (() => {
                    try {
                      const arquivosData = JSON.parse(criativo.arquivos)
                      if (Array.isArray(arquivosData) && arquivosData.length > 1) {
                        return (
                          <div className="space-y-4">
                            <p className="text-sm font-medium">Carrossel ({arquivosData.length} imagens)</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {arquivosData.map((arquivo, index) => (
                                <div key={`view-${criativo.id}-${arquivo.filename}-${index}`} className="relative bg-muted rounded-lg overflow-hidden">
                                  <img
                                    src={arquivo.url}
                                    alt={`${criativo.fileName} - Imagem ${index + 1}`}
                                    className="w-full h-auto object-contain max-h-[400px]"
                                    style={{ imageRendering: 'crisp-edges' }}
                                  />
                                  <div className="absolute top-2 left-2">
                                    <Badge variant="default" className="text-xs">
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
                  
                  {/* Fallback para criativo único ou se não conseguir parsear */}
                  {(!criativo?.arquivos || (() => {
                    try {
                      const arquivosData = JSON.parse(criativo.arquivos || '[]')
                      return !Array.isArray(arquivosData) || arquivosData.length <= 1
                    } catch {
                      return true
                    }
                  })()) && (
                    <div className="relative bg-muted rounded-lg overflow-hidden">
                      <img
                        src={criativo?.url}
                        alt={criativo?.fileName}
                        className="w-full h-auto object-contain max-h-[600px]"
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Original
                  </Button>
                  <Button variant="outline" size="sm">
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
                  <CardTitle>Versões do Criativo</CardTitle>
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
                        Nova Versão
                      </>
                    )}
                  </Button>
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
                  <div className="space-y-4">
                    {/* Mostrar arquivos do carrossel original se existirem */}
                    {criativo?.arquivos && (() => {
                      try {
                        const arquivosData = JSON.parse(criativo.arquivos)
                        if (Array.isArray(arquivosData) && arquivosData.length > 1) {
                          return (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Carrossel Original ({arquivosData.length} imagens)</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {arquivosData.map((arquivo, index) => (
                                  <div key={`original-${criativo.id}-${arquivo.filename}-${index}`} className="relative group">
                                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                      <img
                                        src={arquivo.url}
                                        alt={`Imagem ${index + 1} do carrossel`}
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                      />
                                    </div>
                                    <div className="absolute top-1 left-1">
                                      <Badge variant="default" className="text-xs">
                                        {index + 1}
                                      </Badge>
        </div>
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                                          <Button variant="secondary" size="sm" className="h-6 w-6 p-0">
                                            <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                                            Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver Original
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
                                ))}
                </div>
                      </div>
                          )
                        }
                      } catch (error) {
                        console.error('Erro ao parsear arquivos:', error)
                      }
                      return null
                    })()}

                    {/* Mostrar versões adicionais se existirem */}
                    {criativo?.versoes && (() => {
                      try {
                        const versoesData = JSON.parse(criativo.versoes)
                        if (Array.isArray(versoesData) && versoesData.length > 0) {
                          return (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Versões Adicionais ({versoesData.length})</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {versoesData.map((versao, index) => (
                                  <div key={`version-${index}`} className="relative group">
                                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                      <img
                                        src={versao.url}
                                        alt={`Versão adicional ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                        </div>
                                    <div className="absolute top-2 left-2">
                                      <Badge variant="outline" className="text-xs">
                                        V{index + 1}
                                      </Badge>
                        </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="secondary" size="sm">
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
                                            Ver Original
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem 
                                            className="text-red-600"
                                            onClick={() => removeVersion(index)}
                                          >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Remover
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
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

                    {/* Fallback para criativos únicos */}
                    {(!criativo?.arquivos || JSON.parse(criativo.arquivos || '[]').length <= 1) && 
                     (!criativo?.versoes || JSON.parse(criativo.versoes || '[]').length === 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                            <img
                              src={criativo?.url}
                              alt="Criativo original"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge variant="default">
                              Original
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botão para adicionar nova versão */}
                    <div 
                      className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                      onClick={handleAddVersion}
                    >
                      <div className="text-center">
                        {isUploadingVersion ? (
                          <>
                            <Loader2 className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-spin" />
                            <p className="text-sm text-muted-foreground">
                              Enviando...
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Adicionar nova(s) versão(ões)
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Múltiplos arquivos permitidos
                            </p>
                          </>
                        )}
                        </div>
                      </div>
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
