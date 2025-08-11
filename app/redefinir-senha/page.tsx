"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiService } from "@/lib/api"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const token = searchParams.get('token')

  // Validar token ao carregar a página
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false)
        setIsValidToken(false)
        return
      }

      try {
        const response = await apiService.validateResetToken(token)
        setIsValidToken(response.success)
      } catch (error) {
        console.error('Erro ao validar token:', error)
        setIsValidToken(false)
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
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

    try {
      setIsSubmitting(true)
      
      const response = await apiService.resetPassword(token!, password)
      
      if (response.success) {
        setPasswordReset(true)
        toast({
          title: "Senha redefinida",
          description: "Sua senha foi alterada com sucesso!",
        })
      } else {
        toast({
          title: "Erro",
          description: response.message || "Erro ao redefinir senha.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error)
      toast({
        title: "Erro",
        description: "Erro ao redefinir senha. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isValidating) {
    return (
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
                <span>Validando link...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (passwordReset) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-blue-50 dark:bg-blue-950/20">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-md space-y-6 flex flex-col items-center">
          <Logo className="mb-8" />

          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Senha redefinida!</CardTitle>
              <CardDescription>
                Sua senha foi alterada com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Você já pode fazer login com sua nova senha.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={() => router.push('/login')} 
                className="w-full"
              >
                Ir para o login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
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
            <CardHeader>
              <CardTitle>Link inválido</CardTitle>
              <CardDescription>
                Este link de recuperação é inválido ou expirou
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  O link de recuperação não é válido ou já expirou. 
                  Solicite um novo link de recuperação.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={() => router.push('/recuperar-senha')} 
                className="w-full"
              >
                Solicitar novo link
              </Button>
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
          <h1 className="text-2xl font-bold">Redefinir senha</h1>
          <p className="text-muted-foreground text-sm">
            Digite sua nova senha
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Nova senha</CardTitle>
            <CardDescription>
              Digite sua nova senha e confirme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redefinindo...
                  </>
                ) : (
                  "Redefinir senha"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 