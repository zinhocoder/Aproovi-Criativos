import { useState, useEffect } from 'react'

interface Video {
  id: string
  title: string
  description: string
  youtubeId: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
}

interface Module {
  id: string
  title: string
  description: string
  videos: Video[]
  isCompleted: boolean
  progress: number
}

export function useAulas() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar progresso das aulas do localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedProgress = localStorage.getItem('ccs-hub-aulas-progress')
        if (savedProgress) {
          try {
            setModules(JSON.parse(savedProgress))
          } catch (error) {
            console.error('Erro ao carregar progresso das aulas:', error)
            initializeModules()
          }
        } else {
          initializeModules()
        }
        setLoading(false)
      }
    } catch (error) {
      console.error('Erro geral no hook useAulas:', error)
      setLoading(false)
    }
  }, [])

  const initializeModules = () => {
    const initialModules: Module[] = [
      {
        id: "1",
        title: "Introdução ao CCS HUB",
        description: "Aprenda os conceitos básicos da plataforma e como navegar pelo sistema",
        isCompleted: false,
        progress: 0,
        videos: [
          {
            id: "1-1",
            title: "Bem-vindo ao CCS HUB",
            description: "Conheça a plataforma e seus principais recursos",
            youtubeId: "dQw4w9WgXcQ",
            duration: "5:30",
            isCompleted: false,
            isLocked: false, // Primeiro vídeo sempre desbloqueado
          },
          {
            id: "1-2",
            title: "Navegando pela Interface",
            description: "Aprenda a usar o menu e navegar entre as seções",
            youtubeId: "dQw4w9WgXcQ",
            duration: "8:15",
            isCompleted: false,
            isLocked: false, // Desbloqueado desde o início
          },
          {
            id: "1-3",
            title: "Configurando seu Perfil",
            description: "Personalize suas informações e preferências",
            youtubeId: "dQw4w9WgXcQ",
            duration: "6:45",
            isCompleted: false,
            isLocked: false, // Desbloqueado desde o início
          },
        ],
      },
      {
        id: "2",
        title: "Aprovando Criativos",
        description: "Domine o processo de aprovação e feedback de criativos",
        isCompleted: false,
        progress: 0,
        videos: [
          {
            id: "2-1",
            title: "Como Aprovar um Criativo",
            description: "Passo a passo para aprovar materiais",
            youtubeId: "dQw4w9WgXcQ",
            duration: "7:20",
            isCompleted: false,
            isLocked: true, // Bloqueado até completar módulo 1
          },
          {
            id: "2-2",
            title: "Fazendo Comentários Efetivos",
            description: "Dicas para dar feedback construtivo",
            youtubeId: "dQw4w9WgXcQ",
            duration: "9:10",
            isCompleted: false,
            isLocked: true,
          },
          {
            id: "2-3",
            title: "Solicitando Ajustes",
            description: "Como solicitar modificações de forma clara",
            youtubeId: "dQw4w9WgXcQ",
            duration: "6:30",
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
      {
        id: "3",
        title: "Organização e Produtividade",
        description: "Técnicas avançadas para otimizar seu fluxo de trabalho",
        isCompleted: false,
        progress: 0,
        videos: [
          {
            id: "3-1",
            title: "Organizando seus Projetos",
            description: "Estratégias para manter tudo organizado",
            youtubeId: "dQw4w9WgXcQ",
            duration: "10:15",
            isCompleted: false,
            isLocked: true, // Bloqueado até completar módulo 2
          },
          {
            id: "3-2",
            title: "Dicas de Produtividade",
            description: "Como ser mais eficiente na aprovação",
            youtubeId: "dQw4w9WgXcQ",
            duration: "8:45",
            isCompleted: false,
            isLocked: true,
          },
          {
            id: "3-3",
            title: "Comunicação com a Agência",
            description: "Melhores práticas para comunicação efetiva",
            youtubeId: "dQw4w9WgXcQ",
            duration: "7:50",
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
    ]

    setModules(initialModules)
    saveProgress(initialModules)
  }

  const saveProgress = (updatedModules: Module[]) => {
    try {
      localStorage.setItem('ccs-hub-aulas-progress', JSON.stringify(updatedModules))
    } catch (error) {
      console.error('Erro ao salvar progresso das aulas:', error)
    }
  }

  const markVideoAsCompleted = (moduleId: string, videoId: string) => {
    setModules(prevModules => {
      const updatedModules = prevModules.map(module => {
        if (module.id === moduleId) {
          const updatedVideos = module.videos.map(video => 
            video.id === videoId 
              ? { ...video, isCompleted: true }
              : video
          )
          
          // Desbloquear próximos vídeos se necessário
          const videoIndex = updatedVideos.findIndex(v => v.id === videoId)
          if (videoIndex !== -1 && videoIndex < updatedVideos.length - 1) {
            updatedVideos[videoIndex + 1].isLocked = false
          }
          
          const completedVideos = updatedVideos.filter(video => video.isCompleted).length
          const totalVideos = updatedVideos.length
          const progress = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0
          const isCompleted = completedVideos === totalVideos

          return {
            ...module,
            videos: updatedVideos,
            progress,
            isCompleted,
          }
        }
        return module
      })

      // Desbloquear próximo módulo se o módulo atual foi completado
      const currentModuleIndex = updatedModules.findIndex(m => m.id === moduleId)
      if (currentModuleIndex !== -1 && currentModuleIndex < updatedModules.length - 1) {
        const currentModule = updatedModules[currentModuleIndex]
        if (currentModule.isCompleted) {
          // Desbloquear primeiro vídeo do próximo módulo
          const nextModule = updatedModules[currentModuleIndex + 1]
          if (nextModule && nextModule.videos.length > 0) {
            nextModule.videos[0].isLocked = false
          }
        }
      }

      saveProgress(updatedModules)
      return updatedModules
    })
  }

  // Função para verificar se um módulo pode ser desbloqueado
  const canUnlockModule = (moduleIndex: number) => {
    if (moduleIndex === 0) return true // Primeiro módulo sempre disponível
    
    const previousModule = modules[moduleIndex - 1]
    return previousModule && previousModule.isCompleted
  }

  // Função para desbloquear módulos baseado no progresso
  const unlockModulesBasedOnProgress = () => {
    setModules(prevModules => {
      const updatedModules = prevModules.map((module, index) => {
        if (index === 0) return module // Primeiro módulo sempre desbloqueado
        
        const previousModule = prevModules[index - 1]
        const canUnlock = previousModule && previousModule.isCompleted
        
        if (canUnlock && module.videos.length > 0) {
          // Desbloquear primeiro vídeo do módulo
          const updatedVideos = module.videos.map((video, videoIndex) => ({
            ...video,
            isLocked: videoIndex === 0 ? false : video.isLocked
          }))
          
          return {
            ...module,
            videos: updatedVideos
          }
        }
        
        return module
      })
      
      saveProgress(updatedModules)
      return updatedModules
    })
  }

  // Removido useEffect que causava loop infinito

  const getTotalProgress = () => {
    try {
      if (!modules || modules.length === 0) return 0
      
      const totalVideos = modules.reduce((acc, module) => acc + (module.videos?.length || 0), 0)
      const completedVideos = modules.reduce((acc, module) => 
        acc + (module.videos?.filter(video => video.isCompleted)?.length || 0), 0
      )
      
      return totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0
    } catch (error) {
      console.error('Erro ao calcular progresso total:', error)
      return 0
    }
  }

  const getCompletedVideosCount = () => {
    try {
      if (!modules) return 0
      return modules.reduce((acc, module) => 
        acc + (module.videos?.filter(video => video.isCompleted)?.length || 0), 0
      )
    } catch (error) {
      console.error('Erro ao contar vídeos completados:', error)
      return 0
    }
  }

  const getTotalVideosCount = () => {
    try {
      if (!modules) return 0
      return modules.reduce((acc, module) => acc + (module.videos?.length || 0), 0)
    } catch (error) {
      console.error('Erro ao contar total de vídeos:', error)
      return 0
    }
  }

  return {
    modules,
    loading,
    markVideoAsCompleted,
    getTotalProgress,
    getCompletedVideosCount,
    getTotalVideosCount,
  }
} 