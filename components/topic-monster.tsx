"use client"

interface TopicMonsterProps {
  topic: string
  className?: string
}

export function TopicMonster({ topic, className }: TopicMonsterProps) {
  // Topic monsters with descriptions
  const monsters = {
    numbers: {
      emoji: "🦊",
      name: "Cally Calculator",
      description: "Loves counting and solving number puzzles!",
    },
    measurement: {
      emoji: "🦒",
      name: "Melly Measure",
      description: "Helps measure everything big and small!",
    },
    fractions: {
      emoji: "🐼",
      name: "Franky Fraction",
      description: "Makes sharing and dividing fun!",
    },
    geometry: {
      emoji: "🦉",
      name: "Shappy Shape",
      description: "Knows all about shapes and angles!",
    },
    data: {
      emoji: "🐸",
      name: "Datty Graph",
      description: "Loves organizing numbers and making charts!",
    },
    "problem-solving": {
      emoji: "🦁",
      name: "Probby Solver",
      description: "Your friend for tricky problems!",
    },
  }

  const monster = monsters[topic as keyof typeof monsters] || monsters.numbers

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{monster.emoji}</span>
        <div>
          <div className="font-medium">{monster.name}</div>
          <div className="text-xs text-muted-foreground">{monster.description}</div>
        </div>
      </div>
    </div>
  )
}

