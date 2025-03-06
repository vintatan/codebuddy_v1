"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AvatarGuide } from "@/components/avatar-guide"
import { Separator } from "@/components/ui/separator"
import {
  Trophy,
  Medal,
  Users,
  Star,
  CheckCircle,
  Clock,
  ChevronRight,
  BookOpen,
  Calculator,
  Ruler,
  Percent,
  PieChart,
  BarChart,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Define the math concept type
interface MathConcept {
  id: string
  name: string
  description: string
  grade: number
  topic: string
  prerequisites: string[]
  mastery: number
  questionsAttempted: number
  questionsCorrect: number
}

// Define the user stats type
interface UserStats {
  totalQuestionsAttempted: number
  totalQuestionsCorrect: number
  totalTimeSpent: number
  conceptsMastered: number
  streak: number
  lastActive: string
  rank: number
}

// Define the friend type
interface Friend {
  id: string
  name: string
  avatar: string
  questionsAttempted: number
  questionsCorrect: number
  conceptsMastered: number
  rank: number
}

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState("tracking")
  const [selectedGrade, setSelectedGrade] = useState<number>(0)
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuestionsAttempted: 248,
    totalQuestionsCorrect: 215,
    totalTimeSpent: 1840, // in minutes
    conceptsMastered: 32,
    streak: 7,
    lastActive: "Today",
    rank: 3,
  })

  // Sample math concepts data
  const [mathConcepts, setMathConcepts] = useState<MathConcept[]>([])

  // Sample friends data
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "1",
      name: "Emma Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      questionsAttempted: 312,
      questionsCorrect: 290,
      conceptsMastered: 38,
      rank: 1,
    },
    {
      id: "2",
      name: "Jayden Tan",
      avatar: "/placeholder.svg?height=40&width=40",
      questionsAttempted: 287,
      questionsCorrect: 245,
      conceptsMastered: 35,
      rank: 2,
    },
    {
      id: "3",
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      questionsAttempted: 248,
      questionsCorrect: 215,
      conceptsMastered: 32,
      rank: 3,
    },
    {
      id: "4",
      name: "Sophia Wong",
      avatar: "/placeholder.svg?height=40&width=40",
      questionsAttempted: 201,
      questionsCorrect: 180,
      conceptsMastered: 28,
      rank: 4,
    },
    {
      id: "5",
      name: "Ethan Lim",
      avatar: "/placeholder.svg?height=40&width=40",
      questionsAttempted: 187,
      questionsCorrect: 165,
      conceptsMastered: 25,
      rank: 5,
    },
  ])

  // Generate math concepts data
  useEffect(() => {
    const concepts: MathConcept[] = []

    // Primary 1 concepts
    concepts.push(
      {
        id: "p1-n1",
        name: "Numbers to 100",
        description: "Count, read, and write numbers up to 100",
        grade: 1,
        topic: "numbers",
        prerequisites: [],
        mastery: 100,
        questionsAttempted: 25,
        questionsCorrect: 24,
      },
      {
        id: "p1-n2",
        name: "Addition & Subtraction within 20",
        description: "Add and subtract numbers within 20",
        grade: 1,
        topic: "numbers",
        prerequisites: ["p1-n1"],
        mastery: 95,
        questionsAttempted: 30,
        questionsCorrect: 28,
      },
      {
        id: "p1-m1",
        name: "Length & Mass",
        description: "Compare and measure length and mass",
        grade: 1,
        topic: "measurement",
        prerequisites: [],
        mastery: 90,
        questionsAttempted: 15,
        questionsCorrect: 13,
      },
      {
        id: "p1-g1",
        name: "Basic Shapes",
        description: "Identify and describe basic 2D shapes",
        grade: 1,
        topic: "geometry",
        prerequisites: [],
        mastery: 100,
        questionsAttempted: 12,
        questionsCorrect: 12,
      },
    )

    // Primary 2 concepts
    concepts.push(
      {
        id: "p2-n1",
        name: "Numbers to 1000",
        description: "Count, read, and write numbers up to 1000",
        grade: 2,
        topic: "numbers",
        prerequisites: ["p1-n1"],
        mastery: 85,
        questionsAttempted: 20,
        questionsCorrect: 17,
      },
      {
        id: "p2-n2",
        name: "Addition & Subtraction within 100",
        description: "Add and subtract numbers within 100",
        grade: 2,
        topic: "numbers",
        prerequisites: ["p1-n2", "p2-n1"],
        mastery: 80,
        questionsAttempted: 25,
        questionsCorrect: 20,
      },
      {
        id: "p2-n3",
        name: "Multiplication & Division",
        description: "Basic multiplication and division concepts",
        grade: 2,
        topic: "numbers",
        prerequisites: ["p1-n2"],
        mastery: 75,
        questionsAttempted: 18,
        questionsCorrect: 14,
      },
      {
        id: "p2-m1",
        name: "Volume & Time",
        description: "Measure volume and tell time",
        grade: 2,
        topic: "measurement",
        prerequisites: ["p1-m1"],
        mastery: 70,
        questionsAttempted: 15,
        questionsCorrect: 11,
      },
    )

    // Primary 3 concepts
    concepts.push(
      {
        id: "p3-n1",
        name: "Numbers to 10,000",
        description: "Count, read, and write numbers up to 10,000",
        grade: 3,
        topic: "numbers",
        prerequisites: ["p2-n1"],
        mastery: 65,
        questionsAttempted: 15,
        questionsCorrect: 10,
      },
      {
        id: "p3-n2",
        name: "Addition & Subtraction within 1000",
        description: "Add and subtract numbers within 1000",
        grade: 3,
        topic: "numbers",
        prerequisites: ["p2-n2"],
        mastery: 60,
        questionsAttempted: 12,
        questionsCorrect: 7,
      },
      {
        id: "p3-f1",
        name: "Fractions",
        description: "Understand and use fractions",
        grade: 3,
        topic: "fractions",
        prerequisites: ["p2-n3"],
        mastery: 50,
        questionsAttempted: 10,
        questionsCorrect: 5,
      },
      {
        id: "p3-m1",
        name: "Money",
        description: "Count and calculate with money",
        grade: 3,
        topic: "measurement",
        prerequisites: ["p2-m1"],
        mastery: 80,
        questionsAttempted: 8,
        questionsCorrect: 6,
      },
      {
        id: "p3-g1",
        name: "Area & Perimeter",
        description: "Calculate area and perimeter of shapes",
        grade: 3,
        topic: "geometry",
        prerequisites: ["p1-g1"],
        mastery: 40,
        questionsAttempted: 5,
        questionsCorrect: 2,
      },
    )

    // Primary 4 concepts
    concepts.push(
      {
        id: "p4-n1",
        name: "Numbers to 100,000",
        description: "Count, read, and write numbers up to 100,000",
        grade: 4,
        topic: "numbers",
        prerequisites: ["p3-n1"],
        mastery: 30,
        questionsAttempted: 8,
        questionsCorrect: 3,
      },
      {
        id: "p4-f1",
        name: "Decimals",
        description: "Understand and use decimal numbers",
        grade: 4,
        topic: "fractions",
        prerequisites: ["p3-f1"],
        mastery: 25,
        questionsAttempted: 8,
        questionsCorrect: 2,
      },
      {
        id: "p4-g1",
        name: "Angles",
        description: "Measure and draw angles",
        grade: 4,
        topic: "geometry",
        prerequisites: ["p3-g1"],
        mastery: 20,
        questionsAttempted: 5,
        questionsCorrect: 1,
      },
      {
        id: "p4-d1",
        name: "Tables & Graphs",
        description: "Read and interpret tables and graphs",
        grade: 4,
        topic: "data",
        prerequisites: [],
        mastery: 40,
        questionsAttempted: 5,
        questionsCorrect: 2,
      },
    )

    // Primary 5 concepts
    concepts.push(
      {
        id: "p5-n1",
        name: "Numbers to Millions",
        description: "Count, read, and write numbers up to millions",
        grade: 5,
        topic: "numbers",
        prerequisites: ["p4-n1"],
        mastery: 10,
        questionsAttempted: 5,
        questionsCorrect: 1,
      },
      {
        id: "p5-f1",
        name: "Percentages",
        description: "Understand and calculate percentages",
        grade: 5,
        topic: "fractions",
        prerequisites: ["p4-f1"],
        mastery: 5,
        questionsAttempted: 4,
        questionsCorrect: 0,
      },
      {
        id: "p5-f2",
        name: "Ratio",
        description: "Understand and use ratios",
        grade: 5,
        topic: "fractions",
        prerequisites: ["p4-f1"],
        mastery: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
      },
      {
        id: "p5-m1",
        name: "Volume",
        description: "Calculate volume of 3D shapes",
        grade: 5,
        topic: "measurement",
        prerequisites: ["p3-g1"],
        mastery: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
      },
    )

    // Primary 6 concepts
    concepts.push(
      {
        id: "p6-n1",
        name: "Algebra",
        description: "Solve simple algebraic equations",
        grade: 6,
        topic: "numbers",
        prerequisites: ["p5-n1"],
        mastery: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
      },
      {
        id: "p6-g1",
        name: "Circles",
        description: "Calculate area and circumference of circles",
        grade: 6,
        topic: "geometry",
        prerequisites: ["p5-m1"],
        mastery: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
      },
      {
        id: "p6-d1",
        name: "Pie Charts",
        description: "Interpret and create pie charts",
        grade: 6,
        topic: "data",
        prerequisites: ["p5-f1", "p4-d1"],
        mastery: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
      },
      {
        id: "p6-ps1",
        name: "Problem Solving",
        description: "Advanced problem-solving strategies",
        grade: 6,
        topic: "problem-solving",
        prerequisites: ["p5-f2", "p5-n1"],
        mastery: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
      },
    )

    setMathConcepts(concepts)
  }, [])

  // Filter concepts based on selected grade and topic
  const filteredConcepts = mathConcepts.filter((concept) => {
    const gradeMatch = selectedGrade === 0 || concept.grade === selectedGrade
    const topicMatch = selectedTopic === "all" || concept.topic === selectedTopic
    return gradeMatch && topicMatch
  })

  // Get topic icon
  const getTopicIcon = (topic: string) => {
    switch (topic) {
      case "numbers":
        return <Calculator className="h-4 w-4" />
      case "measurement":
        return <Ruler className="h-4 w-4" />
      case "fractions":
        return <Percent className="h-4 w-4" />
      case "geometry":
        return <PieChart className="h-4 w-4" />
      case "data":
        return <BarChart className="h-4 w-4" />
      case "problem-solving":
        return <Brain className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  // Get mastery color
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "bg-green-500"
    if (mastery >= 50) return "bg-yellow-500"
    if (mastery > 0) return "bg-orange-500"
    return "bg-gray-300"
  }

  // Get mastery label
  const getMasteryLabel = (mastery: number) => {
    if (mastery >= 80) return "Mastered"
    if (mastery >= 50) return "Learning"
    if (mastery > 0) return "Started"
    return "Not Started"
  }

  // Format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <main className="flex min-h-screen flex-col p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <AvatarGuide message="Track your math learning journey and see how you compare with friends!" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="tracking">
              <BookOpen className="h-4 w-4 mr-2" />
              Learning Path
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Learning Path Tab */}
          <TabsContent value="tracking" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Math Concepts Progression</span>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedGrade.toString()}
                      onValueChange={(value) => setSelectedGrade(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All Grades</SelectItem>
                        <SelectItem value="1">Primary 1</SelectItem>
                        <SelectItem value="2">Primary 2</SelectItem>
                        <SelectItem value="3">Primary 3</SelectItem>
                        <SelectItem value="4">Primary 4</SelectItem>
                        <SelectItem value="5">Primary 5</SelectItem>
                        <SelectItem value="6">Primary 6</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        <SelectItem value="numbers">Number & Algebra</SelectItem>
                        <SelectItem value="measurement">Measurement</SelectItem>
                        <SelectItem value="fractions">Fractions</SelectItem>
                        <SelectItem value="geometry">Geometry</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                        <SelectItem value="problem-solving">Problem Solving</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
                <CardDescription>
                  Track your progress through the Singapore Math curriculum from Primary 1 to 6
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-8">
                    {[1, 2, 3, 4, 5, 6].map((grade) => {
                      const gradeConcepts = filteredConcepts.filter((c) => c.grade === grade)
                      if (selectedGrade !== 0 && grade !== selectedGrade) return null
                      if (gradeConcepts.length === 0) return null

                      return (
                        <div key={grade} className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-2">
                              {grade}
                            </span>
                            Primary {grade}
                          </h3>

                          <div className="grid gap-4">
                            {gradeConcepts.map((concept) => (
                              <Card key={concept.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                  <div className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          {getTopicIcon(concept.topic)}
                                          <span className="font-medium">{concept.name}</span>
                                          <Badge variant="outline" className="ml-2">
                                            {concept.topic.charAt(0).toUpperCase() + concept.topic.slice(1)}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{concept.description}</p>

                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1 text-xs">
                                              <span>Mastery</span>
                                              <span>{concept.mastery}%</span>
                                            </div>
                                            <Progress
                                              value={concept.mastery}
                                              className={`h-2 ${getMasteryColor(concept.mastery)}`}
                                            />
                                          </div>
                                          <Badge variant="outline" className="ml-2">
                                            {getMasteryLabel(concept.mastery)}
                                          </Badge>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                          <div className="flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" />
                                            <span>
                                              {concept.questionsCorrect}/{concept.questionsAttempted} correct
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <Link href={`/lessons?topic=${concept.topic}`}>
                                        <Button variant="ghost" size="sm" className="gap-1">
                                          <span>Practice</span>
                                          <ChevronRight className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>

                                  {concept.prerequisites.length > 0 && (
                                    <div className="bg-muted/50 p-3 border-t">
                                      <div className="flex items-center gap-2 text-xs">
                                        <span className="font-medium">Prerequisites:</span>
                                        <div className="flex flex-wrap gap-2">
                                          {concept.prerequisites.map((preId) => {
                                            const pre = mathConcepts.find((c) => c.id === preId)
                                            return pre ? (
                                              <Badge key={preId} variant="outline" className="text-xs">
                                                {pre.name}
                                              </Badge>
                                            ) : null
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {grade < 6 && (
                            <div className="flex justify-center my-4">
                              <div className="border-l-2 border-dashed border-gray-300 h-8"></div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Learning Statistics</CardTitle>
                <CardDescription>Track your progress and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Questions Attempted</p>
                          <p className="text-2xl font-bold">{userStats.totalQuestionsAttempted}</p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <CheckCircle className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {userStats.totalQuestionsCorrect} correct (
                        {Math.round((userStats.totalQuestionsCorrect / userStats.totalQuestionsAttempted) * 100)}%
                        accuracy)
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Concepts Mastered</p>
                          <p className="text-2xl font-bold">{userStats.conceptsMastered}</p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Star className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {Math.round((userStats.conceptsMastered / mathConcepts.length) * 100)}% of curriculum completed
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Time Spent Learning</p>
                          <p className="text-2xl font-bold">{formatTime(userStats.totalTimeSpent)}</p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {userStats.streak} day streak - Last active: {userStats.lastActive}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>Leaderboard</span>
                </CardTitle>
                <CardDescription>See how you compare with your friends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {friends.map((friend, index) => (
                    <div
                      key={friend.id}
                      className={`flex items-center p-4 rounded-lg ${friend.id === "3" ? "bg-primary/10" : "bg-muted/50"}`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 mr-4">
                        {index === 0 ? (
                          <Medal className="h-6 w-6 text-yellow-500" />
                        ) : index === 1 ? (
                          <Medal className="h-6 w-6 text-gray-400" />
                        ) : index === 2 ? (
                          <Medal className="h-6 w-6 text-amber-700" />
                        ) : (
                          <span className="text-lg font-bold">{index + 1}</span>
                        )}
                      </div>

                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="font-medium">{friend.name}</div>
                        <div className="text-sm text-muted-foreground">{friend.conceptsMastered} concepts mastered</div>
                      </div>

                      <div className="hidden md:flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-sm font-medium">{friend.questionsAttempted}</div>
                          <div className="text-xs text-muted-foreground">Questions</div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm font-medium">
                            {Math.round((friend.questionsCorrect / friend.questionsAttempted) * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Active Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {friends
                      .sort((a, b) => b.questionsAttempted - a.questionsAttempted)
                      .slice(0, 3)
                      .map((friend) => (
                        <div key={`active-${friend.id}`} className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 ml-2">
                            <div className="font-medium">{friend.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {friend.questionsAttempted} questions attempted
                            </div>
                          </div>

                          <div className="text-sm font-medium">{friend.questionsCorrect} correct</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Accurate Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {friends
                      .sort(
                        (a, b) => b.questionsCorrect / b.questionsAttempted - a.questionsCorrect / a.questionsAttempted,
                      )
                      .slice(0, 3)
                      .map((friend) => (
                        <div key={`accurate-${friend.id}`} className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 ml-2">
                            <div className="font-medium">{friend.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {Math.round((friend.questionsCorrect / friend.questionsAttempted) * 100)}% accuracy
                            </div>
                          </div>

                          <div className="text-sm font-medium">
                            {friend.questionsCorrect}/{friend.questionsAttempted}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Invite Friends</span>
                </CardTitle>
                <CardDescription>Grow your learning network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Input placeholder="Enter friend&apos;s email" className="flex-1" />
                  <Button>Send Invite</Button>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium">Share your progress</p>
                    <p className="text-muted-foreground">Let others see how you&apos;re doing</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

