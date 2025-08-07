"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useCreatives } from "@/hooks/use-creatives"
import { useEmpresas } from "@/hooks/use-empresas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Image as ImageIcon, X } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const tiposCreativos = [
  { value: "post", label: "Post" },
  { value: "story", label: "Story" },
  { value: "carrossel", label: "Carrossel" },
  { value: "reels", label: "Reels" },
  { value: "motion", label: "Motion Graphics" },
  { value: "banner", label: "Banner" },
  { value: "video", label: "Vídeo" },
  { value: "outro", label: "Outro" },
]

export default function NovoCriativoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { uploadCreative, uploadMultipleCreative } = useCreatives()
  const { empresas, getEmpresasAtivas } = useEmpresas()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [titulo, setTitulo] = useState("")
  const [legenda, setLegenda] = useState("")
  const [tipoCreativo, setTipoCreativo] = useState("")
  const [empresaSelecionada, setEmpresaSelecionada] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // Pré-selecionar empresa da URL
  useEffect(() => {
    const empresaParam = searchParams.get('empresa')
    if (empresaParam && getEmpresasAtivas().find(e => e.id === empresaParam)) {
      setEmpresaSelecionada(empresaParam)
    }
  }, [searchParams, getEmpresasAtivas])

  const validateFile = (file: File): boolean => {
    // Validar tipo de arquivo
    const allowedTypes = ['image/', 'video/']
    const isValidType = allowedTypes.some(type => file.type.startsWith(type))
    
    if (!isValidType) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem ou vídeo.",
        variant: "destructive",
      })
      return false
    }

    // Validar tamanho do arquivo (máximo 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, selecione um arquivo menor que 50MB.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(validateFile)
    
    if (validFiles.length === 0) return

    // Para carrosséis, permitir múltiplos arquivos
    const isMultipleAllowed = tipoCreativo === "carrossel"
    
    // Se múltiplos arquivos foram selecionados, mas tipo não é carrossel, perguntar se quer mudar
    if (!isMultipleAllowed && validFiles.length > 1) {
      if (!tipoCreativo) {
        // Se tipo não foi selecionado ainda, sugerir carrossel
        toast({
          title: "Múltiplos arquivos detectados",
          description: "Selecionando tipo 'Carrossel' automaticamente para múltiplos arquivos.",
        })
        setTipoCreativo("carrossel")
      } else {
        toast({
          title: "Múltiplos arquivos não permitidos",
          description: "Para este tipo de criativo, selecione apenas um arquivo. Para múltiplos arquivos, use o tipo 'Carrossel'.",
          variant: "destructive",
        })
        return
      }
    }

    // Recalcular se múltiplos são permitidos após possível mudança de tipo
    const finalIsMultipleAllowed = tipoCreativo === "carrossel" || (!tipoCreativo && validFiles.length > 1)

    // Limitar a 10 arquivos para carrosséis
    if (finalIsMultipleAllowed && (selectedFiles.length + validFiles.length) > 10) {
      toast({
        title: "Muitos arquivos",
        description: "Máximo de 10 arquivos permitidos para carrosséis.",
        variant: "destructive",
      })
      return
    }

    const newFiles = finalIsMultipleAllowed ? [...selectedFiles, ...validFiles] : validFiles
    setSelectedFiles(newFiles)

    // Criar previews para todos os arquivos
    const newPreviews: string[] = []
    let processedCount = 0

    newFiles.forEach((file, index) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews[index] = reader.result as string
        processedCount++
        
        if (processedCount === newFiles.length) {
          setPreviewUrls(newPreviews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      processFiles(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processFiles(files)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previewUrls.filter((_, i) => i !== index)
    
    setSelectedFiles(newFiles)
    setPreviewUrls(newPreviews)
    
    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAllFiles = () => {
    setSelectedFiles([])
    setPreviewUrls([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedFiles.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione pelo menos uma imagem ou vídeo para upload.",
        variant: "destructive",
      })
      return
    }

    if (!titulo.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, digite um título para o criativo.",
        variant: "destructive",
      })
      return
    }

    if (!tipoCreativo) {
      toast({
        title: "Tipo de criativo obrigatório",
        description: "Por favor, selecione o tipo de criativo.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Para múltiplos arquivos, usar upload múltiplo
      if (selectedFiles.length > 1) {
        await uploadMultipleCreative(selectedFiles, legenda, tipoCreativo, titulo, empresaSelecionada === "none" ? undefined : empresaSelecionada || undefined)
      } else {
        // Upload único
        await uploadCreative(selectedFiles[0], titulo, legenda, tipoCreativo, empresaSelecionada === "none" ? undefined : empresaSelecionada || undefined)
      }
      
      router.push('/dashboard/criativos')
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      // O erro já é tratado no hook useCreatives
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/criativos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Criativo</h1>
          <p className="text-muted-foreground">Faça upload de um novo criativo para revisão.</p>
        </div>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload de Criativo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Area */}
              <div className="space-y-4">
                <div>
                  <Label>Arquivo do Criativo</Label>
                  <div
                    className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragOver
                        ? 'border-primary bg-primary/5'
                        : previewUrls.length > 0
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple={tipoCreativo === "carrossel"}
                    />
                    
                    {previewUrls.length > 0 ? (
                      <div className="space-y-4">
                        {/* Múltiplos arquivos para carrossel */}
                        {selectedFiles.length > 1 ? (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {selectedFiles.length} arquivos selecionados
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeAllFiles()
                                }}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Remover todos
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                              {previewUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                    {selectedFiles[index]?.type.startsWith('image/') ? (
                                      <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <video
                                        src={url}
                                        className="w-full h-full object-cover"
                                        muted
                                      />
                                    )}
                                  </div>
                                  <div className="absolute top-1 left-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {index + 1}
                                    </Badge>
        </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeFile(index)
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* Arquivo único */
                          <div className="relative">
                            {selectedFiles[0]?.type.startsWith('image/') ? (
                              <img
                                src={previewUrls[0]}
                                alt="Preview"
                                className="max-w-full max-h-48 mx-auto rounded-lg"
                              />
                            ) : (
                              <video
                                src={previewUrls[0]}
                                className="max-w-full max-h-48 mx-auto rounded-lg"
                                controls
                              />
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeFile(0)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <div className="mt-2 text-sm text-gray-600 text-center">
                              {selectedFiles[0]?.name}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          {isDragOver ? 'Solte os arquivos aqui' : 'Arraste e solte ou clique para selecionar'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {tipoCreativo === "carrossel" 
                            ? "Múltiplas imagens ou vídeos até 50MB cada (máx. 10 arquivos)"
                            : "Imagem ou vídeo até 50MB"
                          }
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF, WebP, MP4, MOV
                        </p>
                      </div>
                    )}
                  </div>
        </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Criativo *</Label>
                  <Select value={tipoCreativo} onValueChange={setTipoCreativo}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o tipo de criativo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposCreativos.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
        </div>

              {/* Informações do Criativo */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título do Criativo *</Label>
                  <Input
                    id="titulo"
                    placeholder="Digite o título do criativo..."
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Título que identificará este criativo
                  </p>
        </div>

                <div>
                  <Label htmlFor="legenda">Legenda / Copy</Label>
                  <Textarea
                    id="legenda"
                    placeholder="Digite a legenda ou copy que será utilizada..."
                    value={legenda}
                    onChange={(e) => setLegenda(e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Adicione o texto que acompanhará este criativo
                  </p>
                </div>

                                <div>
                  <Label htmlFor="empresa">Empresa</Label>
                  <Select value={empresaSelecionada} onValueChange={setEmpresaSelecionada}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione uma empresa (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem empresa específica</SelectItem>
                      {getEmpresasAtivas().map((empresa) => (
                        <SelectItem key={empresa.id} value={empresa.id}>
                          {empresa.nome}
                          <span className="text-muted-foreground ml-2">
                            ({empresa._count.creatives} criativos)
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selecione a empresa para organizar os criativos
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Informações do Upload</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Título:</strong> {titulo || 'Não informado'}</p>
                    <p><strong>Arquivos:</strong> {selectedFiles.length > 0 ? `${selectedFiles.length} arquivo(s) selecionado(s)` : 'Nenhum arquivo selecionado'}</p>
                    {selectedFiles.length > 0 && (
                      <p><strong>Tamanho total:</strong> {(selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB</p>
                    )}
                    <p><strong>Tipo:</strong> {tipoCreativo ? tiposCreativos.find(t => t.value === tipoCreativo)?.label : '-'}</p>
                    <p><strong>Empresa:</strong> {empresaSelecionada && empresaSelecionada !== "none" ? getEmpresasAtivas().find(e => e.id === empresaSelecionada)?.nome : 'Sem empresa específica'}</p>
                    <p><strong>Legenda:</strong> {legenda ? `${legenda.length} caracteres` : 'Não informada'}</p>
                    {selectedFiles.length > 1 && (
                      <div className="mt-2">
                        <strong>Sequência:</strong>
                        <div className="mt-1 space-y-1">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="text-xs">
                              {index + 1}. {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
        </div>

            <div className="flex gap-4">
              <Button
          type="submit"
                disabled={selectedFiles.length === 0 || !tipoCreativo || !titulo.trim() || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Enviar Criativo
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/criativos')}
          disabled={isSubmitting}
        >
                Cancelar
              </Button>
            </div>
      </form>
        </CardContent>
      </Card>
    </div>
  )
}
