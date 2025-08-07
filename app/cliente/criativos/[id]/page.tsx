"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Building2,
  CheckCircle, 
  XCircle, 
  Clock,
  MessageSquare,
  ImageIcon,
  Video,
  FileText,
  Play
} from 'lucide-react'
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
import { useCreatives } from '@/hooks/use-creatives'
import { Creative } from '@/lib/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'

interface Comment {
  id: string
  texto: string
  autor: string
  autorId?: string
  createdAt: string
}

export default function ClienteCriativoDetalhes() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { updateStatus, addComment } = useCreatives()
  
  const [criativo, setCriativo] = useState<Creative | null>(null)
  const [loading, setLoading] = useState(true)
  const [comentarios, setComentarios] = useState<Comment[]>([])
  const [versoes, setVersoes] = useState<any[]>([])
  const [novoComentario, setNovoComentario] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const id = params.id as string

  // Buscar dados do criativo
  useEffect(() => {
    const fetchCriativo = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        
        if (!token) {
          toast({
            title: "Erro",
            description: "Token de autenticação não encontrado",
            variant: "destructive",
          })
          router.push('/login')
          return
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://aproovi-backend-wandering-violet-6242.fly.dev/api'}/creatives/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
          setCriativo(data.data)
          
          // Carregar comentários
          if (data.data.comentarios) {
            try {
              const comentariosData = JSON.parse(data.data.comentarios)
              if (Array.isArray(comentariosData)) {
                setComentarios(comentariosData)
              }
            } catch (error) {
              console.error('Erro ao parsear comentários:', error)
            }
          }
          
          // Carregar versões
          if (data.data.versoes) {
            try {
              const versoesData = JSON.parse(data.data.versoes)
              if (Array.isArray(versoesData)) {
                setVersoes(versoesData)
              }
            } catch (error) {
              console.error('Erro ao parsear versões:', error)
            }
          }
          
          // Carregar arquivos do carrossel
          if (data.data.arquivos) {
            try {
              const arquivosData = JSON.parse(data.data.arquivos)
              if (Array.isArray(arquivosData)) {
                setVersoes(prev => [...prev, ...arquivosData])
              }
            } catch (error) {
              console.error('Erro ao parsear arquivos:', error)
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar criativo:', error)
        
        if (error instanceof Error) {
          if (error.message.includes('Unexpected token')) {
            toast({
              title: "Erro",
              description: "Erro de comunicação com o servidor. Verifique se você está logado.",
              variant: "destructive",
            })
            router.push('/login')
          } else {
            toast({
              title: "Erro",
              description: `Erro ao carregar criativo: ${error.message}`,
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Erro",
            description: "Erro desconhecido ao carregar criativo",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCriativo()
    }
  }, [id, toast])

  const handleAprovar = async () => {
    if (!criativo) return
    
    setIsSubmitting(true)
    try {
      await updateStatus(criativo.id, 'aprovado')
      
      if (novoComentario.trim()) {
        await addComment(criativo.id, novoComentario)
        setNovoComentario('')
      }
      
      toast({
        title: "Sucesso",
        description: "Criativo aprovado com sucesso!",
      })
      
      // Recarregar dados
      window.location.reload()
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao aprovar criativo",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReprovar = async () => {
    if (!criativo) return
    
    setIsSubmitting(true)
    try {
      await updateStatus(criativo.id, 'reprovado')
      
      if (novoComentario.trim()) {
        await addComment(criativo.id, novoComentario)
        setNovoComentario('')
      }
      
      toast({
        title: "Sucesso",
        description: "Criativo reprovado. Aguarde nova versão.",
      })
      
      // Recarregar dados
      window.location.reload()
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao reprovar criativo",
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
        title: "Sucesso",
        description: "Comentário adicionado com sucesso!",
      })
      
      // Recarregar dados
      window.location.reload()
      
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

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'story': return <div className="w-4 h-4 bg-pink-500 rounded-full" />
      case 'carrossel': return <ImageIcon className="h-4 w-4 text-blue-600" />
      case 'reels': return <Video className="h-4 w-4 text-purple-600" />
      case 'motion': return <Play className="h-4 w-4 text-orange-600" />
      default: return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800 border-green-200'
      case 'reprovado': return 'bg-red-100 text-red-800 border-red-200'
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case 'aprovado': return 'Aprovado'
      case 'reprovado': return 'Reprovado'
      case 'pendente': return 'Pendente'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!criativo) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Criativo não encontrado</h1>
        <Button onClick={() => router.push('/cliente')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/cliente')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {getTipoIcon(criativo.tipo || 'post')}
              {criativo.titulo || 'Sem título'}
            </h1>
            <p className="text-muted-foreground">
              Criado em {format(new Date(criativo.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(criativo.status)}>
          {translateStatus(criativo.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualização Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden dark:bg-gray-800">
                {criativo.url && (
                  <>
                    {criativo.url.includes('.mp4') ? (
                      <video
                        src={criativo.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={criativo.url}
                        alt={criativo.titulo || 'Criativo'}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </>
                )}
              </div>
              
              {/* Versões e Carrossel */}
              {versoes.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Outras versões ({versoes.length})</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {versoes.map((versao, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden dark:bg-gray-800">
                        <img
                          src={versao.url}
                          alt={`Versão ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-75"
                          onClick={() => {
                            // Atualizar imagem principal
                            setCriativo(prev => prev ? { ...prev, url: versao.url } : null)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{criativo.uploadedBy?.name || 'Usuário'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{criativo.empresa?.nome || 'Sem empresa'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(criativo.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              {criativo.legenda && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Legenda:</h4>
                  <p className="text-sm text-muted-foreground">{criativo.legenda}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações */}
          {criativo.status === 'pendente' && (
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full">
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
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAprovar} disabled={isSubmitting}>
                          Aprovar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reprovar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reprovar Criativo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja reprovar este criativo?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReprovar} disabled={isSubmitting}>
                          Reprovar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comentários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentários ({comentarios.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Lista de comentários */}
              {comentarios.length > 0 ? (
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {comentarios.map((comentario, index) => (
                    <div key={comentario.id || index} className="flex gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>
                          {comentario.autor ? comentario.autor.charAt(0).toUpperCase() : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{comentario.autor || 'Usuário'}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comentario.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{comentario.texto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">Nenhum comentário ainda.</p>
              )}

              {/* Adicionar comentário */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Adicione um comentário..."
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!novoComentario.trim() || isSubmitting}
                  size="sm"
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Adicionar Comentário
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}