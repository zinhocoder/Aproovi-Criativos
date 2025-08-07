"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ImagePlus, Search, Filter, Calendar, Grid3X3, List, ArrowUpDown, CheckCircle, XCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCreatives } from "@/hooks/use-creatives"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const tiposCreativos = [
  { value: "todos", label: "Todos os tipos" },
  { value: "post", label: "Posts" },
  { value: "story", label: "Stories" },
  { value: "carrossel", label: "Carrosséis" },
  { value: "reels", label: "Reels" },
  { value: "motion", label: "Motion Graphics" },
  { value: "banner", label: "Banners" },
  { value: "video", label: "Vídeos" },
  { value: "outro", label: "Outros" },
]

const filtrosData = [
  { value: "todos", label: "Todos" },
  { value: "hoje", label: "Hoje" },
  { value: "semana", label: "Esta semana" },
  { value: "mes", label: "Este mês" },
]

const opcoesOrdenacao = [
  { value: "recentes", label: "Mais recentes" },
  { value: "antigos", label: "Mais antigos" },
  { value: "nome-az", label: "Nome (A-Z)" },
  { value: "nome-za", label: "Nome (Z-A)" },
]

export default function CriativosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")
  const [dataFiltro, setDataFiltro] = useState("todos")
  const [ordenacao, setOrdenacao] = useState("recentes")
  const { creatives, loading, error, updateStatus } = useCreatives()

  // Função para filtrar por data
  const filtrarPorData = (creative: any, filtro: string) => {
    if (filtro === "todos") return true
    
    const hoje = new Date()
    const dataCreative = new Date(creative.createdAt)
    
    switch (filtro) {
      case "hoje":
        return dataCreative.toDateString() === hoje.toDateString()
      case "semana":
        const inicioSemana = new Date(hoje)
        inicioSemana.setDate(hoje.getDate() - 7)
        return dataCreative >= inicioSemana
      case "mes":
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
        return dataCreative >= inicioMes
      default:
        return true
    }
  }

  // Filtrar e ordenar criativos
  const filteredCreatives = creatives
    .filter(creative => 
      // Filtro de busca
      (creative.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       creative.uploadedBy.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      // Filtro de tipo (assumindo que temos essa informação no futuro)
      (tipoFiltro === "todos" || true) && // Por enquanto aceita todos os tipos
      // Filtro de data
      filtrarPorData(creative, dataFiltro)
    )
    .sort((a, b) => {
      switch (ordenacao) {
        case "recentes":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "antigos":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "nome-az":
          return a.fileName.localeCompare(b.fileName)
        case "nome-za":
          return b.fileName.localeCompare(a.fileName)
        default:
          return 0
      }
    })

  // Função para formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return 'Data inválida'
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Criativos</h1>
            <p className="text-muted-foreground">Carregando criativos...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Criativos</h1>
            <p className="text-muted-foreground text-red-600">Erro ao carregar criativos: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Criativos</h1>
          <p className="text-muted-foreground">
            {filteredCreatives.length} criativo{filteredCreatives.length !== 1 ? 's' : ''} encontrado{filteredCreatives.length !== 1 ? 's' : ''}
          </p>
          {(searchTerm || tipoFiltro !== "todos" || dataFiltro !== "todos" || ordenacao !== "recentes") && (
            <div className="flex flex-wrap gap-2 mt-2">
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Busca: "{searchTerm}"
                </Badge>
              )}
              {tipoFiltro !== "todos" && (
                <Badge variant="secondary" className="text-xs">
                  Tipo: {tiposCreativos.find(t => t.value === tipoFiltro)?.label}
                </Badge>
              )}
              {dataFiltro !== "todos" && (
                <Badge variant="secondary" className="text-xs">
                  Data: {filtrosData.find(f => f.value === dataFiltro)?.label}
                </Badge>
              )}
              {ordenacao !== "recentes" && (
                <Badge variant="secondary" className="text-xs">
                  Ordem: {opcoesOrdenacao.find(o => o.value === ordenacao)?.label}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  setSearchTerm("")
                  setTipoFiltro("todos")
                  setDataFiltro("todos")
                  setOrdenacao("recentes")
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/criativos/novo">
            <Button>
              <ImagePlus className="mr-2 h-4 w-4" />
              Novo Criativo
            </Button>
          </Link>
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
                {tiposCreativos.find(t => t.value === tipoFiltro)?.label || "Filtrar"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por tipo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tiposCreativos.map((tipo) => (
                <DropdownMenuItem
                  key={tipo.value}
                  onClick={() => setTipoFiltro(tipo.value)}
                  className={tipoFiltro === tipo.value ? "bg-accent" : ""}
                >
                  {tipo.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                {filtrosData.find(f => f.value === dataFiltro)?.label || "Data"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por data</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filtrosData.map((filtro) => (
                <DropdownMenuItem
                  key={filtro.value}
                  onClick={() => setDataFiltro(filtro.value)}
                  className={dataFiltro === filtro.value ? "bg-accent" : ""}
                >
                  {filtro.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {opcoesOrdenacao.find(o => o.value === ordenacao)?.label || "Ordenar"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {opcoesOrdenacao.map((opcao) => (
                <DropdownMenuItem
                  key={opcao.value}
                  onClick={() => setOrdenacao(opcao.value)}
                  className={ordenacao === opcao.value ? "bg-accent" : ""}
                >
                  {opcao.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList>
          <TabsTrigger value="todos">Todos ({filteredCreatives.length})</TabsTrigger>
          <TabsTrigger value="pendentes">
            Pendentes ({filteredCreatives.filter(c => c.status === 'pendente').length})
          </TabsTrigger>
          <TabsTrigger value="aprovados">
            Aprovados ({filteredCreatives.filter(c => c.status === 'aprovado').length})
          </TabsTrigger>
          <TabsTrigger value="reprovados">
            Reprovados ({filteredCreatives.filter(c => c.status === 'reprovado').length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="mt-4">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCreatives.map((creative) => (
                <Link key={creative.id} href={`/dashboard/criativos/${creative.id}`}>
                  <Card className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer h-full">
                    <div className="aspect-square relative">
                      <img
                        src={creative.url || "/placeholder.svg"}
                        alt={creative.fileName}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusBadgeVariant(creative.status)}>
                          {translateStatus(creative.status)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{creative.fileName}</h3>
                      <div className="flex justify-between mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarFallback>{creative.uploadedBy.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {creative.uploadedBy.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(creative.createdAt)}
                        </div>
                      </div>
                      {creative.comentario && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            💬 {creative.comentario.substring(0, 50)}
                            {creative.comentario.length > 50 && '...'}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCreatives.map((creative) => (
                <Link key={creative.id} href={`/dashboard/criativos/${creative.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative">
                          <img
                            src={creative.url || "/placeholder.svg"}
                            alt={creative.fileName}
                            className="object-cover w-full h-full rounded"
                          />
                          <div className="absolute -top-1 -right-1">
                            {getStatusIcon(creative.status)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{creative.fileName}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{creative.uploadedBy.name}</span>
                            <span>•</span>
                            <span>{formatDate(creative.createdAt)}</span>
                            {creative.comentario && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  💬 {creative.comentario.substring(0, 30)}
                                  {creative.comentario.length > 30 && '...'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusBadgeVariant(creative.status)}>
                          {translateStatus(creative.status)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pendentes" className="mt-4">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCreatives.filter(c => c.status === 'pendente').map((creative) => (
                <Link key={creative.id} href={`/dashboard/criativos/${creative.id}`}>
                  <Card className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer h-full">
                    <div className="aspect-square relative">
                      <img
                        src={creative.url || "/placeholder.svg"}
                        alt={creative.fileName}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusBadgeVariant(creative.status)}>
                          {translateStatus(creative.status)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{creative.fileName}</h3>
                      <div className="flex justify-between mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarFallback>{creative.uploadedBy.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {creative.uploadedBy.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(creative.createdAt)}
                        </div>
                      </div>
                      {creative.comentario && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            💬 {creative.comentario.substring(0, 50)}
                            {creative.comentario.length > 50 && '...'}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCreatives.filter(c => c.status === 'pendente').map((creative) => (
                <Link key={creative.id} href={`/dashboard/criativos/${creative.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative">
                          <img
                            src={creative.url || "/placeholder.svg"}
                            alt={creative.fileName}
                            className="object-cover w-full h-full rounded"
                          />
                          <div className="absolute -top-1 -right-1">
                            {getStatusIcon(creative.status)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{creative.fileName}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{creative.uploadedBy.name}</span>
                            <span>•</span>
                            <span>{formatDate(creative.createdAt)}</span>
                            {creative.comentario && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  💬 {creative.comentario.substring(0, 30)}
                                  {creative.comentario.length > 30 && '...'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusBadgeVariant(creative.status)}>
                          {translateStatus(creative.status)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="aprovados" className="mt-4">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCreatives.filter(c => c.status === 'aprovado').map((creative) => (
                <Link key={creative.id} href={`/dashboard/criativos/${creative.id}`}>
                  <Card className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer h-full">
                    <div className="aspect-square relative">
                      <img
                        src={creative.url || "/placeholder.svg"}
                        alt={creative.fileName}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusBadgeVariant(creative.status)}>
                          {translateStatus(creative.status)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{creative.fileName}</h3>
                      <div className="flex justify-between mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarFallback>{creative.uploadedBy.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {creative.uploadedBy.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(creative.createdAt)}
                        </div>
                      </div>
                      {creative.comentario && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            💬 {creative.comentario.substring(0, 50)}
                            {creative.comentario.length > 50 && '...'}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCreatives.filter(c => c.status === 'aprovado').map((creative) => (
                <Link key={creative.id} href={`/dashboard/criativos/${creative.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative">
                          <img
                            src={creative.url || "/placeholder.svg"}
                            alt={creative.fileName}
                            className="object-cover w-full h-full rounded"
                          />
                          <div className="absolute -top-1 -right-1">
                            {getStatusIcon(creative.status)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{creative.fileName}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{creative.uploadedBy.name}</span>
                            <span>•</span>
                            <span>{formatDate(creative.createdAt)}</span>
                            {creative.comentario && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  💬 {creative.comentario.substring(0, 30)}
                                  {creative.comentario.length > 30 && '...'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusBadgeVariant(creative.status)}>
                          {translateStatus(creative.status)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reprovados" className="mt-4">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCreatives.filter(c => c.status === 'reprovado').map((creative) => (
                <Link key={creative.id} href={`/dashboard/criativos/${creative.id}`}>
                  <Card className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer h-full">
                    <div className="aspect-square relative">
                      <img
                        src={creative.url || "/placeholder.svg"}
                        alt={creative.fileName}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusBadgeVariant(creative.status)}>
                          {translateStatus(creative.status)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{creative.fileName}</h3>
                      <div className="flex justify-between mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarFallback>{creative.uploadedBy.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {creative.uploadedBy.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(creative.createdAt)}
                        </div>
                      </div>
                      {creative.comentario && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            💬 {creative.comentario.substring(0, 50)}
                            {creative.comentario.length > 50 && '...'}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCreatives.filter(c => c.status === 'reprovado').map((creative) => (
                <Link key={creative.id} href={`/dashboard/criativos/${creative.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative">
                          <img
                            src={creative.url || "/placeholder.svg"}
                            alt={creative.fileName}
                            className="object-cover w-full h-full rounded"
                          />
                          <div className="absolute -top-1 -right-1">
                            {getStatusIcon(creative.status)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{creative.fileName}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{creative.uploadedBy.name}</span>
                            <span>•</span>
                            <span>{formatDate(creative.createdAt)}</span>
                            {creative.comentario && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  💬 {creative.comentario.substring(0, 30)}
                                  {creative.comentario.length > 30 && '...'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusBadgeVariant(creative.status)}>
                          {translateStatus(creative.status)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
