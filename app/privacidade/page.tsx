"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"

export default function PrivacidadePage() {
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
            <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p className="mb-4">
                O CCS HUB está comprometido em proteger sua privacidade. Esta Política de Privacidade 
                explica como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando 
                você usa nossa plataforma de aprovação de criativos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Informações Pessoais</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Informações da empresa (para agências)</li>
                <li>Dados de contato</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Informações de Uso</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Logs de acesso e atividade</li>
                <li>Dados de navegação e interação</li>
                <li>Informações sobre dispositivos e navegadores</li>
                <li>Cookies e tecnologias similares</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.3 Conteúdo do Usuário</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Criativos e arquivos enviados</li>
                <li>Comentários e feedback</li>
                <li>Dados de aprovação e rejeição</li>
                <li>Comunicações entre usuários</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Como Usamos suas Informações</h2>
              <p className="mb-4">Utilizamos suas informações para:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Fornecer e manter nossos serviços</li>
                <li>Processar aprovações e feedback</li>
                <li>Facilitar a comunicação entre agências e clientes</li>
                <li>Melhorar e personalizar a experiência do usuário</li>
                <li>Enviar notificações importantes sobre o serviço</li>
                <li>Detectar e prevenir fraudes e abusos</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Informações</h2>
              <p className="mb-4">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                exceto nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Com seu consentimento explícito</li>
                <li>Para fornecer serviços solicitados (ex: entre agência e cliente)</li>
                <li>Com prestadores de serviços que nos ajudam a operar a plataforma</li>
                <li>Quando exigido por lei ou processo legal</li>
                <li>Para proteger nossos direitos e segurança</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Segurança dos Dados</h2>
              <p className="mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares e seguros</li>
                <li>Treinamento da equipe em práticas de segurança</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Retenção de Dados</h2>
              <p className="mb-4">
                Mantemos suas informações pelo tempo necessário para:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Fornecer nossos serviços</li>
                <li>Cumprir obrigações legais</li>
                <li>Resolver disputas</li>
                <li>Fazer cumprir nossos acordos</li>
              </ul>
              <p className="mb-4">
                Quando você exclui sua conta, seus dados pessoais são removidos, mas podemos 
                manter algumas informações por períodos específicos para fins legais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Seus Direitos</h2>
              <p className="mb-4">Você tem os seguintes direitos:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Acesso:</strong> Solicitar informações sobre dados que temos sobre você</li>
                <li><strong>Correção:</strong> Solicitar correção de dados imprecisos</li>
                <li><strong>Exclusão:</strong> Solicitar a exclusão de seus dados pessoais</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados</li>
                <li><strong>Limitação:</strong> Solicitar limitação do processamento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Cookies e Tecnologias Similares</h2>
              <p className="mb-4">
                Utilizamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Manter você logado</li>
                <li>Lembrar suas preferências</li>
                <li>Analisar o uso da plataforma</li>
                <li>Melhorar nossos serviços</li>
              </ul>
              <p className="mb-4">
                Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Transferências Internacionais</h2>
              <p className="mb-4">
                Seus dados podem ser processados em países diferentes do seu. Quando isso acontece, 
                garantimos que as transferências são feitas com proteções adequadas e em conformidade 
                com as leis de proteção de dados aplicáveis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Menores de Idade</h2>
              <p className="mb-4">
                Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente 
                informações pessoais de menores de idade. Se você é pai ou responsável e acredita que 
                seu filho nos forneceu informações pessoais, entre em contato conosco.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Alterações nesta Política</h2>
              <p className="mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre 
                mudanças significativas por e-mail ou através de um aviso em nossa plataforma. 
                O uso continuado dos serviços após as mudanças constitui aceitação da nova política.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contato</h2>
              <p className="mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, 
                entre em contato conosco:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Email:</strong> privacidade@ccshub.com</li>
                <li><strong>Telefone:</strong> (11) 9999-9999</li>
                <li><strong>Endereço:</strong> São Paulo, SP, Brasil</li>
                <li><strong>Encarregado de Dados (DPO):</strong> dpo@ccshub.com</li>
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
              <Link href="/termos">
                <Button>
                  Termos de Uso
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 