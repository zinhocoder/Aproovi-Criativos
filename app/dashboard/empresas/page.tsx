"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Building2, Plus, Search, Filter, ArrowUpDown, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEmpresas } from "@/hooks/use-empresas"
import { useToast } from "@/hooks/use-toast"
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
} from "@/components/ui/alert-dialog"

export default function EmpresasPage() {
  const { empresas, loading, deleteEmpresa, fetchEmpresas } = useEmpresas()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [sortBy, setSortBy] = useState<"name" | "creatives" | "created">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Filtrar e ordenar empresas
  const filteredEmpresas = empresas
    .filter(empresa => {
      const matchesSearch = empresa.nome.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === "all" || 
        (filterStatus === "active" && empresa.ativa) ||
        (filterStatus === "inactive" && !empresa.ativa)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "name":
          comparison = a.nome.localeCompare(b.nome)
          break
        case "creatives":
          comparison = a._count.creatives - b._count.creatives
          break
        case "created":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      
      return sortOrder === "asc" ? comparison : -comparison
    })

  const handleDeleteEmpresa = async (id: string, nome: string) => {
    try {
      await deleteEmpresa(id)
      toast({
        title: "Empresa desativada",
        description: `A empresa "${nome}" foi desativada com sucesso.`,
      })
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
            <p className="text-muted-foreground">Carregando empresas...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas e seus criativos. Total: {empresas.length} empresas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/empresas/nova">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Empresa
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar empresas..." 
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
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                Todas ({empresas.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Ativas ({empresas.filter(e => e.ativa).length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                Inativas ({empresas.filter(e => !e.ativa).length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setSortBy("name"); setSortOrder("asc") }}>
                Nome (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("name"); setSortOrder("desc") }}>
                Nome (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("creatives"); setSortOrder("desc") }}>
                Mais criativos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("created"); setSortOrder("desc") }}>
                Mais recentes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredEmpresas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? "Nenhuma empresa encontrada" : "Nenhuma empresa cadastrada"}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? `Não encontramos empresas que correspondam a "${searchTerm}"`
                : "Comece criando sua primeira empresa para organizar os criativos"
              }
            </p>
            {!searchTerm && (
              <Link href="/dashboard/empresas/nova">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Empresa
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmpresas.map((empresa) => (
            <Card key={empresa.id} className="hover:bg-muted/50 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3 flex-1">
                  {empresa.logo ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted border-2 border-muted-foreground/10">
                      <img
                        src={empresa.logo}
                        alt={`Logo ${empresa.nome}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 border-2 border-muted-foreground/10">
                      <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="space-y-1 min-w-0 flex-1">
                    <CardTitle className="text-xl font-medium truncate">{empresa.nome}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>
                        Criada em {format(new Date(empresa.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <Badge variant={empresa.ativa ? "default" : "secondary"} className="ml-2">
                        {empresa.ativa ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/empresas/${empresa.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/empresas/${empresa.id}/editar`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      {empresa.ativa && empresa._count.creatives === 0 && (
                        <DropdownMenuSeparator />
                      )}
                      {empresa.ativa && empresa._count.creatives === 0 && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                              <span className="text-destructive">Desativar</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Desativar empresa?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação irá desativar a empresa "{empresa.nome}". 
                                Ela não aparecerá mais nas opções de seleção, mas os dados serão preservados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEmpresa(empresa.id, empresa.nome)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Desativar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total de criativos</span>
                    <span className="text-2xl font-bold">{empresa._count.creatives}</span>
                  </div>
                  
                  {empresa.descricao && (
                    <div className="text-sm text-muted-foreground">
                      <p className="line-clamp-2">{empresa.descricao}</p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    <p>Criada por: {empresa.createdBy.name}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/empresas/${empresa.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Criativos
                      </Button>
                    </Link>
                    <Link href={`/dashboard/criativos/novo?empresa=${empresa.id}`}>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}