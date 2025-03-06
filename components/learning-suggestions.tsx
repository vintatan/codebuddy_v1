"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, Ruler, Percent, PieChart, BarChart, Brain } from "lucide-react"
import { useRouter } from "next/navigation"

interface LearningTopic {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const TOPICS: LearningTopic[] = [
  {
    id: "numbers",
    title: "Number & Algebra",
    description: "Learn about numbers, operations, and basic algebra",
    icon: <Calculator className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "measurement",
    title: "Measurement",
    description: "Explore length, mass, volume, time, and money",
    icon: <Ruler className="h-5 w-5" />,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "fractions",
    title: "Fractions & Decimals",
    description: "Master fractions, decimals, percentages, and ratios",
    icon: <Percent className="h-5 w-5" />,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "geometry",
    title: "Shapes & Geometry",
    description: "Learn about 2D and 3D shapes, angles, and spatial concepts",
    icon: <PieChart className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "data",
    title: "Data Handling",
    description: "Work with graphs, charts, and statistics",
    icon: <BarChart className="h-5 w-5" />,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    description: "Develop strategies for solving math word problems",
    icon: <Brain className="h-5 w-5" />,
    color: "bg-indigo-100 text-indigo-700",
  },
]

export function LearningSuggestions() {
  const router = useRouter()

  const handleTopicSelect = (topicId: string) => {
    router.push(`/lessons?topic=${topicId}`)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Math Learning Topics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map((topic) => (
          <Card key={topic.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${topic.color}`}>{topic.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                  <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => handleTopicSelect(topic.id)}>
                    Start Learning
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

