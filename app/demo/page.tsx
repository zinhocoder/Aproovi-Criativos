"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { CheckCircle, XCircle, MessageSquare, Download, Share2, MoreHorizontal, Loader2 } from "lucide-react"
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
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function DemoPage() {
  const { toast } = useToast()
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
        data: new Date().toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      }
      setComentarios([...comentarios, novoComentario])
      setComentario("")
    }
  }

  const resetDemo = () => {
    setStatus("pendente")
    setComentarios([
      {
        id: 1,
        autor: "João Silva",
        avatar: null,
        texto: "Precisamos ajustar as cores da logo. Está muito clara e não está destacando bem no fundo.",
        data: "Hoje, 14:30",
      },
    ])
    setComentario("")
    toast({
      title: "Demonstração reiniciada",
      description: "A demonstração foi reiniciada com sucesso.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/">
              <Button variant="outline">Voltar para Home</Button>
            </Link>
            <Link href="/login">
              <Button>Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Demonstração do CCS HUB</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experimente como funciona o processo de aprovação de criativos. Adicione comentários, aprove ou reprove o
            criativo abaixo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Post Instagram - O Cliente Pede Desconto</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <span>Drive Experience</span>
                    <span>•</span>
                    <span>Hoje</span>
                    <Badge
                      className={`ml-2 ${
                        status === "aprovado"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : status === "reprovado"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }`}
                    >
                      {status === "aprovado" ? "Aprovado" : status === "reprovado" ? "Reprovado" : "Pendente"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Opções</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={resetDemo}>Reiniciar demonstração</DropdownMenuItem>
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
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  <Image
                    src="/demo-criativo.png"
                    alt="O que fazer quando o cliente pede desconto"
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
                      Este criativo está aguardando aprovação.
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
                <CardTitle>Instruções</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Como usar esta demonstração:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Adicione comentários no criativo usando o campo de comentários</li>
                    <li>Aprove ou reprove o criativo usando os botões na seção de aprovação</li>
                    <li>
                      Para reprovar, é necessário adicionar um comentário explicando o motivo (requisito do sistema)
                    </li>
                    <li>Você pode reiniciar a demonstração a qualquer momento usando o menu de opções</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Benefícios do CCS HUB:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Processo de aprovação simplificado e centralizado</li>
                    <li>Feedback detalhado com comentários específicos</li>
                    <li>Histórico completo de todas as interações</li>
                    <li>Organização por cliente e projeto</li>
                    <li>Redução no tempo de aprovação de criativos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Gostou da demonstração?</p>
              <div className="flex flex-col gap-2">
                <Link href="/register">
                  <Button className="w-full">Criar uma conta</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Saiba mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
