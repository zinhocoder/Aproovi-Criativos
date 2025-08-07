"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  ArrowLeft,
  ImagePlus,
  Search,
  Filter,
  Calendar,
  Grid3X3,
  List,
  MoreHorizontal,
  Download,
  Share2,
  Pencil,
  Building2,
  Eye,
  Clock,
} from "lucide-react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEmpresas } from "@/hooks/use-empresas"
import { Empresa, Creative, apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function EmpresaDetalhesPage() {
  const params = useParams()
  const empresaId = params.id as string
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [creativesLoading, setCreativesLoading] = useState(true)

  const { empresas, loading: empresasLoading } = useEmpresas()
  const { toast } = useToast()

  const empresa = empresas.find(e => e.id === empresaId)

  // Carregar criativos da empresa específica
  useEffect(() => {
    const fetchEmpresaCreatives = async () => {
      if (empresaId) {
        try {
          setCreativesLoading(true)
          const response = await apiService.getCreatives(empresaId)
          
          if (response.success && response.data) {
            setCreatives(response.data)
          } else {
            toast({
              title: "Erro",
              description: response.message || "Erro ao carregar criativos",
              variant: "destructive",
            })
          }
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao carregar criativos da empresa",
            variant: "destructive",
          })
        } finally {
          setCreativesLoading(false)
        }
      }
    }

    fetchEmpresaCreatives()
  }, [empresaId, toast])

  // Filtrar criativos
  const filteredCreatives = creatives.filter(criativo => {
    const matchesSearch = criativo.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         criativo.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || criativo.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "bg-green-100 text-green-800"
      case "reprovado":
        return "bg-red-100 text-red-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusCounts = () => {
    const total = filteredCreatives.length
    const pendentes = filteredCreatives.filter(c => c.status === "pendente").length
    const aprovados = filteredCreatives.filter(c => c.status === "aprovado").length
    const reprovados = filteredCreatives.filter(c => c.status === "reprovado").length
    
    return { total, pendentes, aprovados, reprovados }
  }

  if (empresasLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/empresas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/empresas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Empresa não encontrada</h1>
            <p className="text-muted-foreground">A empresa que você está procurando não existe.</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Empresa não encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              A empresa com ID "{empresaId}" não foi encontrada ou foi removida.
            </p>
            <Link href="/dashboard/empresas">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Empresas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/empresas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              {empresa.logo ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted border-2 border-muted-foreground/10">
                  <img
                    src={empresa.logo}
                    alt={`Logo ${empresa.nome}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border-2 border-muted-foreground/10">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <h1 className="text-3xl font-bold tracking-tight">{empresa.nome}</h1>
              <Badge variant={empresa.ativa ? "default" : "secondary"}>
                {empresa.ativa ? "Ativa" : "Inativa"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span>Criada em {format(new Date(empresa.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
              <span>•</span>
              <span>por {empresa.createdBy.name}</span>
              <span>•</span>
              <span>{empresa._count.creatives} criativos</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/criativos/novo?empresa=${empresa.id}`}>
            <Button>
              <ImagePlus className="mr-2 h-4 w-4" />
              Novo Criativo
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/empresas/${empresa.id}/editar`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar empresa
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {empresa.descricao && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{empresa.descricao}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">
              criativos cadastrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pendentes}</div>
            <p className="text-xs text-muted-foreground">
              aguardando revisão
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.aprovados}</div>
            <p className="text-xs text-muted-foreground">
              prontos para uso
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts.aprovados + statusCounts.reprovados > 0 
                ? Math.round((statusCounts.aprovados / (statusCounts.aprovados + statusCounts.reprovados)) * 100)
                : 0
              }%
                    </div>
            <p className="text-xs text-muted-foreground">
              dos criativos revisados
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="criativos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="criativos">Criativos ({statusCounts.total})</TabsTrigger>
        </TabsList>
        <TabsContent value="criativos" className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar criativos..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
        </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                    Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
              <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    Todos ({statusCounts.total})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pendente")}>
                    Pendentes ({statusCounts.pendentes})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("aprovado")}>
                    Aprovados ({statusCounts.aprovados})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("reprovado")}>
                    Reprovados ({statusCounts.reprovados})
                  </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
              <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

          {creativesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          ) : filteredCreatives.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImagePlus className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm || statusFilter !== "all" 
                    ? "Nenhum criativo encontrado" 
                    : "Nenhum criativo cadastrado"
                  }
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Tente ajustar os filtros de busca"
                    : `Comece criando o primeiro criativo para ${empresa.nome}`
                  }
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Link href={`/dashboard/criativos/novo?empresa=${empresa.id}`}>
                    <Button>
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Criar Primeiro Criativo
                    </Button>
                </Link>
                )}
                      </CardContent>
                    </Card>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" 
              : "space-y-4"
            }>
              {filteredCreatives.map((criativo) => (
                  <Link key={criativo.id} href={`/dashboard/criativos/${criativo.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4">
                      {viewMode === "grid" ? (
                        <div className="space-y-3">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <img
                              src={criativo.url}
                              alt={criativo.titulo || criativo.fileName}
                              className="w-full h-full object-cover"
                        />
                      </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-sm truncate">
                                {criativo.titulo || criativo.fileName}
                              </h3>
                              <Badge className={`text-xs ${getStatusColor(criativo.status)}`}>
                                {criativo.status}
                              </Badge>
                        </div>
                            <div className="text-xs text-muted-foreground">
                              <p>Tipo: {criativo.tipo || "Post"}</p>
                              <p>Criado em {format(new Date(criativo.createdAt), "dd/MM/yyyy", { locale: ptBR })}</p>
                        </div>
                      </div>
            </div>
          ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={criativo.url}
                              alt={criativo.titulo || criativo.fileName}
                              className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium truncate">
                                {criativo.titulo || criativo.fileName}
                              </h3>
                              <Badge className={`text-xs ml-2 ${getStatusColor(criativo.status)}`}>
                                {criativo.status}
                              </Badge>
                        </div>
                            <div className="text-sm text-muted-foreground">
                              <p>Tipo: {criativo.tipo || "Post"} • Criado em {format(new Date(criativo.createdAt), "dd/MM/yyyy", { locale: ptBR })}</p>
                        </div>
                      </div>
            </div>
          )}
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