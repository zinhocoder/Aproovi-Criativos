"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Upload, Building2 } from "lucide-react"
import { useEmpresas } from "@/hooks/use-empresas"
import { useToast } from "@/hooks/use-toast"

export default function EditarEmpresaPage() {
  const params = useParams()
  const router = useRouter()
  const empresaId = params.id as string
  const { empresas, updateEmpresa, loading } = useEmpresas()
  const { toast } = useToast()

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const empresa = empresas.find(e => e.id === empresaId)

  useEffect(() => {
    if (empresa) {
      setNome(empresa.nome)
      setDescricao(empresa.descricao || "")
      if (empresa.logo) {
        setPreviewUrl(empresa.logo)
      }
    }
  }, [empresa])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
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

    setIsSubmitting(true)

    try {
      await updateEmpresa(empresaId, {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        logo: logo || undefined,
      })
      
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso!",
      })
      
      router.push(`/dashboard/empresas/${empresaId}`)
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/empresas/${empresaId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/empresas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Empresa não encontrada</h1>
            <p className="text-muted-foreground">A empresa que você está tentando editar não existe.</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Empresa não encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              A empresa com ID "{empresaId}" não foi encontrada ou foi removida.
            </p>
            <Link href="/dashboard/empresas">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Empresas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/empresas/${empresaId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar {empresa.nome}</h1>
          <p className="text-muted-foreground">Atualize as informações da empresa.</p>
        </div>
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
                    <Label>E-mail do Cliente</Label>
                    <Input
                      value={empresa.clienteEmail}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      O e-mail do cliente não pode ser alterado após a criação da empresa
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
                        <p className="text-sm text-muted-foreground">{logo?.name || "Logo atual"}</p>
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
          <Link href={`/dashboard/empresas/${empresaId}`}>
            <Button variant="outline" type="button" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting || !nome.trim()}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  )
}