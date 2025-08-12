"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Construction, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UnderDevelopmentProps {
  title?: string
  description?: string
  showBackButton?: boolean
  showHomeButton?: boolean
}

export function UnderDevelopment({ 
  title = "Em Desenvolvimento", 
  description = "Esta funcionalidade está sendo desenvolvida e estará disponível em breve.",
  showBackButton = true,
  showHomeButton = true
}: UnderDevelopmentProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Construction className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            {showBackButton && (
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            )}
            {showHomeButton && (
              <Button asChild className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 