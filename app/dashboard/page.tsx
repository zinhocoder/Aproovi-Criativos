import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Building2,
  ImageIcon,
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare,
  XCircle,
  PlusCircle,
  Eye,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo à plataforma de aprovação de criativos da Aproovi.</p>
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 no último mês</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Criativos</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">+28 na última semana</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Aprovação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 dias</div>
            <p className="text-xs text-muted-foreground">-0.5 dias em relação ao mês anterior</p>
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
                  <span className="text-sm font-medium">89 (61%)</span>
                </div>
                <Progress value={61} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm font-medium">Pendentes</span>
                  </div>
                  <span className="text-sm font-medium">32 (22%)</span>
                </div>
                <Progress value={22} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium">Reprovados</span>
                  </div>
                  <span className="text-sm font-medium">24 (17%)</span>
                </div>
                <Progress value={17} className="h-2 bg-muted" />
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <h4 className="text-sm font-medium">Atividade Recente</h4>
              <div className="space-y-4 mt-3">
                {[
                  { id: 1, title: "Post Instagram - Drive Experience", status: "pendente", date: "Hoje, 14:30" },
                  { id: 2, title: "Story Facebook - Tubotecnica", status: "aprovado", date: "Ontem, 10:15" },
                  { id: 3, title: "Carrossel LinkedIn - Drive Experience", status: "reprovado", date: "22/04/2024" },
                  { id: 4, title: "Banner Site - Tubotecnica", status: "aprovado", date: "20/04/2024" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <div className="flex items-center">
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
                ))}
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
                {[
                  { id: 1, name: "Drive Experience", approvalRate: 85, totalCount: 45 },
                  { id: 2, name: "Tubotecnica", approvalRate: 72, totalCount: 32 },
                  { id: 3, name: "Empresa ABC", approvalRate: 90, totalCount: 28 },
                  { id: 4, name: "Empresa XYZ", approvalRate: 65, totalCount: 40 },
                ].map((company) => (
                  <div key={company.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{company.name}</span>
                      <span className="text-sm">{company.approvalRate}%</span>
                    </div>
                    <Progress value={company.approvalRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{company.totalCount} criativos</span>
                      <span>Taxa de aprovação</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="pendentes" className="space-y-4 pt-4">
                {[
                  { id: 1, name: "Drive Experience", pendingCount: 12, totalCount: 45 },
                  { id: 2, name: "Tubotecnica", pendingCount: 8, totalCount: 32 },
                  { id: 3, name: "Empresa ABC", pendingCount: 5, totalCount: 28 },
                  { id: 4, name: "Empresa XYZ", pendingCount: 7, totalCount: 40 },
                ].map((company) => (
                  <div key={company.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{company.name}</span>
                      <span className="text-xs text-muted-foreground">{company.totalCount} criativos no total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{company.pendingCount}</span>
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Pendentes</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Próximos Vencimentos</h4>
              <div className="space-y-3">
                {[
                  { id: 1, name: "Campanha de Verão - Drive Experience", date: "28/04/2024" },
                  { id: 2, name: "Lançamento de Produto - Tubotecnica", date: "30/04/2024" },
                  { id: 3, name: "Evento Corporativo - Empresa ABC", date: "02/05/2024" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {item.date}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Criativos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Post Instagram", count: 45, percentage: 31 },
                { type: "Story Facebook", count: 32, percentage: 22 },
                { type: "Carrossel LinkedIn", count: 28, percentage: 19 },
                { type: "Banner Site", count: 25, percentage: 17 },
                { type: "Outros", count: 15, percentage: 11 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{item.type}</span>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "João Silva", role: "Cliente", company: "Drive Experience", lastActive: "Há 5 min" },
                { name: "Maria Oliveira", role: "Cliente", company: "Tubotecnica", lastActive: "Há 30 min" },
                { name: "Carlos Santos", role: "Designer", company: "Aproovi", lastActive: "Há 1h" },
                { name: "Ana Pereira", role: "Gerente", company: "Aproovi", lastActive: "Há 2h" },
                { name: "Roberto Lima", role: "Cliente", company: "Empresa ABC", lastActive: "Há 2h" },
                { name: "Roberto Lima", role: "Cliente", company: "Empresa ABC", lastActive: "Há 3h" },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.role} • {user.company}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{user.lastActive}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "aprovou",
                  user: "João Silva",
                  item: "Post Instagram - Drive Experience",
                  time: "Há 5 min",
                  icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                },
                {
                  action: "comentou em",
                  user: "Maria Oliveira",
                  item: "Story Facebook - Tubotecnica",
                  time: "Há 30 min",
                  icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
                },
                {
                  action: "reprovou",
                  user: "Carlos Santos",
                  item: "Carrossel LinkedIn - Drive Experience",
                  time: "Há 1h",
                  icon: <XCircle className="h-4 w-4 text-red-500" />,
                },
                {
                  action: "criou",
                  user: "Ana Pereira",
                  item: "Banner Site - Tubotecnica",
                  time: "Há 2h",
                  icon: <PlusCircle className="h-4 w-4 text-primary" />,
                },
                {
                  action: "visualizou",
                  user: "Roberto Lima",
                  item: "Post Twitter - Empresa ABC",
                  time: "Há 3h",
                  icon: <Eye className="h-4 w-4 text-gray-500" />,
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 border-b pb-3 last:border-0">
                  <div className="mt-0.5">{activity.icon}</div>
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium">{activity.item}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
