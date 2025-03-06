"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import Confetti from "react-confetti"
import Link from "next/link"
import { MonsterAvatar } from "@/components/monster-avatar"
import { TopicMonster } from "@/components/topic-monster"
import { Calculator, Ruler, Percent, PieChart, BarChart, Brain } from "lucide-react"

// Define the math question type
interface MathQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  grade: 1 | 2 | 3 | 4 | 5 | 6
  topic: string
  difficulty: "easy" | "medium" | "hard"
}

// Define the learning path recommendation
interface LearningPathRecommendation {
  grade: 1 | 2 | 3 | 4 | 5 | 6
  topics: {
    name: string
    icon: React.ReactNode
    strength?: boolean
  }[]
  recommendedProblems: {
    id: string
    statement: string
    topic: string
  }[]
}

export default function PlacementTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testComplete, setTestComplete] = useState(false)
  const [assessedLevel, setAssessedLevel] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [percentileRank, setPercentileRank] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [recommendation, setRecommendation] = useState<LearningPathRecommendation | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Set window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial size
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Comprehensive question bank covering Primary 1-6
  const QUESTIONS: MathQuestion[] = [
    // Primary 1 Questions
    {
      id: "p1-1",
      question: "What is 5 + 3?",
      options: ["7", "8", "9", "10"],
      correct: 0,
      grade: 1,
      topic: "numbers",
      difficulty: "easy",
    },
    {
      id: "p1-2",
      question: "What is 10 - 4?",
      options: ["4", "5", "6", "7"],
      correct: 1,
      grade: 1,
      topic: "numbers",
      difficulty: "easy",
    },
    {
      id: "p1-3",
      question: "Which shape has 3 sides?",
      options: ["Circle", "Square", "Triangle", "Rectangle"],
      correct: 2,
      grade: 1,
      topic: "geometry",
      difficulty: "easy",
    },

    // Primary 2 Questions
    {
      id: "p2-1",
      question: "What is 15 + 23?",
      options: ["38", "37", "28", "35"],
      correct: 0,
      grade: 2,
      topic: "numbers",
      difficulty: "easy",
    },
    {
      id: "p2-2",
      question: "What is 5 × 4?",
      options: ["9", "20", "25", "16"],
      correct: 1,
      grade: 2,
      topic: "numbers",
      difficulty: "medium",
    },
    {
      id: "p2-3",
      question: "How many centimeters are in 1 meter?",
      options: ["10", "100", "1000", "10000"],
      correct: 1,
      grade: 2,
      topic: "measurement",
      difficulty: "medium",
    },

    // Primary 3 Questions
    {
      id: "p3-1",
      question: "What is 125 + 237?",
      options: ["352", "362", "462", "372"],
      correct: 1,
      grade: 3,
      topic: "numbers",
      difficulty: "medium",
    },
    {
      id: "p3-2",
      question: "What is 1/2 + 1/4?",
      options: ["2/6", "3/4", "1/6", "3/6"],
      correct: 1,
      grade: 3,
      topic: "fractions",
      difficulty: "hard",
    },
    {
      id: "p3-3",
      question: "What is the perimeter of a square with side length 5 cm?",
      options: ["10 cm", "15 cm", "20 cm", "25 cm"],
      correct: 2,
      grade: 3,
      topic: "geometry",
      difficulty: "medium",
    },

    // Primary 4 Questions
    {
      id: "p4-1",
      question: "What is 7 × 8?",
      options: ["54", "56", "48", "64"],
      correct: 1,
      grade: 4,
      topic: "numbers",
      difficulty: "medium",
    },
    {
      id: "p4-2",
      question: "What is 0.5 × 10?",
      options: ["0.5", "5", "50", "0.05"],
      correct: 1,
      grade: 4,
      topic: "fractions",
      difficulty: "medium",
    },
    {
      id: "p4-3",
      question: "What is the area of a rectangle with length 7 cm and width 4 cm?",
      options: ["11 square cm", "22 square cm", "28 square cm", "14 square cm"],
      correct: 2,
      grade: 4,
      topic: "geometry",
      difficulty: "medium",
    },

    // Primary 5 Questions
    {
      id: "p5-1",
      question: "What is 3/5 of 25?",
      options: ["15", "12", "10", "5"],
      correct: 0,
      grade: 5,
      topic: "fractions",
      difficulty: "hard",
    },
    {
      id: "p5-2",
      question: "What is the ratio of 15 to 25 in simplest form?",
      options: ["15:25", "3:5", "5:3", "6:10"],
      correct: 1,
      grade: 5,
      topic: "fractions",
      difficulty: "hard",
    },
    {
      id: "p5-3",
      question: "If a shirt costs $24 and is on sale for 25% off, what is the sale price?",
      options: ["$18", "$19", "$20", "$21"],
      correct: 0,
      grade: 5,
      topic: "fractions",
      difficulty: "hard",
    },

    // Primary 6 Questions
    {
      id: "p6-1",
      question: "Solve for x: 3x + 7 = 22",
      options: ["x = 5", "x = 6", "x = 7", "x = 15"],
      correct: 0,
      grade: 6,
      topic: "numbers",
      difficulty: "hard",
    },
    {
      id: "p6-2",
      question: "A car travels 210 km in 3 hours. What is its average speed?",
      options: ["60 km/h", "70 km/h", "80 km/h", "90 km/h"],
      correct: 1,
      grade: 6,
      topic: "numbers",
      difficulty: "hard",
    },
    {
      id: "p6-3",
      question: "What is the value of 2³ + 4²?",
      options: ["20", "24", "32", "64"],
      correct: 1,
      grade: 6,
      topic: "numbers",
      difficulty: "hard",
    },
  ]

  // Adaptive test logic - select next question based on performance
  const selectNextQuestion = (currentAnswers: number[]) => {
    // If we have less than 3 answers, continue with sequential questions
    if (currentAnswers.length < 3) {
      return currentAnswers.length
    }

    // Calculate current performance
    const correctAnswers = currentAnswers.reduce((acc, curr, idx) => {
      const question = QUESTIONS[idx]
      return acc + (curr === question.correct ? 1 : 0)
    }, 0)

    const accuracy = correctAnswers / currentAnswers.length

    // Determine appropriate difficulty level
    let targetGrade
    if (accuracy > 0.8) {
      // Doing well, increase difficulty
      const lastQuestionGrade = QUESTIONS[currentAnswers.length - 1].grade
      targetGrade = Math.min(lastQuestionGrade + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6
    } else if (accuracy < 0.5) {
      // Struggling, decrease difficulty
      const lastQuestionGrade = QUESTIONS[currentAnswers.length - 1].grade
      targetGrade = Math.max(lastQuestionGrade - 1, 1) as 1 | 2 | 3 | 4 | 5 | 6
    } else {
      // Maintain current difficulty
      targetGrade = QUESTIONS[currentAnswers.length - 1].grade
    }

    // Find questions of appropriate grade that haven't been asked yet
    const candidateQuestions = QUESTIONS.filter(
      (q, idx) => q.grade === targetGrade && !currentAnswers.some((a) => a === idx),
    )

    if (candidateQuestions.length > 0) {
      // Select a random question from candidates
      const randomIndex = Math.floor(Math.random() * candidateQuestions.length)
      const selectedQuestion = candidateQuestions[randomIndex]
      return QUESTIONS.findIndex((q) => q.id === selectedQuestion.id)
    } else {
      // If no suitable questions, just continue sequentially
      return currentAnswers.length
    }
  }

  // Handle answering a question
  const handleAnswer = async (value: string) => {
    try {
      setIsSubmitting(true)
      const answer = Number.parseInt(value)
      if (isNaN(answer)) {
        throw new Error("Invalid answer value")
      }

      const newAnswers = [...answers, answer]
      setAnswers(newAnswers)

      // Determine if we should continue or end the test
      if (newAnswers.length < 10) {
        // Continue the test with adaptive question selection
        const nextQuestionIndex = selectNextQuestion(newAnswers)
        setCurrentQuestion(nextQuestionIndex)
      } else {
        // Test is complete, calculate results
        const score = newAnswers.reduce((acc, curr, idx) => {
          const questionIndex = idx < QUESTIONS.length ? idx : QUESTIONS.length - 1
          const question = QUESTIONS[questionIndex]
          return acc + (curr === question.correct ? 1 : 0)
        }, 0)

        // Calculate assessed level based on performance
        const correctByGrade = [1, 2, 3, 4, 5, 6].map((grade) => {
          const gradeQuestions = newAnswers.filter((_, idx) => {
            const questionIndex = idx < QUESTIONS.length ? idx : QUESTIONS.length - 1
            return QUESTIONS[questionIndex].grade === grade
          }).length

          const gradeCorrect = newAnswers.filter((ans, idx) => {
            const questionIndex = idx < QUESTIONS.length ? idx : QUESTIONS.length - 1
            const question = QUESTIONS[questionIndex]
            return question.grade === grade && ans === question.correct
          }).length

          return gradeQuestions > 0 ? gradeCorrect / gradeQuestions : 0
        })

        // Find highest grade with at least 60% accuracy
        let highestPassingGrade = 1
        for (let i = 5; i >= 0; i--) {
          if (correctByGrade[i] >= 0.6) {
            highestPassingGrade = i + 1
            break
          }
        }

        setAssessedLevel(highestPassingGrade as 1 | 2 | 3 | 4 | 5 | 6)

        // Calculate percentile (simulated)
        // In a real app, this would compare to actual student data
        const percentile = Math.min(95, Math.max(5, 50 + (score - 5) * 10))
        setPercentileRank(Math.round(percentile))

        // Generate learning path recommendation
        generateRecommendation(highestPassingGrade as 1 | 2 | 3 | 4 | 5 | 6, newAnswers)

        // Show completion UI
        setTestComplete(true)
        setShowConfetti(true)

        // Hide confetti after 5 seconds
        setTimeout(() => {
          setShowConfetti(false)
        }, 5000)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem processing your answer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate personalized learning path recommendation
  const generateRecommendation = (grade: 1 | 2 | 3 | 4 | 5 | 6, testAnswers: number[]) => {
    // Analyze strengths and weaknesses by topic
    const topicPerformance: Record<string, { correct: number; total: number }> = {}

    testAnswers.forEach((answer, idx) => {
      const questionIndex = idx < QUESTIONS.length ? idx : QUESTIONS.length - 1
      const question = QUESTIONS[questionIndex]
      const topic = question.topic

      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 }
      }

      topicPerformance[topic].total += 1
      if (answer === question.correct) {
        topicPerformance[topic].correct += 1
      }
    })

    // Identify strengths (topics with >70% accuracy)
    const strengths = Object.entries(topicPerformance)
      .filter(([_, data]) => data.total > 0 && data.correct / data.total >= 0.7)
      .map(([topic]) => topic)

    // Identify weaknesses (topics with <50% accuracy)
    const weaknesses = Object.entries(topicPerformance)
      .filter(([_, data]) => data.total > 0 && data.correct / data.total < 0.5)
      .map(([topic]) => topic)

    // Create topic recommendations
    const topicRecommendations = [
      {
        name: "Number & Algebra",
        icon: <Calculator className="h-4 w-4" />,
        strength: strengths.includes("numbers"),
      },
      {
        name: "Measurement",
        icon: <Ruler className="h-4 w-4" />,
        strength: strengths.includes("measurement"),
      },
      {
        name: "Fractions & Decimals",
        icon: <Percent className="h-4 w-4" />,
        strength: strengths.includes("fractions"),
      },
      {
        name: "Geometry",
        icon: <PieChart className="h-4 w-4" />,
        strength: strengths.includes("geometry"),
      },
      {
        name: "Data Handling",
        icon: <BarChart className="h-4 w-4" />,
        strength: strengths.includes("data"),
      },
    ]

    // Recommend problems based on assessed level and weaknesses
    const recommendedProblems = [
      {
        id: `p${grade}-1`,
        statement: `What is ${grade * 5} + ${grade * 3}?`,
        topic: "numbers",
      },
      {
        id: `p${grade}-2`,
        statement: `What is ${grade * 4} × ${grade}?`,
        topic: "numbers",
      },
      {
        id: `p${grade}-3`,
        statement:
          grade <= 2
            ? `A pencil is ${grade * 5} cm long. A ruler is ${grade * 10} cm long. How much longer is the ruler than the pencil?`
            : `A rectangle has length ${grade * 6} cm and width ${grade * 4} cm. What is its area?`,
        topic: "measurement",
      },
    ]

    // If the student is at grade 3 or higher, add a fractions problem
    if (grade >= 3) {
      recommendedProblems.push({
        id: `p${grade}-4`,
        statement: grade <= 4 ? `What is 1/${grade} + 2/${grade}?` : `What is ${grade - 2}/${grade} - 1/${grade * 2}?`,
        topic: "fractions",
      })
    }

    setRecommendation({
      grade,
      topics: topicRecommendations,
      recommendedProblems,
    })
  }

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
        return <Calculator className="h-4 w-4" />
    }
  }

  // Safety check for current question
  const question = QUESTIONS[currentQuestion]
  if (!question && !testComplete) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center">Error loading question. Please try again.</p>
            <Button
              className="w-full mt-4"
              onClick={() => {
                setCurrentQuestion(0)
                setAnswers([])
              }}
            >
              Restart Test
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Celebration confetti effect */}
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
      )}

      <div className="w-full max-w-md space-y-4">
        {!testComplete ? (
          <>
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <MonsterAvatar
                    type={
                      answers.length < 3
                        ? "friendly"
                        : answers.length < 6
                          ? "curious"
                          : answers.length < 9
                            ? "thinking"
                            : "excited"
                    }
                    size="lg"
                  />
                </div>
                <CardTitle className="text-2xl">Math Adventure!</CardTitle>
                <CardDescription className="text-lg">Question {answers.length + 1} of 10</CardDescription>
                <Progress value={(answers.length + 1) * 10} className="h-3 mt-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <TopicMonster topic={question.topic} />
                  </div>

                  <div className="bg-primary/5 p-4 rounded-xl border-2 border-primary/20">
                    <p className="text-lg font-medium text-center">{question.question}</p>
                  </div>

                  <RadioGroup onValueChange={handleAnswer} disabled={isSubmitting}>
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`
                          transform transition-all duration-200 hover:scale-105
                          ${isSubmitting ? "opacity-50" : "hover:shadow-lg"}
                        `}
                      >
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex items-center space-x-2 border-2 border-primary/20 p-4 rounded-xl cursor-pointer hover:bg-primary/5"
                        >
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <span className="flex-1">{option}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-center w-full text-muted-foreground">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <MonsterAvatar type="thinking" size="sm" />
                      Thinking...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <MonsterAvatar type="curious" size="sm" />
                      Choose your answer!
                    </span>
                  )}
                </p>
              </CardFooter>
            </Card>
          </>
        ) : (
          <>
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center bg-primary/10 rounded-t-lg">
                <div className="flex justify-center -mt-8 mb-4">
                  <MonsterAvatar type="celebrating" size="lg" className="animate-bounce" />
                </div>
                <CardTitle className="text-2xl">Amazing Job!</CardTitle>
                <CardDescription className="text-lg">You&apos;ve completed your math adventure</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center bg-primary/20 rounded-full w-24 h-24 mb-2">
                    <span className="text-4xl font-bold">P{assessedLevel}</span>
                  </div>
                  <h3 className="text-xl font-bold">Primary {assessedLevel}</h3>
                  <p className="text-muted-foreground">Your math level</p>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Your Performance</span>
                    <span className="font-bold">{percentileRank}%</span>
                  </div>
                  <Progress value={percentileRank} className="h-3 mb-2" />
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Wow! You&apos;re doing better than {percentileRank}% of students!
                    {percentileRank > 75
                      ? " You're a math superstar! 🌟"
                      : percentileRank > 50
                        ? " Keep up the great work! 👏"
                        : " Let&apos;s keep learning together! 💪"}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-center">Your Learning Adventure Map</h3>

                  {recommendation && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {recommendation.topics.map((topic, index) => (
                          <div
                            key={index}
                            className={`
                              p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105
                              ${
                                topic.strength
                                  ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800"
                                  : "border-primary/20 hover:bg-primary/5"
                              }
                            `}
                          >
                            <TopicMonster topic={topic.name.toLowerCase()} />
                            {topic.strength && (
                              <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400">
                                Super Strong! ⭐
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-center">Fun Problems to Try</h4>
                        {recommendation.recommendedProblems.map((problem, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 transition-all duration-200 hover:scale-105"
                          >
                            <TopicMonster topic={problem.topic} />
                            <p className="text-sm mt-2">{problem.statement}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 p-6">
                <Button className="w-full text-lg h-12" onClick={() => router.push(`/lessons?grade=${assessedLevel}`)}>
                  Start Your Adventure!
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="flex gap-3 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => router.push("/")}>
                    <MonsterAvatar type="friendly" size="sm" />
                    <span className="ml-2">Home</span>
                  </Button>
                  <Link href="/progress" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <MonsterAvatar type="smart" size="sm" />
                      <span className="ml-2">Progress</span>
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}

