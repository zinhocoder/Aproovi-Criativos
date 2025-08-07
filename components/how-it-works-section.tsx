import { Card, CardContent } from "@/components/ui/card"
import { Upload, Share2, MessageSquare, CheckCircle, RefreshCw, BarChart } from "lucide-react"

const steps = [
  {
    title: "Upload de Criativos",
    description:
      "Faça upload dos seus criativos para redes sociais, campanhas ou qualquer material digital que precise de aprovação.",
    icon: <Upload className="h-10 w-10 text-primary" />,
  },
  {
    title: "Compartilhe com Clientes",
    description:
      "Envie convites para seus clientes acessarem a plataforma e visualizarem os criativos organizados por projeto.",
    icon: <Share2 className="h-10 w-10 text-primary" />,
  },
  {
    title: "Receba Feedback Detalhado",
    description:
      "Os clientes podem adicionar comentários específicos em cada elemento do criativo, eliminando confusões.",
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
  },
  {
    title: "Aprovação Simplificada",
    description:
      "Com um clique, os clientes podem aprovar o criativo ou solicitar ajustes, tudo registrado na plataforma.",
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
  },
  {
    title: "Ciclo de Revisões",
    description:
      "Se necessário, faça ajustes e envie novas versões, mantendo todo o histórico de alterações organizado.",
    icon: <RefreshCw className="h-10 w-10 text-primary" />,
  },
  {
    title: "Análise e Relatórios",
    description:
      "Acompanhe métricas como tempo de aprovação, taxa de revisões e desempenho por cliente ou tipo de criativo.",
    icon: <BarChart className="h-10 w-10 text-primary" />,
  },
]

export function HowItWorksSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Como Funciona</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça o processo completo de aprovação de criativos com o Aproovi
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={index} className="overflow-hidden h-full">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="rounded-full bg-primary/10 p-3 mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
