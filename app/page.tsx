"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Clock, FileCheck, Users, Star, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { FaqSection } from "@/components/faq-section"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { TutorialSection } from "@/components/tutorial-section"
import { PricingSection } from "@/components/pricing-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex gap-6">
            <Link href="#recursos" className="text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </Link>
            <Link href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </Link>
            <Link href="#tutorial" className="text-muted-foreground hover:text-foreground transition-colors">
              Tutorial
            </Link>
            <Link href="#depoimentos" className="text-muted-foreground hover:text-foreground transition-colors">
              Depoimentos
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
            <Link href="#planos" className="text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Entrar
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" className="hidden sm:inline-flex">
                Demonstração
              </Button>
            </Link>
            <Link href="/register">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-violet-50 to-background dark:from-violet-950/20 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <Badge className="w-fit bg-violet-100 text-violet-800 hover:bg-violet-100 mb-2 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/30">
                  Novo: Comentários em tempo real
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Aprovação de criativos <span className="text-primary">simplificada</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Agilize o processo de aprovação de conteúdo para redes sociais com nossa plataforma intuitiva.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-2">
                      Começar Grátis
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button size="lg" variant="outline">
                      Ver Demonstração
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=32&width=32&text=${i}`}
                          alt={`User ${i}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">+2.500 clientes satisfeitos</span>
                </div>
              </div>
              <div className="flex items-center justify-center relative mt-8 lg:mt-0">
                <div className="relative w-full max-w-[500px]">
                  <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg z-10 max-w-[220px] hidden sm:block">
                    <div className="flex mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm">Eu sempre procurei por uma ferramenta como essa! 😍</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden border shadow-xl">
                    <div className="bg-gray-800 h-6 w-full flex items-center px-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-primary font-bold text-xl">Aproovi</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">app.aproovi.com.br</div>
                      </div>
                      <div className="border dark:border-gray-700 rounded-lg p-4 mb-4">
                        <div className="font-medium mb-2">Planejamento de Janeiro</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total: 4 itens</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">2 itens aguardando feedback</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                          <div className="bg-primary h-2 rounded-full w-1/2"></div>
                        </div>

                        <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-2 mb-3 flex items-center">
                          <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm text-green-800 dark:text-green-300">Item aprovado!</span>
                        </div>

                        <div className="border dark:border-gray-700 rounded-md p-2">
                          <div className="text-sm mb-1">Item: Post #02 carrossel</div>
                          <div className="bg-gray-200 dark:bg-gray-700 h-20 w-full rounded-md"></div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="text-xs h-8 rounded-full bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900/30"
                        >
                          Solicitar ajuste
                        </Button>
                        <Button className="text-xs h-8 rounded-full">Aprovar material</Button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -left-8 top-1/4 h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg hidden sm:flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M23 7 16 12 23 17 23 7z" />
                      <rect width="15" height="14" x="1" y="5" rx="2" />
                    </svg>
                  </div>

                  <div className="absolute -right-6 bottom-1/4 h-12 w-12 rounded-full bg-blue-400 flex items-center justify-center shadow-lg hidden sm:flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>

                  <div className="absolute -left-4 bottom-1/3 h-12 w-12 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center shadow-lg hidden sm:flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="recursos" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Recursos</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tudo o que você precisa para gerenciar e aprovar criativos de social media.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="grid gap-1 text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">Aprovação Simplificada</h3>
                <p className="text-muted-foreground">Aprove ou reprove criativos com apenas um clique.</p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">Múltiplos Clientes</h3>
                <p className="text-muted-foreground">Organize seus criativos por cliente de forma eficiente.</p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">Histórico Completo</h3>
                <p className="text-muted-foreground">Acompanhe todas as alterações e aprovações realizadas.</p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">Feedback Detalhado</h3>
                <p className="text-muted-foreground">Receba comentários específicos em cada elemento do criativo.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona">
          <HowItWorksSection />
        </section>

        <section id="tutorial">
          <TutorialSection />
        </section>

        <section id="depoimentos">
          <TestimonialsCarousel />
        </section>

        <section id="planos">
          <PricingSection />
        </section>

        <section id="faq">
          <FaqSection />
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-violet-50 dark:bg-violet-950/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Pronto para simplificar suas aprovações?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Comece a usar nossa plataforma hoje mesmo e agilize o processo de aprovação de criativos.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Começar Grátis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline">
                    Ver Demonstração
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div className="space-y-4">
              <Logo className="h-8" />
              <p className="text-sm text-muted-foreground max-w-[300px]">
                Plataforma de aprovação de criativos para agências de marketing.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Produto</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#recursos" className="text-sm text-muted-foreground hover:text-foreground">
                      Recursos
                    </Link>
                  </li>
                  <li>
                    <Link href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground">
                      Como Funciona
                    </Link>
                  </li>
                  <li>
                    <Link href="#planos" className="text-sm text-muted-foreground hover:text-foreground">
                      Planos
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Empresa</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Sobre Nós
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Carreiras
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Suporte</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      Contato
                    </Link>
                  </li>
                  <li>
                    <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="#tutorial" className="text-sm text-muted-foreground hover:text-foreground">
                      Tutorial
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-muted-foreground">© 2024 Aproovi. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                Termos de Serviço
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
