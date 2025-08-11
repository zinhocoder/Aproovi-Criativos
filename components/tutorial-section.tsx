import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { CheckCircle, Users, MessageSquare, BarChart, LogIn } from "lucide-react"

const tutorialSteps = [
  {
    title: "Acesse a plataforma",
    description:
      "Receba suas credenciais de acesso exclusivas da CCS Company e faça login na plataforma CCS HUB.",
    image: "/tutorial/cliente-1.jpg",
    icon: <LogIn className="h-6 w-6 text-primary" />,
  },
  {
    title: "Visualize seus criativos",
    description: "Acesse todos os criativos desenvolvidos pela equipe da CCS Company, organizados por campanha ou projeto.",
    image: "/tutorial/cliente-2.jpg",
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
  },
  {
    title: "Adicione comentários",
    description: "Clique em qualquer parte do criativo para adicionar comentários específicos e detalhados para nossa equipe.",
    image: "/tutorial/cliente-3.jpg",
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
  },
  {
    title: "Aprove ou solicite ajustes",
    description: "Com um clique, aprove o criativo ou solicite alterações específicas com base nos seus comentários.",
    image: "/tutorial/cliente-4.jpg",
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
  },
  {
    title: "Acompanhe o histórico",
    description:
      "Visualize todas as versões anteriores, comentários e aprovações para manter o controle completo do processo.",
    image: "/tutorial/cliente-5.jpg",
    icon: <BarChart className="h-6 w-6 text-primary" />,
  },
]

export function TutorialSection() {
  return (
    <section id="tutorial" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Tutorial: Como Usar a CCS HUB
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Guia passo a passo para clientes da CCS Company
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl mt-12">
          <div className="space-y-8">
            {tutorialSteps.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2">
                    <div className="p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-primary/10 p-2">{step.icon}</div>
                        <h3 className="text-xl font-bold">
                          {index + 1}. {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="bg-muted h-64 md:h-auto flex items-center justify-center">
                      <div className="text-center text-muted-foreground p-4">
                        <div className="w-full h-full flex items-center justify-center">
                          <Image
                            src={step.image || "/placeholder.svg?height=300&width=400"}
                            alt={step.title}
                            width={400}
                            height={300}
                            className="rounded-md object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
