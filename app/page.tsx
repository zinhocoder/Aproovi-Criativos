"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Clock, FileCheck, Users, Star, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { UserMenu } from "@/components/user-menu"
import { FaqSection } from "@/components/faq-section"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { TutorialSection } from "@/components/tutorial-section"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { user, isAuthenticated } = useAuth()
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
          </nav>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <UserMenu user={user!} />
                <ThemeToggle />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button className="hidden sm:inline-flex">
                    Entrar
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" className="hidden sm:inline-flex">
                    Demonstração
                  </Button>
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <Badge className="w-fit bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/30">
                  Exclusivo para clientes CCS Company
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    CCS HUB: <span className="text-primary">Aprovação Simplificada</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Plataforma exclusiva da CCS Company para agilizar o processo de aprovação de criativos para nossos clientes.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="gap-2">
                      Entrar na Plataforma
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
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground ml-1">4.9/5</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl"></div>
                  <div className="relative bg-card border rounded-lg p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-muted-foreground">Aprovado</span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">Post Instagram - Campanha Verão</h3>
                        <p className="text-sm text-muted-foreground">Criativo aprovado em 2h</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>2h atrás</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>3 comentários</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="recursos" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Aprovação Simplificada</h3>
                  <p className="text-muted-foreground">
                    Aprove ou solicite ajustes em criativos com apenas alguns cliques. Interface intuitiva e rápida.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Comentários em Tempo Real</h3>
                  <p className="text-muted-foreground">
                    Comunique-se diretamente com nossa equipe através de comentários instantâneos nos criativos.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Histórico Completo</h3>
                  <p className="text-muted-foreground">
                    Acompanhe todo o processo de criação e aprovação com histórico detalhado de cada criativo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HowItWorksSection />

        <TutorialSection />

        <TestimonialsCarousel />

        <FaqSection />

        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-blue-950/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Seja nosso cliente
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Junte-se aos nossos clientes e tenha acesso exclusivo à plataforma CCS HUB para agilizar o processo de aprovação de seus criativos.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <a href="https://ccstudios.com.br/contato" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="gap-2">
                      Fale Conosco
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <Link href="/demo">
                    <Button size="lg" variant="outline">
                      Ver Demonstração
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-muted-foreground">Criativos aprovados</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">100+</div>
                    <div className="text-sm text-muted-foreground">Clientes ativos</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">24h</div>
                    <div className="text-sm text-muted-foreground">Tempo médio de aprovação</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">99%</div>
                    <div className="text-sm text-muted-foreground">Satisfação dos clientes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 py-12 lg:grid-cols-4">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground">
                Plataforma exclusiva da CCS Company para agilizar a aprovação de criativos.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Produto</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link href="#recursos" className="text-muted-foreground hover:text-foreground">
                  Recursos
                </Link>
                <Link href="#como-funciona" className="text-muted-foreground hover:text-foreground">
                  Como Funciona
                </Link>
                <Link href="#tutorial" className="text-muted-foreground hover:text-foreground">
                  Tutorial
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Suporte</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link href="#faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
                <Link href="/demo" className="text-muted-foreground hover:text-foreground">
                  Demonstração
                </Link>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  Entrar na Plataforma
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Legal</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link href="/termos" className="text-muted-foreground hover:text-foreground">
                  Termos de Uso
                </Link>
                <Link href="/privacidade" className="text-muted-foreground hover:text-foreground">
                  Política de Privacidade
                </Link>
              </nav>
            </div>
          </div>
          <div className="border-t py-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">
                © 2024 CCS Company. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
