import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { CheckCircle, Upload, Users, MessageSquare, BarChart } from "lucide-react"

const tutorialSteps = {
  agencias: [
    {
      title: "Crie sua conta",
      description:
        "Registre-se como agência, adicione informações básicas e convide membros da sua equipe para colaborar.",
      image: "/tutorial/agencia-1.jpg",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "Adicione seus clientes",
      description: "Crie perfis para cada cliente, personalize permissões e organize-os por categorias ou projetos.",
      image: "/tutorial/agencia-2.jpg",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "Faça upload de criativos",
      description: "Envie seus criativos, organize-os por campanha, adicione descrições e defina prazos de aprovação.",
      image: "/tutorial/agencia-3.jpg",
      icon: <Upload className="h-6 w-6 text-primary" />,
    },
    {
      title: "Acompanhe aprovações",
      description: "Monitore o status de cada criativo, receba notificações de comentários e gerencie revisões.",
      image: "/tutorial/agencia-4.jpg",
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
    },
    {
      title: "Analise métricas",
      description: "Visualize relatórios de desempenho, tempo médio de aprovação e eficiência por cliente ou campanha.",
      image: "/tutorial/agencia-5.jpg",
      icon: <BarChart className="h-6 w-6 text-primary" />,
    },
  ],
  clientes: [
    {
      title: "Acesse seu convite",
      description:
        "Receba um email de convite da sua agência, crie sua senha e acesse a plataforma sem custo adicional.",
      image: "/tutorial/cliente-1.jpg",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "Visualize criativos",
      description: "Acesse todos os criativos enviados pela agência, organizados por campanha ou projeto.",
      image: "/tutorial/cliente-2.jpg",
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
    },
    {
      title: "Adicione comentários",
      description: "Clique em qualquer parte do criativo para adicionar comentários específicos e detalhados.",
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
        "Visualize todas as versões anteriores, comentários e aprovações para manter o controle do processo.",
      image: "/tutorial/cliente-5.jpg",
      icon: <BarChart className="h-6 w-6 text-primary" />,
    },
  ],
}

export function TutorialSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Tutorial: Como Usar o Aproovi
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Guia passo a passo para agências e clientes
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl mt-12">
          <Tabs defaultValue="agencias" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="agencias">Para Agências</TabsTrigger>
              <TabsTrigger value="clientes">Para Clientes</TabsTrigger>
            </TabsList>
            <TabsContent value="agencias">
              <div className="space-y-8">
                {tutorialSteps.agencias.map((step, index) => (
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
            </TabsContent>
            <TabsContent value="clientes">
              <div className="space-y-8">
                {tutorialSteps.clientes.map((step, index) => (
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
