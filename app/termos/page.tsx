"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Termos de Uso</h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p className="mb-4">
                Ao acessar e usar o CCS HUB, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
              <p className="mb-4">
                O CCS HUB é uma plataforma desenvolvida exclusivamente para os nossos clientes, que permite:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Upload e gerenciamento de criativos para redes sociais</li>
                <li>Sistema de aprovação e feedback entre agências e clientes</li>
                <li>Organização de projetos por cliente</li>
                <li>Histórico de comentários e aprovações</li>
                <li>Compartilhamento seguro de arquivos</li>
                <li>Suporte de ensino para como utilizar melhor nossos serviços</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Conta do Usuário</h2>
              <p className="mb-4">
                Para usar nossos serviços, você deve:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Criar uma conta válida com informações precisas</li>
                <li>Manter a confidencialidade de suas credenciais de login</li>
                <li>Ser responsável por todas as atividades em sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Uso Aceitável</h2>
              <p className="mb-4">Você concorda em não:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Usar o serviço para atividades ilegais ou não autorizadas</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Transmitir vírus, malware ou código malicioso</li>
                <li>Tentar acessar sistemas ou dados não autorizados</li>
                <li>Interferir no funcionamento da plataforma</li>
                <li>Compartilhar conteúdo ofensivo, discriminatório ou inadequado</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Propriedade Intelectual</h2>
              <p className="mb-4">
                O CCS HUB e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade 
                exclusiva da empresa. Você mantém todos os direitos sobre seus criativos e conteúdo enviado.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Privacidade e Segurança</h2>
              <p className="mb-4">
                Sua privacidade é importante para nós. Nossa coleta e uso de informações pessoais 
                são regidos por nossa Política de Privacidade, que faz parte destes Termos de Uso.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Limitação de Responsabilidade</h2>
              <p className="mb-4">
                O CCS HUB é fornecido "como está" e "conforme disponível". Não garantimos que o serviço 
                será ininterrupto ou livre de erros. Em nenhuma circunstância seremos responsáveis por 
                danos indiretos, incidentais ou consequenciais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Modificações dos Termos</h2>
              <p className="mb-4">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                As modificações entrarão em vigor imediatamente após a publicação. 
                O uso continuado do serviço constitui aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Rescisão</h2>
              <p className="mb-4">
                Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio, 
                por qualquer motivo, incluindo violação destes Termos de Uso.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Lei Aplicável</h2>
              <p className="mb-4">
                Estes termos são regidos pelas leis do Brasil. Qualquer disputa será 
                resolvida nos tribunais competentes do Brasil.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contato</h2>
              <p className="mb-4">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através de:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Email: legal@ccshub.com</li>
                <li>Telefone: (11) 9999-9999</li>
                <li>Endereço: São Paulo, SP, Brasil</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">
                  Voltar para Home
                </Button>
              </Link>
              <Link href="/privacidade">
                <Button>
                  Política de Privacidade
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 