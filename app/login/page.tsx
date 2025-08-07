"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginType, setLoginType] = useState<"agency" | "client">("agency")
  const router = useRouter()
  const { toast } = useToast()
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    try {
      await login(email, password, loginType)
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo de volta! Você entrou como ${loginType === "agency" ? "agência" : "cliente"}.`,
      })
      
      // O redirecionamento é feito automaticamente no hook useAuth
    } catch (error) {
      console.error('Erro no login:', error)
      // O erro já é tratado no hook useAuth
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-violet-50 dark:bg-violet-950/20">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-sm space-y-6 flex flex-col items-center">
        <Logo className="mb-8" />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground text-sm">Entre com suas credenciais para acessar a plataforma</p>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm w-full">
          <Tabs
            defaultValue="agency"
            onValueChange={(value) => setLoginType(value as "agency" | "client")}
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
                Como cliente, você terá acesso apenas aos criativos que precisam de sua aprovação. Você poderá
                visualizar, comentar, aprovar ou solicitar ajustes nos materiais.
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="/recuperar-senha" className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                `Entrar como ${loginType === "agency" ? "Agência" : "Cliente"}`
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Credenciais de demonstração:
              <br />
              Email: demo@aproovi.com
              <br />
              Senha: demo123
            </p>
          </div>

          <div className="mt-6 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Criar conta
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <Link href="/demo" className="text-sm text-primary hover:underline">
            Experimente nossa demonstração interativa
          </Link>
        </div>
      </div>
    </div>
  )
}
