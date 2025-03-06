"use client"

import { cn } from "@/lib/utils"

interface MonsterAvatarProps {
  type: "smart" | "curious" | "friendly" | "excited" | "thinking" | "celebrating"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function MonsterAvatar({ type, size = "md", className }: MonsterAvatarProps) {
  // Monster emojis mapped to different types
  const monsters = {
    smart: "🦊", // Fox for smart/clever
    curious: "🦉", // Owl for curious/learning
    friendly: "🐼", // Panda for friendly/helpful
    excited: "🐸", // Frog for excited/energetic
    thinking: "🦁", // Lion for thinking/focused
    celebrating: "🐯", // Tiger for celebrating/achievement
  }

  // Size classes
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 aspect-square",
        size === "sm" && "w-12 h-12",
        size === "md" && "w-16 h-16",
        size === "lg" && "w-24 h-24",
        "animate-bounce-gentle",
        className,
      )}
    >
      <span className={cn("transform transition-transform duration-200 hover:scale-110", sizeClasses[size])}>
        {monsters[type]}
      </span>
    </div>
  )
}

