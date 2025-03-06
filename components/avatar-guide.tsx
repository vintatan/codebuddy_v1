"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AvatarGuideProps {
  message: string
  className?: string
}

export function AvatarGuide({ message, className }: AvatarGuideProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="relative w-16 h-16">
          <Image
            src="/robot.png"
            alt="AI Tutor Avatar"
            width={64}
            height={64}
            className={cn("rounded-full transition-transform duration-300", isAnimating && "scale-110")}
          />
        </div>
        <p className="flex-1 text-lg">{message}</p>
      </CardContent>
    </Card>
  )
}

