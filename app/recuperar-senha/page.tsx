"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiService } from "@/lib/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "E-mail obrigatório",
        description: "Por favor, informe seu e-mail.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const response = await apiService.forgotPassword(email)
      
      if (response.success) {
        setEmailSent(true)
        toast({
          title: "E-mail enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        })
      } else {
        toast({
          title: "Erro",
          description: response.message || "Erro ao enviar e-mail de recuperação.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error)
      toast({
        title: "Erro",
        description: "Erro ao enviar e-mail de recuperação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (emailSent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-blue-50 dark:bg-blue-950/20">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-md space-y-6 flex flex-col items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Login
          </Button>

          <Logo className="mb-8" />

          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>E-mail enviado!</CardTitle>
              <CardDescription>
                Enviamos um link de recuperação para <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Verifique sua caixa de entrada e clique no link para redefinir sua senha. 
                  Se não encontrar o e-mail, verifique também a pasta de spam.
                </AlertDescription>
              </Alert>
              
              <div className="text-center text-sm text-muted-foreground">
                Não recebeu o e-mail?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => setEmailSent(false)}
                >
                  Tentar novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-blue-50 dark:bg-blue-950/20">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-md space-y-6 flex flex-col items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Login
        </Button>

        <Logo className="mb-8" />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Recuperar senha</h1>
          <p className="text-muted-foreground text-sm">
            Digite seu e-mail e enviaremos um link para redefinir sua senha
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recuperação de senha</CardTitle>
            <CardDescription>
              Informe o e-mail da sua conta para receber instruções de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar e-mail de recuperação"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Lembrou sua senha?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Voltar ao login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 