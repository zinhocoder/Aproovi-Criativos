"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "O que é a plataforma CCS HUB?",
    answer:
      "A CCS HUB é uma plataforma exclusiva da CCS Company para aprovação de criativos. Ela simplifica o processo de revisão, feedback e aprovação de conteúdo para redes sociais e campanhas digitais de nossos clientes.",
  },
  {
    question: "Como funciona o processo de aprovação?",
    answer:
      "Nossa equipe faz upload dos criativos desenvolvidos na plataforma, organiza por projeto e envia para sua aprovação. Você recebe uma notificação, visualiza o material, pode fazer comentários específicos e aprovar ou solicitar ajustes com apenas alguns cliques.",
  },
  {
    question: "Quais tipos de arquivos são suportados?",
    answer:
      "A plataforma CCS HUB suporta imagens (JPG, PNG, GIF), vídeos (MP4, MOV), documentos (PDF) e arquivos de design (PSD, AI, Figma). Praticamente qualquer tipo de criativo digital pode ser gerenciado na plataforma.",
  },
  {
    question: "Posso organizar criativos por projeto?",
    answer:
      "Sim! A plataforma permite organizar criativos por projeto e empresa, mantendo um histórico completo de todas as aprovações e comentários para cada campanha.",
  },
  {
    question: "O sistema é seguro?",
    answer:
      "Absolutamente. Utilizamos criptografia de ponta a ponta, autenticação segura e seguimos as melhores práticas de segurança para proteger seus dados e criativos.",
  },
  {
    question: "Como posso acessar a plataforma?",
    answer:
      "Como cliente da CCS Company, você receberá credenciais de acesso exclusivas para a plataforma CCS HUB. Entre em contato com nossa equipe para solicitar seu acesso.",
  },
  {
    question: "Existe um limite de uploads?",
    answer:
      "Não há limites para nossos clientes. A plataforma CCS HUB oferece capacidade ilimitada para gerenciar todos os seus criativos e projetos.",
  },
  {
    question: "Posso exportar relatórios de aprovação?",
    answer:
      "Sim! A plataforma oferece relatórios detalhados de aprovações, tempo de resposta e histórico completo de comentários para análise e otimização do processo.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Perguntas Frequentes</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Tire suas dúvidas sobre a plataforma exclusiva CCS HUB
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
    </section>
  )
}
