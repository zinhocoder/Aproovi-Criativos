"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEmpresas } from "@/hooks/use-empresas"
import { useToast } from "@/hooks/use-toast"

export default function NovaEmpresaPage() {
  const router = useRouter()
  const { createEmpresa } = useEmpresas()
  const { toast } = useToast()

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [clienteEmail, setClienteEmail] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
      // Criar URL de preview local
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, digite o nome da empresa.",
        variant: "destructive",
      })
      return
    }

    if (!clienteEmail.trim()) {
      toast({
        title: "E-mail do cliente obrigatório",
        description: "Por favor, digite o e-mail do cliente da empresa.",
        variant: "destructive",
      })
      return
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(clienteEmail)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, digite um e-mail válido.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createEmpresa(nome.trim(), descricao.trim() || undefined, clienteEmail.trim(), logo || undefined)
      router.push("/dashboard/empresas")
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/empresas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Nova Empresa</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2 max-w-6xl">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Empresa *</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Drive Experience"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                    <p className="text-sm text-muted-foreground">
                      Nome que identificará a empresa no sistema
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição (opcional)</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva a empresa e seus objetivos..."
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      rows={4}
                      disabled={isSubmitting}
                    />
                    <p className="text-sm text-muted-foreground">
                      Informações adicionais sobre a empresa
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clienteEmail">E-mail do Cliente *</Label>
                    <Input
                      id="clienteEmail"
                      type="email"
                      placeholder="cliente@empresa.com"
                      value={clienteEmail}
                      onChange={(e) => setClienteEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                    <p className="text-sm text-muted-foreground">
                      O cliente receberá um convite neste e-mail para acessar o dashboard
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logo da Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
                    {previewUrl ? (
                      <div className="space-y-4 w-full">
                        <img
                          src={previewUrl}
                          alt="Preview da logo"
                          className="mx-auto max-h-[200px] object-contain rounded-lg"
                        />
                        <p className="text-sm text-muted-foreground">{logo?.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setLogo(null)
                            setPreviewUrl(null)
                          }}
                          disabled={isSubmitting}
                        >
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Arraste e solte ou clique para fazer upload</p>
                          <p className="text-xs text-muted-foreground">Suporta JPG, PNG ou GIF até 5MB</p>
                          <Label htmlFor="logo" className="cursor-pointer">
                            <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium inline-block">
                              Selecionar arquivo
                            </div>
                            <Input
                              id="logo"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleLogoChange}
                              disabled={isSubmitting}
                            />
                          </Label>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Logo opcional que aparecerá nos relatórios (em desenvolvimento)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link href="/dashboard/empresas">
            <Button variant="outline" type="button" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting || !nome.trim()}>
            {isSubmitting ? "Criando..." : "Criar Empresa"}
          </Button>
        </div>
      </form>
    </div>
  )
}
