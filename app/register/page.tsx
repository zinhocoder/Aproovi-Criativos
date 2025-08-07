"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiService } from "@/lib/api"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerType, setRegisterType] = useState<"agency" | "client">("agency")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailValidation, setEmailValidation] = useState<{
    checking: boolean
    valid: boolean | null
    message: string
  }>({ checking: false, valid: null, message: "" })

  const router = useRouter()
  const { toast } = useToast()
  const { register, loading } = useAuth()

  // Verificar se o e-mail está registrado em uma empresa (para clientes)
  const checkEmailForClient = async (email: string) => {
    if (registerType !== 'client' || !email) return

    setEmailValidation({ checking: true, valid: null, message: "" })

    try {
      const response = await apiService.verifyClientEmail(email)
      
      if (response.success && response.data) {
        setEmailValidation({
          checking: false,
          valid: true,
          message: `E-mail válido! Empresa: ${response.data.empresa}`
        })
      } else {
        setEmailValidation({
          checking: false,
          valid: false,
          message: "Este e-mail não está registrado em nenhuma empresa. Entre em contato com sua agência."
        })
      }
    } catch (error) {
      setEmailValidation({
        checking: false,
        valid: false,
        message: "Erro ao verificar e-mail. Tente novamente."
      })
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    
    // Verificar e-mail para clientes após 1 segundo de inatividade
    if (registerType === 'client' && newEmail.includes('@')) {
      const timeoutId = setTimeout(() => {
        checkEmailForClient(newEmail)
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas devem ser idênticas.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    // Para clientes, verificar se o e-mail é válido
    if (registerType === 'client') {
      if (emailValidation.valid === false) {
        toast({
          title: "E-mail não autorizado",
          description: emailValidation.message,
          variant: "destructive",
        })
        return
      }
      
      if (emailValidation.valid === null) {
        toast({
          title: "Verificando e-mail",
          description: "Aguarde a verificação do e-mail.",
          variant: "destructive",
        })
        return
      }
    }

    try {
      setIsSubmitting(true)
      
      // Salvar o tipo de usuário no localStorage
      localStorage.setItem("userType", registerType)
      
      await register(name, email, password)
      
      toast({
        title: "Conta criada com sucesso",
        description: `Bem-vindo! Sua conta de ${registerType === "agency" ? "agência" : "cliente"} foi criada.`,
      })
      
      // O redirecionamento é feito automaticamente no hook useAuth
    } catch (error) {
      console.error('Erro no registro:', error)
      // O erro já é tratado no hook useAuth
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-violet-50 dark:bg-violet-950/20">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-md space-y-6 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/login')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Login
          </Button>
        </div>

        <Logo className="mb-8" />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="text-muted-foreground text-sm">Preencha os dados para criar sua conta</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Escolha o tipo de conta que deseja criar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="agency"
              onValueChange={(value) => {
                setRegisterType(value as "agency" | "client")
                setEmailValidation({ checking: false, valid: null, message: "" })
              }}
              className="w-full mb-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="agency">Agência</TabsTrigger>
                <TabsTrigger value="client">Cliente</TabsTrigger>
              </TabsList>

              <TabsContent value="agency">
                <div className="text-sm text-muted-foreground mb-4 p-2 bg-muted/50 rounded-md">
                  Como agência, você terá acesso completo à plataforma, incluindo gerenciamento de empresas, criativos,
                  calendário e relatórios.
                </div>
              </TabsContent>

              <TabsContent value="client">
                <div className="text-sm text-muted-foreground mb-4 p-2 bg-muted/50 rounded-md">
                  Como cliente, você terá acesso apenas aos criativos que precisam de sua aprovação. 
                  <strong> Seu e-mail deve estar registrado em uma empresa.</strong>
                </div>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  disabled={isSubmitting}
                />
                
                {/* Validação de e-mail para clientes */}
                {registerType === 'client' && email && (
                  <div className="mt-2">
                    {emailValidation.checking ? (
                      <Alert>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <AlertDescription>
                          Verificando e-mail...
                        </AlertDescription>
                      </Alert>
                    ) : emailValidation.valid === true ? (
                      <Alert className="border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">
                          ✅ {emailValidation.message}
                        </AlertDescription>
                      </Alert>
                    ) : emailValidation.valid === false ? (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">
                          ❌ {emailValidation.message}
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loading || (registerType === 'client' && emailValidation.valid === false)}
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login" className="text-primary hover:underline">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
