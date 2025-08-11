import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    content:
      "O CCS HUB revolucionou nosso fluxo de trabalho. Antes, passávamos horas trocando emails com clientes sobre aprovações. Agora, todo o processo é centralizado e transparente. Economizamos pelo menos 10 horas por semana!",
    author: "Mariana Costa",
    role: "Diretora de Marketing",
    company: "Agência Digital Plus",
  },
  {
    content:
      "Como agência que atende mais de 20 clientes, o CCS HUB se tornou indispensável. A organização por cliente e a facilidade de acompanhar o status de cada criativo nos deu um novo nível de profissionalismo.",
    author: "Roberto Silva",
    role: "CEO",
    company: "Studio Criativo",
  },
  {
    content:
      "Como cliente de uma agência que usa o CCS HUB, posso dizer que a experiência é excelente. Consigo ver todos os criativos em um só lugar, fazer comentários específicos e aprovar com um clique. Muito melhor que o caos de emails!",
    author: "Ana Paula Santos",
    role: "Marketing Manager",
    company: "Empresa XYZ",
  },
  {
    content:
      "Gerencio o conteúdo de 8 clientes diferentes e o CCS HUB tornou minha vida muito mais fácil. O histórico completo de aprovações e comentários me salvou em várias reuniões quando precisei justificar decisões de design.",
    author: "Carlos Mendes",
    role: "Designer Sênior",
    company: "Agência Visual",
  },
  {
    content:
      "Implementamos o CCS HUB há 6 meses e já vimos um aumento de 30% na eficiência da equipe. O tempo de aprovação dos criativos caiu pela metade e a satisfação dos clientes aumentou significativamente.",
    author: "Fernanda Lima",
    role: "Gerente de Projetos",
    company: "Marketing Solutions",
  },
]

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Depoimentos</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Depoimentos reais de agências e clientes que utilizam o CCS HUB
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                    <AvatarImage src={`/testimonials/avatar-${index + 1}.jpg`} alt={testimonial.author} />
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{testimonial.author}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role} - {testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
