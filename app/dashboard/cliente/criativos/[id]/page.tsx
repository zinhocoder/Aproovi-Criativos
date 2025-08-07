"use client"

import { useState } from "react"
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
  Loader2,
  Calendar,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function ClienteCriativoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const criativoId = params.id
  const [status, setStatus] = useState<"pendente" | "aprovado" | "reprovado">("pendente")
  const [comentario, setComentario] = useState("")
  const [comentarios, setComentarios] = useState([
    {
      id: 1,
      autor: "João Silva",
      avatar: null,
      texto: "Precisamos ajustar as cores da logo. Está muito clara e não está destacando bem no fundo.",
      data: "Hoje, 14:30",
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dados de exemplo - em produção, viriam de um banco de dados
  const criativo = {
    id: criativoId,
    titulo: criativoId === "1" ? "Post Instagram - O Cliente Pede Desconto" : "Criativo " + criativoId,
    agencia: "CCStudios",
    status: status,
    data: "Hoje",
    dataPublicacao: "28/04/2024",
    imagem: criativoId === "1" ? "/demo-criativo.png" : "/placeholder.svg?height=600&width=600",
    descricao: "Post para redes sociais sobre como lidar com clientes que pedem desconto.",
    plataforma: "Instagram",
    tipo: "Post",
    dimensoes: "1080x1080px",
    autor: "Ana Pereira",
    versao: "1.0",
  }

  const handleAprovar = async () => {
    setIsSubmitting(true)

    try {
      // Simular um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus("aprovado")

      if (comentario.trim()) {
        adicionarComentario()
      }

      toast({
        title: "Criativo aprovado",
        description: "O criativo foi aprovado com sucesso.",
      })
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
    setIsSubmitting(true)

    try {
      // Simular um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (!comentario.trim()) {
        toast({
          title: "Comentário obrigatório",
          description: "Por favor, adicione um comentário explicando o motivo da reprovação.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      setStatus("reprovado")
      adicionarComentario()

      toast({
        title: "Criativo reprovado",
        description: "O criativo foi reprovado com sucesso.",
      })
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

  const adicionarComentario = () => {
    if (comentario.trim()) {
      const novoComentario = {
        id: comentarios.length + 1,
        autor: "Você",
        avatar: null,
        texto: comentario,
        data: new Date().toLocaleString("pt-BR"),
      }
      setComentarios([...comentarios, novoComentario])
      setComentario("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/cliente">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{criativo.titulo}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{criativo.agencia}</span>
              <span>•</span>
              <span>{criativo.data}</span>
              <Badge
                className={`ml-2 ${
                  criativo.status === "aprovado"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : criativo.status === "reprovado"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }`}
              >
                {criativo.status === "aprovado"
                  ? "Aprovado"
                  : criativo.status === "reprovado"
                    ? "Reprovado"
                    : "Pendente"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="mr-2 h-4 w-4" />
                Ações
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Baixar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-hidden rounded-lg border">
                <Image
                  src={criativo.imagem || "/placeholder.svg"}
                  alt={criativo.titulo}
                  width={600}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comentarios.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum comentário ainda.</p>
                ) : (
                  comentarios.map((comentario) => (
                    <div key={comentario.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{comentario.autor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{comentario.autor}</p>
                          <p className="text-xs text-muted-foreground">{comentario.data}</p>
                        </div>
                        <p className="text-sm">{comentario.texto}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full">
                <Textarea
                  placeholder="Adicione um comentário..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="min-h-0 flex-1 mr-2"
                  disabled={isSubmitting}
                />
                <Button onClick={adicionarComentario} disabled={!comentario.trim() || isSubmitting}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Comentar
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {status === "pendente" ? (
                  <div className="text-center text-muted-foreground py-2">
                    Este criativo está aguardando sua aprovação.
                  </div>
                ) : status === "aprovado" ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 py-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Aprovado</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-red-600 py-2">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Reprovado</span>
                  </div>
                )}

                {status === "pendente" && (
                  <Textarea
                    placeholder="Adicione um comentário sobre este criativo..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows={4}
                    disabled={isSubmitting}
                  />
                )}
              </div>
            </CardContent>
            {status === "pendente" && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleReprovar} className="w-full mr-2" disabled={isSubmitting}>
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
                <Button onClick={handleAprovar} className="w-full" disabled={isSubmitting}>
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
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                  <p className="mt-1">{criativo.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Plataforma</p>
                    <p className="mt-1">{criativo.plataforma}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                    <p className="mt-1">{criativo.tipo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dimensões</p>
                    <p className="mt-1">{criativo.dimensoes}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Versão</p>
                    <p className="mt-1">{criativo.versao}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Autor</p>
                    <p className="mt-1">{criativo.autor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Publicação</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {criativo.dataPublicacao}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
