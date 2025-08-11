"use client"

import type React from "react"
import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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

function RegisterContent() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accessKey, setAccessKey] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showAccessKey, setShowAccessKey] = useState(false)
  const [registerType, setRegisterType] = useState<"agency" | "client">("agency")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailValidation, setEmailValidation] = useState<{
    checking: boolean
    valid: boolean | null
    message: string
  }>({ checking: false, valid: null, message: "" })
  const [accessKeyValidation, setAccessKeyValidation] = useState<{
    checking: boolean
    valid: boolean | null
    message: string
  }>({ checking: false, valid: null, message: "" })

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { register, loading } = useAuth()
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const accessKeyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Ler parâmetros da URL para preenchimento automático
  useEffect(() => {
    const urlEmail = searchParams.get('email')
    const urlUserType = searchParams.get('userType') as 'agency' | 'client' | null
    
    if (urlEmail) {
      setEmail(urlEmail)
    }
    
    if (urlUserType && (urlUserType === 'agency' || urlUserType === 'client')) {
      setRegisterType(urlUserType)
      
      // Se for cliente e tiver e-mail, verificar automaticamente
      if (urlUserType === 'client' && urlEmail) {
        console.log('🔍 Verificação automática de e-mail:', urlEmail)
        // Usar setTimeout para garantir que o registerType seja atualizado primeiro
        setTimeout(() => {
          checkEmailForClient(urlEmail)
        }, 100)
      }
    }
  }, [searchParams])

  // Garantir que o e-mail do convite não seja alterado
  useEffect(() => {
    const urlEmail = searchParams.get('email')
    const urlUserType = searchParams.get('userType')
    
    if (urlEmail && urlUserType === 'client') {
      setEmail(urlEmail)
    }
  }, [searchParams])

  // Limpar timeout quando componente for desmontado
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current)
      }
      if (accessKeyTimeoutRef.current) {
        clearTimeout(accessKeyTimeoutRef.current)
      }
    }
  }, [])

  // Verificar se o e-mail está registrado em uma empresa (para clientes)
  const checkEmailForClient = async (email: string) => {
    if (!email) return

    console.log('🔍 Verificando e-mail:', email)
    setEmailValidation({ checking: true, valid: null, message: "" })

    try {
      console.log('📡 Chamando API para verificar e-mail...')
      const response = await apiService.verifyClientEmail(email)
      console.log('📊 Resposta da API:', response)
      
      if (response.success && response.data) {
        console.log('✅ E-mail válido!')
        setEmailValidation({
          checking: false,
          valid: true,
          message: `E-mail válido! Empresa: ${response.data.empresa}`
        })
      } else {
        console.log('❌ E-mail inválido')
        setEmailValidation({
          checking: false,
          valid: false,
          message: "Este e-mail não está registrado em nenhuma empresa. Entre em contato com sua agência para solicitar acesso."
        })
      }
    } catch (error) {
      console.error('❌ Erro ao verificar e-mail:', error)
      setEmailValidation({
        checking: false,
        valid: false,
        message: "Erro ao verificar e-mail. Tente novamente."
      })
    }
  }

  // Verificar chave de acesso para agências
  const checkAccessKeyForAgency = async (key: string) => {
    if (registerType !== 'agency' || !key) return

    setAccessKeyValidation({ checking: true, valid: null, message: "" })

    try {
      const response = await apiService.checkAgencyRegistration(key)
      
      if (response.success && response.available) {
        setAccessKeyValidation({
          checking: false,
          valid: true,
          message: "✅ Chave de acesso válida! Você pode prosseguir com o registro."
        })
      } else {
        setAccessKeyValidation({
          checking: false,
          valid: false,
          message: "Chave de acesso inválida. Verifique se digitou corretamente ou solicite uma nova chave."
        })
      }
    } catch (error) {
      setAccessKeyValidation({
        checking: false,
        valid: false,
        message: "Erro ao verificar chave de acesso. Tente novamente."
      })
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    
    // Se o usuário acessou via convite, não permitir alterar o e-mail
    if (searchParams.get('email') && searchParams.get('userType') === 'client') {
      const originalEmail = searchParams.get('email')
      if (newEmail !== originalEmail) {
        setEmail(originalEmail || '')
        toast({
          title: "E-mail não pode ser alterado",
          description: "O e-mail do convite não pode ser modificado.",
          variant: "destructive",
        })
        return
      }
    }
    
    setEmail(newEmail)
    
    // Limpar timeout anterior se existir
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current)
    }
    
    // Verificar e-mail para clientes após 1 segundo de inatividade
    if (registerType === 'client' && newEmail.includes('@')) {
      emailTimeoutRef.current = setTimeout(() => {
        checkEmailForClient(newEmail)
      }, 1000)
    }
  }

  const handleAccessKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value
    setAccessKey(newKey)
    
    // Reset validation when clearing the field
    if (!newKey.trim()) {
      setAccessKeyValidation({ checking: false, valid: null, message: "" })
      return
    }
    
    // Limpar timeout anterior se existir
    if (accessKeyTimeoutRef.current) {
      clearTimeout(accessKeyTimeoutRef.current)
    }
    
    // Verificar chave de acesso para agências após 1 segundo de inatividade
    if (registerType === 'agency' && newKey.length > 0) {
      accessKeyTimeoutRef.current = setTimeout(() => {
        checkAccessKeyForAgency(newKey)
      }, 1000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🚀 Iniciando registro:', { name, email, registerType, emailValidation, accessKeyValidation })

    if (!name || !email || !password || !confirmPassword) {
      console.log('❌ Campos obrigatórios não preenchidos')
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
      console.log('🔍 Verificando validação de e-mail para cliente:', emailValidation)
      
      if (emailValidation.valid === false) {
        console.log('❌ E-mail inválido para cliente')
        toast({
          title: "📧 E-mail não autorizado",
          description: "Este e-mail não está registrado em nenhuma empresa. Entre em contato com sua agência para solicitar acesso.",
          variant: "destructive",
        })
        return
      }
      
      if (emailValidation.valid === null) {
        console.log('⏳ E-mail ainda não foi verificado')
        toast({
          title: "⏳ Verificando e-mail",
          description: "Aguarde enquanto verificamos seu e-mail...",
          variant: "destructive",
        })
        return
      }
      
      console.log('✅ E-mail válido para cliente')
    }

    // Para agências, verificar se a chave de acesso é válida
    if (registerType === 'agency') {
      if (!accessKey.trim()) {
        toast({
          title: "🔐 Chave de acesso obrigatória",
          description: "Para registrar uma agência, você precisa de uma chave de acesso válida. Entre em contato com a administração.",
          variant: "destructive",
        })
        return
      }

      if (accessKeyValidation.valid === false) {
        toast({
          title: "❌ Chave de acesso inválida",
          description: "A chave de acesso fornecida não é válida. Verifique se digitou corretamente ou solicite uma nova chave.",
          variant: "destructive",
        })
        return
      }
      
      if (accessKeyValidation.valid === null) {
        toast({
          title: "⏳ Verificando chave de acesso",
          description: "Aguarde enquanto verificamos sua chave de acesso...",
          variant: "destructive",
        })
        return
      }
    }

    try {
      setIsSubmitting(true)
      
      // Garantir que o e-mail do convite seja usado
      const finalEmail = (searchParams.get('email') && searchParams.get('userType') === 'client') 
        ? searchParams.get('email')! 
        : email
      
      console.log('📤 Enviando registro para API:', { name, finalEmail, registerType, hasAccessKey: !!accessKey })
      
      await register(name, finalEmail, password, registerType, registerType === 'agency' ? accessKey : undefined)
      
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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-blue-50 dark:bg-blue-950/20">
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
          
          {/* Mensagem especial para convites */}
          {searchParams.get('email') && searchParams.get('userType') === 'client' && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                🎉 Você foi convidado para acessar a plataforma! Seu e-mail foi preenchido automaticamente.
              </AlertDescription>
            </Alert>
          )}
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
              defaultValue={searchParams.get('userType') || "agency"}
              onValueChange={(value) => {
                setRegisterType(value as "agency" | "client")
                setEmailValidation({ checking: false, valid: null, message: "" })
                setAccessKeyValidation({ checking: false, valid: null, message: "" })
                setAccessKey("")
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
                  <br />
                  <strong>🔐 Chave de acesso obrigatória - Entre em contato com a administração para obter sua chave.</strong>
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
                  disabled={isSubmitting || (searchParams.get('email') && searchParams.get('userType') === 'client')}
                  className={searchParams.get('email') && searchParams.get('userType') === 'client' ? 'bg-muted' : ''}
                />
                {searchParams.get('email') && searchParams.get('userType') === 'client' && (
                  <p className="text-sm text-muted-foreground">
                    🔒 E-mail do convite - não pode ser alterado
                  </p>
                )}
                
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

              {/* Campo de chave de acesso para agências */}
              {registerType === 'agency' && (
                <div className="space-y-2">
                  <Label htmlFor="accessKey">Chave de acesso</Label>
                  <div className="relative">
                                         <Input
                       id="accessKey"
                       type={showAccessKey ? "text" : "password"}
                       placeholder="Cole aqui a chave de acesso fornecida"
                       value={accessKey}
                       onChange={handleAccessKeyChange}
                       required
                       disabled={isSubmitting}
                     />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowAccessKey(!showAccessKey)}
                      disabled={isSubmitting}
                    >
                      {showAccessKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Validação de chave de acesso para agências */}
                  {accessKey && (
                    <div className="mt-2">
                      {accessKeyValidation.checking ? (
                        <Alert>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <AlertDescription>
                            Verificando chave de acesso...
                          </AlertDescription>
                        </Alert>
                      ) : accessKeyValidation.valid === true ? (
                        <Alert className="border-green-200 bg-green-50">
                          <AlertDescription className="text-green-800">
                            ✅ {accessKeyValidation.message}
                          </AlertDescription>
                        </Alert>
                      ) : accessKeyValidation.valid === false ? (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertDescription className="text-red-800">
                            ❌ {accessKeyValidation.message}
                          </AlertDescription>
                        </Alert>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

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
                disabled={
                  isSubmitting || 
                  loading || 
                  (registerType === 'client' && emailValidation.valid === false) ||
                  (registerType === 'agency' && accessKeyValidation.valid === false)
                }
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

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-blue-50 dark:bg-blue-950/20">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-md space-y-6 flex flex-col items-center">
          <Logo className="mb-8" />

          <Card className="w-full">
            <CardContent className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
