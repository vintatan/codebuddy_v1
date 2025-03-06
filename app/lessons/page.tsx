"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useChat } from "ai/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Bot,
  Send,
  User,
  Calculator,
  Ruler,
  Percent,
  PieChart,
  School,
  PenTool,
  BookOpen,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  X,
  BarChart,
  PartyPopper,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { AvatarGuide } from "@/components/avatar-guide"
import { DrawingCanvas } from "@/components/drawing-canvas"
import { AnnotatedImage } from "@/components/annotated-image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import Confetti from "react-confetti"

// User profile type
interface UserProfile {
  gradeLevel?: 1 | 2 | 3 | 4 | 5 | 6
  goals?: string[]
  interests?: string[]
}

// Message with image support
interface ExtendedMessage {
  id: string
  role: "user" | "assistant"
  content: string
  imageUrl?: string
  annotations?: Array<{
    type: "circle" | "rectangle" | "arrow" | "text" | "tick" | "cross"
    x: number
    y: number
    width?: number
    height?: number
    color: string
    text?: string
  }>
}

// Math problem interface
interface MathProblem {
  id: string
  statement: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
  solution?: string
  userSolution?: string
  status: "unsolved" | "solved" | "incorrect" | "needs_help"
}

export default function Lessons() {
  const searchParams = useSearchParams()
  const topicId = searchParams.get("topic")
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [learningContext, setLearningContext] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile>({})
  const [activeTab, setActiveTab] = useState<string>("recommendations")
  const [extendedMessages, setExtendedMessages] = useState<ExtendedMessage[]>([])
  const [isSubmittingDrawing, setIsSubmittingDrawing] = useState(false)
  const [recommendedProblems, setRecommendedProblems] = useState<MathProblem[]>([])
  const [selectedProblem, setSelectedProblem] = useState<MathProblem | null>(null)
  const [userSolution, setUserSolution] = useState("")
  const [helpQuestion, setHelpQuestion] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [topicFilter, setTopicFilter] = useState<string>("all")
  const [showGradeDialog, setShowGradeDialog] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  // Add a new state for the congratulations dialog
  const [showCongratulationsDialog, setShowCongratulationsDialog] = useState(false)
  const [congratsMessage, setCongratsMessage] = useState("")

  // Add a new state for the "try again" dialog
  const [showTryAgainDialog, setShowTryAgainDialog] = useState(false)
  const [nextRecommendedProblem, setNextRecommendedProblem] = useState<MathProblem | null>(null)

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

  // Enhanced chat with system message that guides the AI to recommend learning paths
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi there! I'm your math buddy! To help you learn better, could you tell me which grade you're in? Are you in Primary 1, 2, 3, 4, 5, or 6?",
      },
    ],
    onFinish: (message) => {
      // Extract learning context and user profile info from the message
      analyzeMessage(message.content)
    },
  })

  // Show grade selection dialog when component mounts if no grade is selected
  useEffect(() => {
    if (!userProfile.gradeLevel) {
      setShowGradeDialog(true)
    }
  }, [userProfile.gradeLevel])

  // Sync messages with extended messages
  useEffect(() => {
    // Add any new messages that aren't in extendedMessages
    const newMessages = messages.filter((msg) => !extendedMessages.some((extMsg) => extMsg.id === msg.id))

    if (newMessages.length > 0) {
      setExtendedMessages((prev) => [
        ...prev,
        ...newMessages.map((msg) => ({
          id: msg.id,
          role: msg.role as "assistant" | "user",
          content: msg.content,
        })),
      ])
    }
  }, [messages, extendedMessages])

  // Generate sample recommended problems based on grade level and topic
  useEffect(() => {
    if (userProfile.gradeLevel) {
      generateRecommendedProblems(userProfile.gradeLevel, topicId || undefined)
    }
  }, [userProfile.gradeLevel, topicId])

  // Hide confetti after 5 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  // Generate recommended problems
  const generateRecommendedProblems = (gradeLevel: number, topic?: string) => {
    // Sample problems based on grade level
    const problems: MathProblem[] = []

    // Number & Algebra problems
    problems.push({
      id: `na-${gradeLevel}-1`,
      statement:
        gradeLevel <= 2
          ? `What is ${gradeLevel * 5} + ${gradeLevel * 3}?`
          : gradeLevel <= 4
            ? `What is ${gradeLevel * 25} + ${gradeLevel * 37}?`
            : `Solve for x: ${gradeLevel}x + ${gradeLevel * 2} = ${gradeLevel * 7}`,
      difficulty: "easy",
      topic: "numbers",
      status: "unsolved",
      solution:
        gradeLevel <= 2
          ? `${gradeLevel * 5 + gradeLevel * 3}`
          : gradeLevel <= 4
            ? `${gradeLevel * 25 + gradeLevel * 37}`
            : `${(gradeLevel * 7 - gradeLevel * 2) / gradeLevel}`,
    })

    problems.push({
      id: `na-${gradeLevel}-2`,
      statement:
        gradeLevel <= 2
          ? `What is ${gradeLevel * 4} × ${gradeLevel}?`
          : gradeLevel <= 4
            ? `What is ${gradeLevel * 7} × ${gradeLevel * 8}?`
            : `If x = ${gradeLevel * 2} and y = ${gradeLevel * 3}, what is the value of ${gradeLevel}x - 2y?`,
      difficulty: "medium",
      topic: "numbers",
      status: "unsolved",
      solution:
        gradeLevel <= 2
          ? `${gradeLevel * 4 * gradeLevel}`
          : gradeLevel <= 4
            ? `${gradeLevel * 7 * gradeLevel * 8}`
            : `${gradeLevel * (gradeLevel * 2) - 2 * (gradeLevel * 3)}`,
    })

    // Measurement problems
    problems.push({
      id: `m-${gradeLevel}-1`,
      statement:
        gradeLevel <= 2
          ? `A pencil is ${gradeLevel * 5} cm long. A ruler is ${gradeLevel * 10} cm long. How much longer is the ruler than the pencil?`
          : gradeLevel <= 4
            ? `A rectangle has length ${gradeLevel * 6} cm and width ${gradeLevel * 4} cm. What is its area?`
            : `A rectangular prism has length ${gradeLevel * 3} cm, width ${gradeLevel * 2} cm, and height ${gradeLevel} cm. What is its volume?`,
      difficulty: "medium",
      topic: "measurement",
      status: "unsolved",
      solution:
        gradeLevel <= 2
          ? `${gradeLevel * 10 - gradeLevel * 5} cm`
          : gradeLevel <= 4
            ? `${gradeLevel * 6 * gradeLevel * 4} square cm`
            : `${gradeLevel * 3 * gradeLevel * 2 * gradeLevel} cubic cm`,
    })

    // Fractions problems
    if (gradeLevel >= 3) {
      problems.push({
        id: `f-${gradeLevel}-1`,
        statement:
          gradeLevel <= 4
            ? `What is 1/${gradeLevel} + 2/${gradeLevel}?`
            : `What is ${gradeLevel - 2}/${gradeLevel} - 1/${gradeLevel * 2}?`,
        difficulty: "medium",
        topic: "fractions",
        status: "unsolved",
        solution: gradeLevel <= 4 ? `3/${gradeLevel}` : `${(gradeLevel - 2) * 2 - 1}/${gradeLevel * 2}`,
      })

      problems.push({
        id: `f-${gradeLevel}-2`,
        statement:
          gradeLevel <= 4
            ? `What is 1/2 of ${gradeLevel * 6}?`
            : `What is ${gradeLevel - 1}/${gradeLevel} of ${gradeLevel * 15}?`,
        difficulty: "hard",
        topic: "fractions",
        status: "unsolved",
        solution: gradeLevel <= 4 ? `${(gradeLevel * 6) / 2}` : `${(gradeLevel - 1) * 15}`,
      })
    }

    // Geometry problems
    problems.push({
      id: `g-${gradeLevel}-1`,
      statement:
        gradeLevel <= 2
          ? `How many sides does a triangle have?`
          : gradeLevel <= 4
            ? `What is the perimeter of a square with side length ${gradeLevel * 2} cm?`
            : `What is the area of a circle with radius ${gradeLevel} cm? (Use π = 3.14)`,
      difficulty: gradeLevel <= 2 ? "easy" : "hard",
      topic: "geometry",
      status: "unsolved",
      solution:
        gradeLevel <= 2
          ? `3`
          : gradeLevel <= 4
            ? `${gradeLevel * 2 * 4} cm`
            : `${Math.round(3.14 * gradeLevel * gradeLevel * 100) / 100} square cm`,
    })

    // Data problems for higher grades
    if (gradeLevel >= 4) {
      problems.push({
        id: `d-${gradeLevel}-1`,
        statement: `The average of ${gradeLevel} numbers is ${gradeLevel * 5}. What is their sum?`,
        difficulty: "hard",
        topic: "data",
        status: "unsolved",
        solution: `${gradeLevel * gradeLevel * 5}`,
      })
    }

    // Filter by topic if specified
    const filteredProblems = topic ? problems.filter((p) => p.topic === topic) : problems

    setRecommendedProblems(filteredProblems)
  }

  // Analyze messages to extract learning context and user profile info
  const analyzeMessage = (content: string) => {
    const contentLower = content.toLowerCase()

    // Check for grade level mentions
    for (let i = 1; i <= 6; i++) {
      if (
        contentLower.includes(`primary ${i}`) ||
        contentLower.includes(`grade ${i}`) ||
        contentLower.match(new RegExp(`\\b(p${i}|p ${i})\\b`))
      ) {
        setUserProfile((prev) => ({ ...prev, gradeLevel: i as 1 | 2 | 3 | 4 | 5 | 6 }))
        break
      }
    }

    // Check for math topics
    const numberKeywords = ["number", "count", "addition", "subtraction", "add", "subtract", "place value"]
    const measurementKeywords = ["measurement", "length", "mass", "weight", "volume", "capacity", "area", "perimeter"]
    const fractionKeywords = ["fraction", "decimal", "percentage", "ratio", "proportion"]
    const geometryKeywords = ["shape", "geometry", "angle", "triangle", "rectangle", "square", "circle"]
    const dataKeywords = ["data", "graph", "chart", "statistics", "average", "mean", "median", "mode"]

    if (numberKeywords.some((keyword) => contentLower.includes(keyword))) {
      setLearningContext("numbers")
      setUserProfile((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), "numbers"].filter((v, i, a) => a.indexOf(v) === i),
      }))
    } else if (measurementKeywords.some((keyword) => contentLower.includes(keyword))) {
      setLearningContext("measurement")
      setUserProfile((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), "measurement"].filter((v, i, a) => a.indexOf(v) === i),
      }))
    } else if (fractionKeywords.some((keyword) => contentLower.includes(keyword))) {
      setLearningContext("fractions")
      setUserProfile((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), "fractions"].filter((v, i, a) => a.indexOf(v) === i),
      }))
    } else if (geometryKeywords.some((keyword) => contentLower.includes(keyword))) {
      setLearningContext("geometry")
      setUserProfile((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), "geometry"].filter((v, i, a) => a.indexOf(v) === i),
      }))
    } else if (dataKeywords.some((keyword) => contentLower.includes(keyword))) {
      setLearningContext("data")
      setUserProfile((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), "data"].filter((v, i, a) => a.indexOf(v) === i),
      }))
    }

    // Check for goal mentions
    if (contentLower.includes("exam") || contentLower.includes("test") || contentLower.includes("psle")) {
      setUserProfile((prev) => ({
        ...prev,
        goals: [...(prev.goals || []), "exams"].filter((v, i, a) => a.indexOf(v) === i),
      }))
    } else if (contentLower.includes("homework") || contentLower.includes("assignment")) {
      setUserProfile((prev) => ({
        ...prev,
        goals: [...(prev.goals || []), "homework"].filter((v, i, a) => a.indexOf(v) === i),
      }))
    } else if (contentLower.includes("understand") || contentLower.includes("concept")) {
      setUserProfile((prev) => ({
        ...prev,
        goals: [...(prev.goals || []), "concepts"].filter((v, i, a) => a.indexOf(v) === i),
      }))
    }
  }

  // Custom submit handler to enhance the chat experience
  const handleEnhancedSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Hide suggestions when user starts chatting
    if (showSuggestions) {
      setShowSuggestions(false)
    }

    // Analyze user input before submitting
    analyzeMessage(input)

    handleSubmit(e)
  }

  // Handle selecting a problem
  const handleSelectProblem = (problem: MathProblem) => {
    setSelectedProblem(problem)
    setUserSolution("")
    setActiveTab("workspace")
  }

  // Modify the handleSubmitSolution function to show the "try again" dialog when answers are incorrect
  // Update the handleSubmitSolution function
  const handleSubmitSolution = () => {
    if (!selectedProblem || !userSolution.trim()) return

    // Clean up the user's solution and the correct solution for comparison
    const cleanUserSolution = userSolution.trim().toLowerCase().replace(/\s+/g, "")
    const cleanCorrectSolution = selectedProblem.solution
      ? selectedProblem.solution.toString().toLowerCase().replace(/\s+/g, "")
      : ""

    // Check if the answer is correct
    const isCorrect = cleanUserSolution === cleanCorrectSolution

    // Update the problem status
    setRecommendedProblems((prev) =>
      prev.map((p) =>
        p.id === selectedProblem.id
          ? {
              ...p,
              userSolution,
              status: isCorrect ? "solved" : "incorrect",
            }
          : p,
      ),
    )

    // Add a message to the chat
    const newMessageId = Date.now().toString()
    setMessages((prev) => [
      ...prev,
      {
        id: newMessageId,
        role: "user",
        content: `I've solved the problem: "${selectedProblem.statement}" with answer: ${userSolution}`,
      },
      {
        id: (Number.parseInt(newMessageId) + 1).toString(),
        role: "assistant",
        content: isCorrect
          ? `Great job! Your solution to "${selectedProblem.statement}" is correct! ${userSolution} is the right answer.`
          : `I checked your solution to "${selectedProblem.statement}", and I think there might be an issue. The correct answer is ${selectedProblem.solution}. Would you like me to explain how to solve it?`,
      },
    ])

    // Clear the solution input
    setUserSolution("")

    if (isCorrect) {
      // Show celebration effect and congratulations dialog if correct
      setShowConfetti(true)

      // Set congratulatory message based on difficulty
      let message = "Great job! You got it right!"
      if (selectedProblem.difficulty === "medium") {
        message = "Excellent work! That was a tricky one!"
      } else if (selectedProblem.difficulty === "hard") {
        message = "Outstanding! You solved a challenging problem!"
      }

      setCongratsMessage(message)
      setShowCongratulationsDialog(true)

      setTimeout(() => {
        // Select another unsolved problem if available
        const unsolvedProblems = recommendedProblems.filter(
          (p) => p.id !== selectedProblem.id && p.status === "unsolved",
        )
        if (unsolvedProblems.length > 0) {
          setSelectedProblem(unsolvedProblems[0])
        } else {
          setSelectedProblem(null)
        }
      }, 1500)
    } else {
      // For incorrect answers, find a recommended next problem
      // Look for an easier problem in the same topic
      const nextProblem = recommendedProblems.find(
        (p) =>
          p.id !== selectedProblem.id &&
          p.status === "unsolved" &&
          p.topic === selectedProblem.topic &&
          (p.difficulty === "easy" || (selectedProblem.difficulty === "hard" && p.difficulty === "medium")),
      )

      // If no easier problem in the same topic, just get any unsolved problem
      const fallbackProblem = recommendedProblems.find((p) => p.id !== selectedProblem.id && p.status === "unsolved")

      setNextRecommendedProblem(nextProblem || fallbackProblem || null)
      setShowTryAgainDialog(true)
    }
  }

  // Add a function to handle selecting the next recommended problem
  const handleSelectNextProblem = () => {
    if (nextRecommendedProblem) {
      handleSelectProblem(nextRecommendedProblem)
    }
    setShowTryAgainDialog(false)
  }

  // Handle asking for help
  const handleAskForHelp = () => {
    if (!selectedProblem || !helpQuestion.trim()) return

    // Update the problem status
    setRecommendedProblems((prev) =>
      prev.map((p) => (p.id === selectedProblem.id ? { ...p, status: "needs_help" } : p)),
    )

    // Get easier problems to suggest
    const easierProblems = recommendedProblems
      .filter(
        (p) =>
          p.id !== selectedProblem.id &&
          (p.difficulty === "easy" || (selectedProblem.difficulty === "hard" && p.difficulty === "medium")),
      )
      .slice(0, 2)

    const problemSuggestions =
      easierProblems.length > 0
        ? `\n\nBased on your current progress, you might want to try these problems first:\n${easierProblems.map((p) => `- ${p.statement}`).join("\n")}`
        : ""

    // Add messages to the chat
    const userMessageId = Date.now().toString()
    const aiMessageId = (Date.now() + 1).toString()

    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: `I need help with this problem: "${selectedProblem.statement}". ${helpQuestion}`,
      },
      {
        id: aiMessageId,
        role: "assistant",
        content: `I'll help you with "${selectedProblem.statement}". Let's break it down step by step.${problemSuggestions}`,
      },
    ])

    // Clear the help question input
    setHelpQuestion("")

    // Switch to chat tab
    setActiveTab("chat")
  }

  // Handle grade selection
  const handleGradeSelect = (grade: 1 | 2 | 3 | 4 | 5 | 6) => {
    setUserProfile((prev) => ({ ...prev, gradeLevel: grade }))
    setShowGradeDialog(false)

    // Add messages to the chat about the grade selection
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: `I'm in Primary ${grade}`,
      },
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Great! Now that I know you're in Primary ${grade}, what math topic would you like to learn about? We can explore numbers, measurement, fractions, shapes, or data handling.`,
      },
    ])
  }

  // Filter problems based on difficulty and topic
  const filteredProblems = recommendedProblems.filter((problem) => {
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter
    const matchesTopic = topicFilter === "all" || problem.topic === topicFilter
    return matchesDifficulty && matchesTopic
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
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "solved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "incorrect":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "needs_help":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="h-4 w-4" />
      case "incorrect":
        return <X className="h-4 w-4" />
      case "needs_help":
        return <HelpCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  // Add the congratulations dialog to the return statement, right after the grade selection dialog
  return (
    <main className="flex min-h-screen flex-col p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Celebration confetti effect */}
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
      )}

      {/* Grade selection dialog */}
      <Dialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Welcome to Math Buddy!</DialogTitle>
            <DialogDescription className="text-center">
              Please select your grade level so we can personalize your learning experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {[1, 2, 3, 4, 5, 6].map((grade) => (
              <Button
                key={grade}
                variant="outline"
                className="h-24 flex flex-col gap-2 hover:bg-primary/10"
                onClick={() => handleGradeSelect(grade as 1 | 2 | 3 | 4 | 5 | 6)}
              >
                <School className="h-8 w-8 text-primary" />
                <span>Primary {grade}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Congratulations dialog */}
      <Dialog open={showCongratulationsDialog} onOpenChange={setShowCongratulationsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <PartyPopper className="h-6 w-6 text-yellow-500" />
              Congratulations!
              <PartyPopper className="h-6 w-6 text-yellow-500" />
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-xl font-medium mb-2">{congratsMessage}</p>
            <p className="text-muted-foreground">Keep up the great work!</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCongratulationsDialog(false)} className="w-full">
              Continue Learning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Try Again dialog */}
      <Dialog open={showTryAgainDialog} onOpenChange={setShowTryAgainDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <X className="h-6 w-6 text-red-500" />
              Please Try Again
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-xl font-medium mb-4">Your answer wasn&apos;t quite right.</p>
            <p className="text-muted-foreground mb-4">
              Don&apos;t worry if you don&apos;t understand everything yet! Learning math takes practice. You can try this problem again or try a different one.
            </p>
            {nextRecommendedProblem && (
              <div className="bg-muted p-4 rounded-md mt-4">
                <p className="font-medium mb-2">Recommended next problem:</p>
                <p className="mb-2">{nextRecommendedProblem.statement}</p>
                <div className="flex items-center gap-2 justify-center">
                  <Badge variant="outline" className={getDifficultyColor(nextRecommendedProblem.difficulty)}>
                    {nextRecommendedProblem.difficulty.charAt(0).toUpperCase() +
                      nextRecommendedProblem.difficulty.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {nextRecommendedProblem.topic.charAt(0).toUpperCase() + nextRecommendedProblem.topic.slice(1)}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowTryAgainDialog(false)} className="sm:flex-1">
              Try Again
            </Button>
            {nextRecommendedProblem && (
              <Button onClick={handleSelectNextProblem} className="sm:flex-1">
                Try Recommended Problem
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-6xl mx-auto space-y-6">
        <AvatarGuide
          message={
            userProfile.gradeLevel
              ? `Hi there, Primary ${userProfile.gradeLevel} student! I'm your math buddy! Let's learn mathematics together!`
              : "Hi there! I'm your math buddy! Tell me which grade you're in so I can help you better!"
          }
        />

        {/* Main content area with tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="recommendations">
              <BookOpen className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="workspace">
              <PenTool className="h-4 w-4 mr-2" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="chat">
              <Bot className="h-4 w-4 mr-2" />
              AI Tutor
            </TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Math Problems</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateRecommendedProblems(userProfile.gradeLevel || 1, topicId || undefined)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardTitle>
                <CardDescription>Select a problem to solve or ask for help from the AI tutor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">Difficulty</label>
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">Topic</label>
                    <Select value={topicFilter} onValueChange={setTopicFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        <SelectItem value="numbers">Number & Algebra</SelectItem>
                        <SelectItem value="measurement">Measurement</SelectItem>
                        <SelectItem value="fractions">Fractions</SelectItem>
                        <SelectItem value="geometry">Geometry</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {filteredProblems.length > 0 ? (
                      filteredProblems.map((problem) => (
                        <Card
                          key={problem.id}
                          className={`cursor-pointer hover:shadow-md transition-shadow ${
                            selectedProblem?.id === problem.id ? "border-primary" : ""
                          }`}
                          onClick={() => handleSelectProblem(problem)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getTopicIcon(problem.topic)}
                                  <span className="font-medium">{problem.statement}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                  </Badge>
                                  {problem.status !== "unsolved" && (
                                    <Badge className={getStatusColor(problem.status)}>
                                      <span className="flex items-center gap-1">
                                        {getStatusIcon(problem.status)}
                                        {problem.status.charAt(0).toUpperCase() +
                                          problem.status.slice(1).replace("_", " ")}
                                      </span>
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSelectProblem(problem)
                                }}
                              >
                                Solve
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No problems match your filters. Try changing your filters or refreshing the recommendations.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workspace Tab */}
          <TabsContent value="workspace" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedProblem ? `Problem: ${selectedProblem.statement}` : "Select a problem from Recommendations"}
                </CardTitle>
                {selectedProblem && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className={getDifficultyColor(selectedProblem.difficulty)}>
                      {selectedProblem.difficulty.charAt(0).toUpperCase() + selectedProblem.difficulty.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {selectedProblem.topic.charAt(0).toUpperCase() + selectedProblem.topic.slice(1)}
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProblem ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Solution:</label>
                      <Textarea
                        placeholder="Enter your solution here..."
                        value={userSolution}
                        onChange={(e) => setUserSolution(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <div className="flex justify-between gap-4">
                      <Button className="flex-1" onClick={handleSubmitSolution} disabled={!userSolution.trim()}>
                        <PartyPopper className="h-4 w-4 mr-2" />
                        Submit Solution
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setActiveTab("recommendations")}>
                        Back to Problems
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Need Help? Ask the AI Tutor:</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="What are you struggling with?"
                          value={helpQuestion}
                          onChange={(e) => setHelpQuestion(e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="secondary" onClick={handleAskForHelp} disabled={!helpQuestion.trim()}>
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Ask for Help
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="drawing">
                          <AccordionTrigger className="font-medium">Draw your work (optional)</AccordionTrigger>
                          <AccordionContent>
                            <DrawingCanvas
                              onSubmit={(imageData) => {
                                // Add the drawing to the chat
                                const newMessageId = Date.now().toString()
                                setMessages((prev) => [
                                  ...prev,
                                  {
                                    id: newMessageId,
                                    role: "user",
                                    content: `I've drawn my work for the problem: "${selectedProblem.statement}"`,
                                  },
                                ])

                                setExtendedMessages((prev) => [
                                  ...prev,
                                  {
                                    id: newMessageId,
                                    role: "user",
                                    content: `I've drawn my work for the problem: "${selectedProblem.statement}"`,
                                    imageUrl: imageData,
                                  },
                                ])

                                // Switch to chat tab
                                setActiveTab("chat")
                              }}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Select a problem from the Recommendations tab to start working on it.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab("recommendations")}>
                      Browse Problems
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-4">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Math Buddy
                  {userProfile.gradeLevel && (
                    <span className="ml-2 text-xs bg-primary/10 px-2 py-1 rounded-full">
                      Primary {userProfile.gradeLevel}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4" ref={chatContainerRef}>
                  <div className="space-y-4">
                    {extendedMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === "assistant" ? "items-start" : "items-start flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full ${
                            message.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                        </div>
                        <div
                          className={`flex-1 px-4 py-2 rounded-lg ${
                            message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <div className="mb-2">{message.content}</div>

                          {/* Display image if present */}
                          {message.imageUrl && message.annotations ? (
                            <AnnotatedImage
                              imageUrl={message.imageUrl}
                              annotations={message.annotations}
                              className="mt-2 overflow-hidden"
                            />
                          ) : message.imageUrl ? (
                            <div className="mt-2 overflow-hidden rounded-md border">
                              <img
                                src={message.imageUrl || "/placeholder.svg"}
                                alt="User drawing"
                                className="w-full h-auto"
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <form onSubmit={handleEnhancedSubmit} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder={
                        userProfile.gradeLevel
                          ? "Ask me about any math topic..."
                          : "Tell me which grade you're in (Primary 1-6)..."
                      }
                      className="flex-1"
                    />
                    <Button type="submit">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

