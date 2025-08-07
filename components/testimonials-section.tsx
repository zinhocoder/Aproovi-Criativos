import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Mariana Silva",
    role: "Diretora de Marketing, Agência Impulso",
    avatar: "/testimonials/avatar-1.jpg",
    content:
      "O Aproovi revolucionou nosso fluxo de trabalho. Antes, passávamos horas trocando emails com clientes sobre aprovações. Agora, todo o processo é centralizado e transparente. Economizamos pelo menos 10 horas por semana!",
    rating: 5,
  },
  {
    name: "Carlos Mendes",
    role: "CEO, Mendes Digital",
    avatar: "/testimonials/avatar-2.jpg",
    content:
      "Como agência que atende mais de 20 clientes, o Aproovi se tornou indispensável. A organização por cliente e a facilidade de acompanhar o status de cada criativo nos deu um novo nível de profissionalismo.",
    rating: 5,
  },
  {
    name: "Juliana Costa",
    role: "Gerente de Marketing, TechBrasil",
    avatar: "/testimonials/avatar-3.jpg",
    content:
      "Como cliente de uma agência que usa o Aproovi, posso dizer que a experiência é excelente. Consigo ver todos os criativos em um só lugar, fazer comentários específicos e aprovar com um clique. Muito melhor que o caos de emails!",
    rating: 5,
  },
  {
    name: "Roberto Almeida",
    role: "Diretor Criativo, Studio Visual",
    avatar: "/testimonials/avatar-4.jpg",
    content:
      "A funcionalidade de comentários em pontos específicos da imagem é um diferencial incrível. Não há mais confusão sobre qual elemento o cliente está se referindo. Isso reduziu drasticamente o número de revisões necessárias.",
    rating: 4,
  },
  {
    name: "Fernanda Oliveira",
    role: "Social Media Manager, Conecta Digital",
    avatar: "/testimonials/avatar-5.jpg",
    content:
      "Gerencio o conteúdo de 8 clientes diferentes e o Aproovi tornou minha vida muito mais fácil. O histórico completo de aprovações e comentários me salvou em várias reuniões quando precisei justificar decisões de design.",
    rating: 5,
  },
  {
    name: "Lucas Santos",
    role: "Fundador, Agência Nexus",
    avatar: "/testimonials/avatar-6.jpg",
    content:
      "Implementamos o Aproovi há 6 meses e já vimos um aumento de 30% na eficiência da equipe. O tempo de aprovação dos criativos caiu pela metade e a satisfação dos clientes aumentou significativamente.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">O que nossos clientes dizem</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Depoimentos reais de agências e clientes que utilizam o Aproovi
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
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
