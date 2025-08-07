import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image src="/logo.png" alt="Aproovi" width={150} height={50} className="h-auto" priority />
    </Link>
  )
}
