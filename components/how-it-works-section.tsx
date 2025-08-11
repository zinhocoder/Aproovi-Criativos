import { Card, CardContent } from "@/components/ui/card"
import { Upload, Share2, MessageSquare, CheckCircle, RefreshCw, BarChart } from "lucide-react"

const steps = [
  {
    title: "Upload de Criativos",
    description:
      "Nossa equipe faz upload dos criativos desenvolvidos para suas campanhas, organizados por projeto e data.",
    icon: <Upload className="h-10 w-10 text-primary" />,
  },
  {
    title: "Acesso Exclusivo",
    description:
      "Você recebe acesso exclusivo à plataforma CCS HUB para visualizar todos os criativos organizados por projeto.",
    icon: <Share2 className="h-10 w-10 text-primary" />,
  },
  {
    title: "Feedback Detalhado",
    description:
      "Adicione comentários específicos em cada elemento do criativo, eliminando confusões e agilizando o processo.",
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
  },
  {
    title: "Aprovação Simplificada",
    description:
      "Com um clique, aprove o criativo ou solicite ajustes, tudo registrado na plataforma para acompanhamento.",
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
  },
  {
    title: "Ciclo de Revisões",
    description:
      "Se necessário, nossa equipe faz ajustes e envia novas versões, mantendo todo o histórico organizado.",
    icon: <RefreshCw className="h-10 w-10 text-primary" />,
  },
  {
    title: "Acompanhamento",
    description:
      "Acompanhe o progresso de suas campanhas, tempo de aprovação e histórico completo de todos os criativos.",
    icon: <BarChart className="h-10 w-10 text-primary" />,
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Como Funciona</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça o processo completo de aprovação de criativos com a plataforma exclusiva CCS HUB
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
