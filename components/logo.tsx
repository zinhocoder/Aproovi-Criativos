import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Use a default image during SSR to prevent hydration mismatch
  const logoSrc = mounted && theme === "dark" ? "/HORIZONTAL_BRANCO.svg" : "/HORIZONTAL.svg"
  
  // Safety check for mounted state
  if (!mounted) {
    return (
      <Link href="/" className={`flex items-center ${className}`}>
        <div className="w-[150px] h-[50px] bg-muted animate-pulse rounded"></div>
      </Link>
    )
  }
  
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image 
        src={logoSrc}
        alt="CCS HUB" 
        width={150} 
        height={50} 
        className="h-auto" 
        priority 
      />
    </Link>
  )
}
