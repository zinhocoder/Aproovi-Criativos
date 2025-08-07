"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "O que é o Aproovi?",
    answer:
      "O Aproovi é uma plataforma de aprovação de criativos para agências de marketing e seus clientes. Ela simplifica o processo de revisão, feedback e aprovação de conteúdo para redes sociais e campanhas digitais.",
  },
  {
    question: "Como funciona o processo de aprovação?",
    answer:
      "A agência faz upload dos criativos, organiza por cliente e envia para aprovação. Os clientes recebem acesso para visualizar, comentar e aprovar ou solicitar ajustes. Todo o histórico é registrado, facilitando o acompanhamento das alterações.",
  },
  {
    question: "Quais tipos de arquivos são suportados?",
    answer:
      "O Aproovi suporta imagens (JPG, PNG, GIF), vídeos (MP4, MOV), documentos (PDF) e arquivos de design (PSD, AI, Figma). Praticamente qualquer tipo de criativo digital pode ser gerenciado na plataforma.",
  },
  {
    question: "Quantos usuários posso adicionar?",
    answer:
      "O número de usuários depende do seu plano. O plano Starter permite 2 usuários, o plano Pro permite 5 usuários, e o plano Enterprise oferece usuários ilimitados. Cada cliente que recebe acesso para aprovação não conta como usuário.",
  },
  {
    question: "É possível personalizar a plataforma com a marca da minha agência?",
    answer:
      "Sim, no plano Enterprise você pode personalizar a plataforma com sua marca, incluindo logo, cores e domínio personalizado, oferecendo uma experiência white-label para seus clientes.",
  },
  {
    question: "Como funciona o período de teste gratuito?",
    answer:
      "Oferecemos 14 dias de teste gratuito com todas as funcionalidades do plano Pro. Não é necessário cartão de crédito para começar, e você pode fazer upgrade para qualquer plano ao final do período de teste.",
  },
  {
    question: "Posso exportar os dados e criativos da plataforma?",
    answer:
      "Sim, você pode exportar todos os seus criativos, comentários e histórico de aprovações a qualquer momento. Seus dados sempre pertencem a você.",
  },
  {
    question: "O Aproovi oferece integrações com outras ferramentas?",
    answer:
      "Sim, oferecemos integrações com ferramentas populares como Slack, Trello, Asana, Google Drive e ferramentas de design como Adobe Creative Cloud e Figma. No plano Enterprise, também oferecemos API para integrações personalizadas.",
  },
]

export function FaqSection() {
  return (
    <div className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Perguntas Frequentes</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Tire suas dúvidas sobre a plataforma Aproovi
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
