"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, Filter, Calendar, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function ClienteDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  // Verificar se o usuário é cliente
  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "client") {
      // Redirecionar para o dashboard padrão se não for cliente
      router.push("/dashboard")
    }
  }, [router])

  // Dados de exemplo - em produção, viriam de um banco de dados
  const criativos = [
    {
      id: 1,
      titulo: "Post Instagram - O Cliente Pede Desconto",
      status: "pendente",
      data: "Hoje",
      agencia: "CCStudios",
      imagem: "/demo-criativo.png",
      comentarios: 1,
      autor: "Ana Pereira",
    },
    {
      id: 2,
      titulo: "Story Facebook - Promoção de Verão",
      status: "pendente",
      data: "Ontem",
      agencia: "CCStudios",
      imagem: "/placeholder.svg?height=300&width=300",
      comentarios: 0,
      autor: "Carlos Santos",
    },
    {
      id: 3,
      titulo: "Carrossel LinkedIn - Novos Produtos",
      status: "pendente",
      data: "23/04/2024",
      agencia: "CCStudios",
      imagem: "/placeholder.svg?height=300&width=300",
      comentarios: 2,
      autor: "Ana Pereira",
    },
    {
      id: 4,
      titulo: "Banner Site - Institucional",
      status: "aprovado",
      data: "20/04/2024",
      agencia: "CCStudios",
      imagem: "/placeholder.svg?height=300&width=300",
      comentarios: 3,
      autor: "Carlos Santos",
      dataAprovacao: "21/04/2024",
    },
    {
      id: 5,
      titulo: "Post Twitter - Evento",
      status: "reprovado",
      data: "18/04/2024",
      agencia: "CCStudios",
      imagem: "/placeholder.svg?height=300&width=300",
      comentarios: 4,
      autor: "Ana Pereira",
      dataReprovacao: "19/04/2024",
    },
    {
      id: 6,
      titulo: "Vídeo Instagram - Tutorial",
      status: "aprovado",
      data: "15/04/2024",
      agencia: "CCStudios",
      imagem: "/placeholder.svg?height=300&width=300",
      comentarios: 2,
      autor: "Carlos Santos",
      dataAprovacao: "16/04/2024",
    },
  ]

  // Filtrar criativos com base na pesquisa
  const filteredCriativos = criativos.filter((criativo) =>
    criativo.titulo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleQuickApprove = (id: number, action: "aprovar" | "reprovar") => {
    toast({
      title: action === "aprovar" ? "Criativo aprovado" : "Criativo reprovado",
      description: `O criativo foi ${action === "aprovar" ? "aprovado" : "reprovado"} com sucesso.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seus Criativos</h1>
          <p className="text-muted-foreground">
            Visualize, aprove ou solicite ajustes nos criativos enviados pela sua agência.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar criativos..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Todos os tipos</DropdownMenuItem>
              <DropdownMenuItem>Posts</DropdownMenuItem>
              <DropdownMenuItem>Stories</DropdownMenuItem>
              <DropdownMenuItem>Carrosséis</DropdownMenuItem>
              <DropdownMenuItem>Banners</DropdownMenuItem>
              <DropdownMenuItem>Vídeos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por data</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Todos</DropdownMenuItem>
              <DropdownMenuItem>Hoje</DropdownMenuItem>
              <DropdownMenuItem>Esta semana</DropdownMenuItem>
              <DropdownMenuItem>Este mês</DropdownMenuItem>
              <DropdownMenuItem>Personalizado...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="pendentes" className="w-full">
        <TabsList>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="aprovados">Aprovados</TabsTrigger>
          <TabsTrigger value="reprovados">Reprovados</TabsTrigger>
          <TabsTrigger value="todos">Todos</TabsTrigger>
        </TabsList>

        {/* Tab de Pendentes */}
        <TabsContent value="pendentes" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCriativos
              .filter((c) => c.status === "pendente")
              .map((criativo) => (
                <Card key={criativo.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={criativo.imagem || "/placeholder.svg"}
                      alt={criativo.titulo}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-medium truncate">{criativo.titulo}</h3>
                      <div className="flex justify-between mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarFallback>{criativo.autor.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {criativo.autor}
                        </div>
                        <div className="text-xs text-muted-foreground">{criativo.data}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{criativo.agencia}</div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleQuickApprove(criativo.id, "reprovar")}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reprovar
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleQuickApprove(criativo.id, "aprovar")}>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Aprovar
                      </Button>
                    </div>
                    <Link href={`/dashboard/cliente/criativos/${criativo.id}`}>
                      <Button variant="ghost" size="sm" className="w-full mt-2">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Ver detalhes
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            {filteredCriativos.filter((c) => c.status === "pendente").length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Não há criativos pendentes de aprovação.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab de Aprovados */}
        <TabsContent value="aprovados" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCriativos
              .filter((c) => c.status === "aprovado")
              .map((criativo) => (
                <Card key={criativo.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={criativo.imagem || "/placeholder.svg"}
                      alt={criativo.titulo}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aprovado</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{criativo.titulo}</h3>
                    <div className="flex justify-between mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarFallback>{criativo.autor.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {criativo.autor}
                      </div>
                      <div className="text-xs text-muted-foreground">{criativo.data}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{criativo.agencia}</div>
                    <div className="text-xs text-muted-foreground mt-2">Aprovado em: {criativo.dataAprovacao}</div>
                    <Link href={`/dashboard/cliente/criativos/${criativo.id}`}>
                      <Button variant="ghost" size="sm" className="w-full mt-4">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Ver detalhes
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            {filteredCriativos.filter((c) => c.status === "aprovado").length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Não há criativos aprovados.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab de Reprovados */}
        <TabsContent value="reprovados" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCriativos
              .filter((c) => c.status === "reprovado")
              .map((criativo) => (
                <Card key={criativo.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={criativo.imagem || "/placeholder.svg"}
                      alt={criativo.titulo}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Reprovado</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{criativo.titulo}</h3>
                    <div className="flex justify-between mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarFallback>{criativo.autor.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {criativo.autor}
                      </div>
                      <div className="text-xs text-muted-foreground">{criativo.data}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{criativo.agencia}</div>
                    <div className="text-xs text-muted-foreground mt-2">Reprovado em: {criativo.dataReprovacao}</div>
                    <Link href={`/dashboard/cliente/criativos/${criativo.id}`}>
                      <Button variant="ghost" size="sm" className="w-full mt-4">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Ver detalhes
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            {filteredCriativos.filter((c) => c.status === "reprovado").length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Não há criativos reprovados.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab de Todos */}
        <TabsContent value="todos" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCriativos.map((criativo) => (
              <Card key={criativo.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={criativo.imagem || "/placeholder.svg"}
                    alt={criativo.titulo}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={`${
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
                <CardContent className="p-4">
                  <h3 className="font-medium truncate">{criativo.titulo}</h3>
                  <div className="flex justify-between mt-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarFallback>{criativo.autor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {criativo.autor}
                    </div>
                    <div className="text-xs text-muted-foreground">{criativo.data}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{criativo.agencia}</div>

                  {criativo.status === "pendente" ? (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleQuickApprove(criativo.id, "reprovar")}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reprovar
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleQuickApprove(criativo.id, "aprovar")}>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Aprovar
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground mt-2">
                      {criativo.status === "aprovado"
                        ? `Aprovado em: ${criativo.dataAprovacao}`
                        : `Reprovado em: ${criativo.dataReprovacao}`}
                    </div>
                  )}

                  <Link href={`/dashboard/cliente/criativos/${criativo.id}`}>
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Ver detalhes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {filteredCriativos.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Nenhum criativo encontrado.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
