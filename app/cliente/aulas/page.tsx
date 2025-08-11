"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, PlayCircle, Lock, BookOpen, Clock, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAulas } from "@/hooks/use-aulas"

interface Video {
  id: string
  title: string
  description: string
  youtubeId: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
}

export default function AulasPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const { toast } = useToast()
  const { 
    modules, 
    loading, 
    markVideoAsCompleted, 
    getTotalProgress, 
    getCompletedVideosCount, 
    getTotalVideosCount
  } = useAulas()

  const handleVideoComplete = (moduleId: string, videoId: string) => {
    markVideoAsCompleted(moduleId, videoId)
    toast({
      title: "Aula concluída!",
      description: "Parabéns! Você completou mais uma aula.",
    })
  }

  const handleVideoClick = (video: Video) => {
    if (video.isLocked) {
      toast({
        title: "Aula bloqueada",
        description: "Complete as aulas anteriores para desbloquear esta.",
        variant: "destructive",
      })
      return
    }
    setSelectedVideo(video)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalProgress = getTotalProgress()
  const completedVideos = getCompletedVideosCount()
  const totalVideos = getTotalVideosCount()

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Aulas CCS HUB</h1>
          <p className="text-muted-foreground">
            Aprenda a usar nossa plataforma de forma eficiente
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round(totalProgress)}%
            </div>
            <div className="text-sm text-muted-foreground">Progresso Geral</div>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Award className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso Geral</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {completedVideos} de {totalVideos} aulas concluídas
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="grid gap-6">
        {modules.map((module, moduleIndex) => (
          <Card key={module.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Módulo {moduleIndex + 1}: {module.title}</CardTitle>
                    {module.isCompleted && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-base">{module.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(module.progress)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {module.videos.filter(v => v.isCompleted).length}/{module.videos.length} aulas
                  </div>
                </div>
              </div>
              <Progress value={module.progress} className="h-2 mt-4" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {module.videos.map((video, videoIndex) => (
                  <div
                    key={video.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                      video.isCompleted ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 
                      video.isLocked ? 'bg-muted border-border' : 'bg-background border-border'
                    }`}
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="flex-shrink-0">
                      {video.isCompleted ? (
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      ) : video.isLocked ? (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <PlayCircle className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">
                          {videoIndex + 1}. {video.title}
                        </h3>
                        {video.isCompleted && (
                          <Badge variant="secondary" className="text-xs">
                            Concluído
                          </Badge>
                        )}
                        {video.isLocked && (
                          <Badge variant="outline" className="text-xs">
                            Bloqueado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {video.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {video.duration}
                        </div>
                        {video.isCompleted && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Concluído
                          </div>
                        )}
                      </div>
                    </div>

                    {!video.isLocked && !video.isCompleted && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVideoClick(video)
                        }}
                      >
                        Assistir
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVideo(null)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Descrição</h4>
                  <p className="text-muted-foreground">{selectedVideo.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Duração: {selectedVideo.duration}
                  </span>
                </div>
                {!selectedVideo.isCompleted && (
                  <Button
                    onClick={() => {
                      handleVideoComplete(
                        modules.find(m => m.videos.some(v => v.id === selectedVideo.id))?.id || "",
                        selectedVideo.id
                      )
                      setSelectedVideo(null)
                    }}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Concluída
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 