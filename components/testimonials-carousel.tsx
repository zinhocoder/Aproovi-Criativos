"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ArrowLeft, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useEffect, useState } from "react"

const testimonials = [
  {
    content:
      "A plataforma CCS HUB revolucionou nosso processo de aprovação. Antes, passávamos horas trocando emails com a equipe da CCS Company. Agora, todo o processo é centralizado e transparente. Economizamos pelo menos 10 horas por semana!",
    author: "Mariana Costa",
    role: "Diretora de Marketing",
    company: "Empresa ABC",
  },
  {
    content:
      "Como cliente da CCS Company há mais de 2 anos, a plataforma CCS HUB se tornou indispensável. A organização por projeto e a facilidade de acompanhar o status de cada criativo nos deu um novo nível de controle sobre nossas campanhas.",
    author: "Roberto Silva",
    role: "CEO",
    company: "Startup XYZ",
  },
  {
    content:
      "A experiência com a plataforma CCS HUB é excelente. Consigo ver todos os criativos em um só lugar, fazer comentários específicos e aprovar com um clique. Muito melhor que o caos de emails! A equipe da CCS Company sempre responde rapidamente.",
    author: "Ana Paula Santos",
    role: "Marketing Manager",
    company: "E-commerce Plus",
  },
  {
    content:
      "Gerencio o conteúdo de 5 marcas diferentes e a plataforma CCS HUB tornou minha vida muito mais fácil. O histórico completo de aprovações e comentários me salvou em várias reuniões quando precisei justificar decisões de campanha.",
    author: "Carlos Mendes",
    role: "Brand Manager",
    company: "Grupo Empresarial",
  },
  {
    content:
      "Usamos a plataforma CCS HUB há 6 meses e já vimos um aumento de 30% na eficiência do processo de aprovação. O tempo de aprovação dos criativos caiu pela metade e a comunicação com a equipe da CCS Company ficou muito mais clara.",
    author: "Fernanda Lima",
    role: "Gerente de Marketing",
    company: "Tech Solutions",
  },
]

export function TestimonialsCarousel() {
  const [slidesToShow, setSlidesToShow] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1)
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2)
      } else {
        setSlidesToShow(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <section id="depoimentos" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Depoimentos</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Depoimentos reais de clientes da CCS Company que utilizam a plataforma CCS HUB
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl py-12 relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className={`md:basis-1/${slidesToShow}`}>
                  <Card className="h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                          <AvatarImage src={`/testimonials/avatar-${index + 1}.jpg`} alt={testimonial.author} />
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{testimonial.author}</h3>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 5 ? "fill-yellow-400 text-yellow-400" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm flex-grow">{testimonial.content}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="md:block">
              <CarouselPrevious className="md:absolute md:-left-12 md:top-1/2 md:-translate-y-1/2 static translate-y-0 translate-x-0 hidden md:flex" />
              <CarouselNext className="md:absolute md:-right-12 md:top-1/2 md:-translate-y-1/2 static translate-y-0 translate-x-0 hidden md:flex" />
            </div>
          </Carousel>
          <div className="flex justify-center gap-2 mt-4 md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                const api = (document.querySelector('[data-embla-api="true"]') as any)?.__emblaApi
                api?.scrollPrev()
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                const api = (document.querySelector('[data-embla-api="true"]') as any)?.__emblaApi
                api?.scrollNext()
              }}
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Próximo</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
