"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Building2,
  ImageIcon,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function DashboardPage() {
  const { user, loading } = useProtectedRoute();
  const { stats, loading: statsLoading, error } = useDashboardStats();

  if (loading || statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar dados: {error}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo à plataforma de aprovação de criativos da CCS HUB.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/criativos/novo">
            <Button>
              <ImageIcon className="mr-2 h-4 w-4" />
              Novo Criativo
            </Button>
          </Link>
          <Link href="/dashboard/empresas/nova">
            <Button variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              Nova Empresa
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEmpresas || 0}</div>
            <p className="text-xs text-muted-foreground">empresas cadastradas</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Criativos</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCriativos || 0}</div>
            <p className="text-xs text-muted-foreground">criativos enviados</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.taxaAprovacao || 0}%</div>
            <p className="text-xs text-muted-foreground">criativos aprovados</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Aprovação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tempoMedioAprovacao || 0} dias</div>
            <p className="text-xs text-muted-foreground">tempo médio</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>Status dos criativos nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">Aprovados</span>
                  </div>
                  <span className="text-sm font-medium">
                    {stats?.criativosPorStatus.aprovado || 0} 
                    ({stats?.totalCriativos ? Math.round((stats.criativosPorStatus.aprovado / stats.totalCriativos) * 100) : 0}%)
                  </span>
                </div>
                <Progress 
                  value={stats?.totalCriativos ? (stats.criativosPorStatus.aprovado / stats.totalCriativos) * 100 : 0} 
                  className="h-2 bg-muted" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm font-medium">Pendentes</span>
                  </div>
                  <span className="text-sm font-medium">
                    {stats?.criativosPorStatus.pendente || 0} 
                    ({stats?.totalCriativos ? Math.round((stats.criativosPorStatus.pendente / stats.totalCriativos) * 100) : 0}%)
                  </span>
                </div>
                <Progress 
                  value={stats?.totalCriativos ? (stats.criativosPorStatus.pendente / stats.totalCriativos) * 100 : 0} 
                  className="h-2 bg-muted" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium">Reprovados</span>
                  </div>
                  <span className="text-sm font-medium">
                    {stats?.criativosPorStatus.reprovado || 0} 
                    ({stats?.totalCriativos ? Math.round((stats.criativosPorStatus.reprovado / stats.totalCriativos) * 100) : 0}%)
                  </span>
                </div>
                <Progress 
                  value={stats?.totalCriativos ? (stats.criativosPorStatus.reprovado / stats.totalCriativos) * 100 : 0} 
                  className="h-2 bg-muted" 
                />
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <h4 className="text-sm font-medium">Atividade Recente</h4>
              <div className="space-y-4 mt-3">
                {stats?.criativosRecentes && stats.criativosRecentes.length > 0 ? (
                  stats.criativosRecentes.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.titulo}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{item.empresa}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.status === "aprovado"
                              ? "bg-green-100 text-green-800"
                              : item.status === "reprovado"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status === "aprovado"
                            ? "Aprovado"
                            : item.status === "reprovado"
                              ? "Reprovado"
                              : "Pendente"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Nenhum criativo encontrado</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Empresas</CardTitle>
            <CardDescription>Desempenho por empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ativas">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ativas">Mais Ativas</TabsTrigger>
                <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              </TabsList>
              <TabsContent value="ativas" className="space-y-4 pt-4">
                {stats?.empresasAtivas && stats.empresasAtivas.length > 0 ? (
                  stats.empresasAtivas.map((company) => (
                    <div key={company.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{company.nome}</span>
                        <span className="text-sm">{company.taxaAprovacao}%</span>
                      </div>
                      <Progress value={company.taxaAprovacao} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{company.totalCriativos} criativos</span>
                        <span>Taxa de aprovação</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Nenhuma empresa encontrada</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="pendentes" className="space-y-4 pt-4">
                {stats?.empresasComPendentes && stats.empresasComPendentes.length > 0 ? (
                  stats.empresasComPendentes.map((company) => (
                    <div key={company.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{company.nome}</span>
                        <span className="text-xs text-muted-foreground">{company.totalCriativos} criativos no total</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{company.criativosPendentes}</span>
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Pendentes</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Nenhum criativo pendente</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>


          </CardContent>
        </Card>
      </div>


    </div>
  )
}
