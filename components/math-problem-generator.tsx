"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DrawingCanvas } from "./drawing-canvas"
import { ProblemFeedback } from "./problem-feedback"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenTool, RefreshCw } from "lucide-react"
import { AnnotatedImage } from "./annotated-image"

interface MathProblemGeneratorProps {
  gradeLevel?: 1 | 2 | 3 | 4 | 5 | 6
  topic?: string
}

interface Problem {
  id: string
  statement: string
  solution: string
  explanation: string
  thinkingProcess: string[]
  difficulty: "easy" | "medium" | "hard"
}

export function MathProblemGenerator({ gradeLevel = 1, topic }: MathProblemGeneratorProps) {
  const [activeTab, setActiveTab] = useState<string>("problem")
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    shown: boolean
    isCorrect: boolean
    studentSolution: string
    imageData?: string
    annotations?: any[]
  } | null>(null)

  // Generate a problem based on grade level and topic
  const generateProblem = useCallback(() => {
    // Reset state
    setFeedback(null)
    setActiveTab("problem")

    // In a real app, this would call an API to generate a problem
    // For now, we'll use some sample problems based on grade level
    const problems: Record<number, Problem[]> = {
      1: [
        {
          id: "p1-1",
          statement: "What is 5 + 3?",
          solution: "8",
          explanation: "To add 5 and 3, we count 3 more after 5: 6, 7, 8. So 5 + 3 = 8.",
          thinkingProcess: [
            "I need to add 5 and 3 together.",
            "I can count up 3 more from 5: 5 → 6 → 7 → 8.",
            "So 5 + 3 = 8.",
          ],
          difficulty: "easy",
        },
        {
          id: "p1-2",
          statement: "What is 7 - 2?",
          solution: "5",
          explanation: "To subtract 2 from 7, we count back 2 from 7: 7, 6, 5. So 7 - 2 = 5.",
          thinkingProcess: ["I need to subtract 2 from 7.", "I can count back 2 from 7: 7 → 6 → 5.", "So 7 - 2 = 5."],
          difficulty: "easy",
        },
        {
          id: "p1-3",
          statement: "What is 4 × 2?",
          solution: "8",
          explanation: "Multiplication means adding a number to itself multiple times. 4 × 2 means 4 + 4 = 8.",
          thinkingProcess: [
            "4 × 2 means 4 added 2 times.",
            "So I need to calculate 4 + 4.",
            "4 + 4 = 8.",
            "Therefore, 4 × 2 = 8.",
          ],
          difficulty: "medium",
        },
      ],
      2: [
        {
          id: "p2-1",
          statement: "What is 12 + 15?",
          solution: "27",
          explanation: "We can add the ones: 2 + 5 = 7, then add the tens: 10 + 10 = 20. So 12 + 15 = 20 + 7 = 27.",
          thinkingProcess: [
            "I need to add 12 and 15.",
            "I'll break it down by place value.",
            "Ones place: 2 + 5 = 7",
            "Tens place: 10 + 10 = 20",
            "Combining: 20 + 7 = 27",
            "So 12 + 15 = 27.",
          ],
          difficulty: "easy",
        },
        {
          id: "p2-2",
          statement: "What is 3 × 4?",
          solution: "12",
          explanation: "3 × 4 means 3 groups of 4, which is 4 + 4 + 4 = 12.",
          thinkingProcess: [
            "3 × 4 means 3 groups of 4.",
            "I can write this as 4 + 4 + 4.",
            "4 + 4 = 8",
            "8 + 4 = 12",
            "Therefore, 3 × 4 = 12.",
          ],
          difficulty: "medium",
        },
        {
          id: "p2-3",
          statement: "What is 20 ÷ 4?",
          solution: "5",
          explanation:
            "Division means splitting into equal groups. 20 ÷ 4 means splitting 20 into 4 equal groups. Each group will have 5 items.",
          thinkingProcess: [
            "20 ÷ 4 means dividing 20 into 4 equal groups.",
            "I need to find how many items are in each group.",
            "I know that 4 × 5 = 20.",
            "So if I divide 20 into 4 groups, each group will have 5 items.",
            "Therefore, 20 ÷ 4 = 5.",
          ],
          difficulty: "medium",
        },
      ],
      3: [
        {
          id: "p3-1",
          statement: "What is 125 + 237?",
          solution: "362",
          explanation:
            "We add the ones: 5 + 7 = 12, carry the 1. Then add the tens: 1 + 2 + 3 = 6. Then add the hundreds: 1 + 2 = 3. So 125 + 237 = 362.",
          thinkingProcess: [
            "I need to add 125 and 237.",
            "I'll add by place value, starting with the ones place.",
            "Ones place: 5 + 7 = 12. I write down 2 and carry 1 to the tens place.",
            "Tens place: 1 (carried) + 2 + 3 = 6. I write down 6.",
            "Hundreds place: 1 + 2 = 3. I write down 3.",
            "Reading from left to right: 362.",
            "So 125 + 237 = 362.",
          ],
          difficulty: "medium",
        },
        {
          id: "p3-2",
          statement: "What is 1/2 + 1/4?",
          solution: "3/4",
          explanation:
            "To add fractions with different denominators, we need to find a common denominator. 1/2 = 2/4, so 1/2 + 1/4 = 2/4 + 1/4 = 3/4.",
          thinkingProcess: [
            "I need to add 1/2 and 1/4.",
            "These fractions have different denominators, so I need to find a common denominator.",
            "The denominator 4 is a multiple of 2, so I'll convert 1/2 to an equivalent fraction with denominator 4.",
            "1/2 = (1×2)/(2×2) = 2/4",
            "Now I can add: 2/4 + 1/4 = 3/4",
            "So 1/2 + 1/4 = 3/4.",
          ],
          difficulty: "hard",
        },
        {
          id: "p3-3",
          statement: "What is 7 × 8?",
          solution: "56",
          explanation:
            "We can use the multiplication table or break it down: 7 × 8 = 7 × (4 × 2) = 7 × 4 × 2 = 28 × 2 = 56.",
          thinkingProcess: [
            "I need to multiply 7 × 8.",
            "I can break this down into smaller multiplications that I know.",
            "I know that 7 × 4 = 28.",
            "So 7 × 8 = 7 × (4 × 2) = (7 × 4) × 2 = 28 × 2 = 56.",
            "Therefore, 7 × 8 = 56.",
          ],
          difficulty: "medium",
        },
      ],
      4: [
        {
          id: "p4-1",
          statement: "What is the area of a rectangle with length 7 cm and width 4 cm?",
          solution: "28 square cm",
          explanation: "The area of a rectangle is length × width. So the area is 7 cm × 4 cm = 28 square cm.",
          thinkingProcess: [
            "I need to find the area of a rectangle.",
            "The formula for the area of a rectangle is: Area = Length × Width",
            "Given: Length = 7 cm, Width = 4 cm",
            "Area = 7 cm × 4 cm = 28 square cm",
            "Therefore, the area of the rectangle is 28 square cm.",
          ],
          difficulty: "medium",
        },
        {
          id: "p4-2",
          statement: "What is 3/5 of 25?",
          solution: "15",
          explanation: "To find 3/5 of 25, we multiply: 3/5 × 25 = 3 × 5 = 15.",
          thinkingProcess: [
            "I need to find 3/5 of 25.",
            "'Of' means multiplication in math, so I need to calculate 3/5 × 25.",
            "I can simplify this: 3/5 × 25 = 3 × (25 ÷ 5) = 3 × 5 = 15.",
            "Therefore, 3/5 of 25 is 15.",
          ],
          difficulty: "medium",
        },
        {
          id: "p4-3",
          statement: "What is 4 × 6 ÷ 2?",
          solution: "12",
          explanation:
            "Following the order of operations, we multiply first, then divide: 4 × 6 = 24, then 24 ÷ 2 = 12.",
          thinkingProcess: [
            "I need to calculate 4 × 6 ÷ 2.",
            "According to the order of operations (PEMDAS), I should multiply before dividing.",
            "Step 1: 4 × 6 = 24",
            "Step 2: 24 ÷ 2 = 12",
            "Therefore, 4 × 6 ÷ 2 = 12.",
          ],
          difficulty: "medium",
        },
      ],
      5: [
        {
          id: "p5-1",
          statement: "If a shirt costs $24 and is on sale for 25% off, what is the sale price?",
          solution: "$18",
          explanation: "25% of $24 is 0.25 × $24 = $6. So the sale price is $24 - $6 = $18.",
          thinkingProcess: [
            "I need to find the sale price of a $24 shirt that's 25% off.",
            "Step 1: Calculate the discount amount. 25% of $24 = 0.25 × $24 = $6.",
            "Step 2: Subtract the discount from the original price. $24 - $6 = $18.",
            "Therefore, the sale price is $18.",
          ],
          difficulty: "hard",
        },
        {
          id: "p5-2",
          statement: "What is the ratio of 15 to 25 in simplest form?",
          solution: "3:5",
          explanation:
            "To simplify the ratio 15:25, we divide both numbers by their greatest common factor, which is 5. So 15:25 = 3:5.",
          thinkingProcess: [
            "I need to simplify the ratio 15:25.",
            "To simplify a ratio, I need to divide both numbers by their greatest common factor (GCF).",
            "The factors of 15 are: 1, 3, 5, 15.",
            "The factors of 25 are: 1, 5, 25.",
            "The greatest common factor is 5.",
            "Dividing both numbers by 5: 15 ÷ 5 = 3 and 25 ÷ 5 = 5.",
            "Therefore, the ratio 15:25 simplified is 3:5.",
          ],
          difficulty: "medium",
        },
        {
          id: "p5-3",
          statement: "What is 2.5 × 0.4?",
          solution: "1",
          explanation:
            "To multiply decimals, we multiply as if they were whole numbers, then place the decimal point. 25 × 4 = 100, so 2.5 × 0.4 = 1.0 = 1.",
          thinkingProcess: [
            "I need to multiply 2.5 × 0.4.",
            "Step 1: Count the total number of decimal places in both numbers. 2.5 has 1 decimal place and 0.4 has 1 decimal place, so the total is 2 decimal places.",
            "Step 2: Multiply the numbers as if they were whole numbers. 25 × 4 = 100.",
            "Step 3: Place the decimal point in the result by counting the total number of decimal places from the left. 100 with 2 decimal places is 1.00 = 1.",
            "Therefore, 2.5 × 0.4 = 1.",
          ],
          difficulty: "hard",
        },
      ],
      6: [
        {
          id: "p6-1",
          statement: "Solve for x: 3x + 7 = 22",
          solution: "x = 5",
          explanation: "To solve for x, we subtract 7 from both sides: 3x = 15. Then divide both sides by 3: x = 5.",
          thinkingProcess: [
            "I need to solve the equation 3x + 7 = 22 for x.",
            "Step 1: Subtract 7 from both sides to isolate the term with x.\n  3x + 7 - 7 = 22 - 7\n  3x = 15",
            "Step 2: Divide both sides by 3 to solve for x.\n  3x ÷ 3 = 15 ÷ 3\n  x = 5",
            "Therefore, the solution is x = 5.",
          ],
          difficulty: "hard",
        },
        {
          id: "p6-2",
          statement: "A car travels 210 km in 3 hours. What is its average speed?",
          solution: "70 km/h",
          explanation: "Average speed = distance ÷ time = 210 km ÷ 3 h = 70 km/h.",
          thinkingProcess: [
            "I need to find the average speed of a car.",
            "The formula for average speed is: Average speed = Total distance ÷ Total time",
            "Given: Distance = 210 km, Time = 3 hours",
            "Average speed = 210 km ÷ 3 h = 70 km/h",
            "Therefore, the average speed of the car is 70 km/h.",
          ],
          difficulty: "medium",
        },
        {
          id: "p6-3",
          statement: "What is the value of 2³ + 4²?",
          solution: "24",
          explanation: "2³ means 2 × 2 × 2 = 8, and 4² means 4 × 4 = 16. So 2³ + 4² = 8 + 16 = 24.",
          thinkingProcess: [
            "I need to calculate 2³ + 4².",
            "Step 1: Calculate 2³. This means 2 raised to the power of 3, or 2 × 2 × 2 = 8.",
            "Step 2: Calculate 4². This means 4 raised to the power of 2, or 4 × 4 = 16.",
            "Step 3: Add the results. 8 + 16 = 24.",
            "Therefore, 2³ + 4² = 24.",
          ],
          difficulty: "hard",
        },
      ],
    }

    // Get problems for the current grade level
    const gradeProblems = problems[gradeLevel] || problems[1]

    // Select a random problem
    const randomIndex = Math.floor(Math.random() * gradeProblems.length)
    setCurrentProblem(gradeProblems[randomIndex])
  }, [gradeLevel])

  // Generate a problem when the component mounts or grade level changes
  useEffect(() => {
    generateProblem()
  }, [generateProblem])

  // Handle drawing submission
  const handleDrawingSubmit = (imageData: string) => {
    setIsSubmitting(true)

    // In a real app, this would send the drawing to an API for analysis
    // For now, we'll simulate the AI's response
    setTimeout(() => {
      // Randomly determine if the answer is correct (for demo purposes)
      // In a real app, this would be based on actual analysis of the drawing
      const isCorrect = Math.random() > 0.5

      if (isCorrect) {
        // Correct answer
        setFeedback({
          shown: true,
          isCorrect: true,
          studentSolution: currentProblem?.solution || "",
          imageData,
          annotations: [
            {
              type: "tick",
              x: 50,
              y: 50,
              color: "#00AA00", // Green color
              text: "Correct!",
            },
            {
              type: "text",
              x: 70,
              y: 50,
              color: "#00AA00",
              text: "Great job!",
            },
          ],
        })
      } else {
        // Incorrect answer - for example, if the problem is 4 * 2 = 4
        const problemStatement = currentProblem?.statement || ""

        // Example for 4 * 2 = 4 (incorrect)
        if (problemStatement.includes("4 × 2") || problemStatement.includes("4 * 2")) {
          setFeedback({
            shown: true,
            isCorrect: false,
            studentSolution: "4", // Simulating the student wrote the wrong answer
            imageData,
            annotations: [
              {
                type: "cross",
                x: 50,
                y: 50,
                color: "#FF0000", // Red color
              },
              {
                type: "circle",
                x: 150,
                y: 150,
                width: 30,
                color: "#FF0000",
              },
              {
                type: "text",
                x: 70,
                y: 50,
                color: "#FF0000",
                text: "Incorrect solution",
              },
              {
                type: "thinking",
                x: 200,
                y: 70,
                color: "#0066CC",
                steps: ["4 × 2 means 4 added twice", "4 + 4 = 8", "Not 4 as written"],
              },
            ],
          })
        } else {
          // Generic incorrect answer
          setFeedback({
            shown: true,
            isCorrect: false,
            studentSolution: "Incorrect approach",
            imageData,
            annotations: [
              {
                type: "cross",
                x: 50,
                y: 50,
                color: "#FF0000", // Red color
              },
              {
                type: "circle",
                x: 150,
                y: 150,
                width: 30,
                color: "#FF0000",
              },
              {
                type: "text",
                x: 70,
                y: 50,
                color: "#FF0000",
                text: "Incorrect solution",
              },
              {
                type: "thinking",
                x: 200,
                y: 70,
                color: "#0066CC",
                steps: currentProblem?.thinkingProcess || ["Let's think step by step"],
              },
            ],
          })
        }
      }

      setIsSubmitting(false)
      setActiveTab("feedback")
    }, 1500)
  }

  // Handle next problem
  const handleNextProblem = () => {
    generateProblem()
  }

  if (!currentProblem) {
    return <div className="animate-pulse bg-muted h-[300px] rounded-md"></div>
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="problem">Problem</TabsTrigger>
          <TabsTrigger value="workspace">
            <PenTool className="h-4 w-4 mr-2" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="feedback" disabled={!feedback?.shown}>
            Feedback
          </TabsTrigger>
        </TabsList>

        {/* Problem Tab */}
        <TabsContent value="problem" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Math Problem</span>
                <Button variant="outline" size="icon" onClick={generateProblem}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <p className="text-lg">{currentProblem.statement}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Solve this problem in the workspace tab. Draw your solution and submit it for feedback.
              </p>
              <Button onClick={() => setActiveTab("workspace")} className="w-full">
                <PenTool className="h-4 w-4 mr-2" />
                Open Workspace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workspace Tab */}
        <TabsContent value="workspace" className="mt-4">
          <DrawingCanvas onSubmit={handleDrawingSubmit} title={`Problem: ${currentProblem.statement}`} />
          {isSubmitting && (
            <div className="mt-4 p-4 bg-muted rounded-md text-center">
              <p className="text-sm animate-pulse">Checking your solution...</p>
            </div>
          )}
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="mt-4">
          {feedback && (
            <ProblemFeedback
              problemStatement={currentProblem.statement}
              studentSolution={feedback.studentSolution}
              isCorrect={feedback.isCorrect}
              correctAnswer={feedback.isCorrect ? undefined : currentProblem.solution}
              explanation={feedback.isCorrect ? undefined : currentProblem.explanation}
              thinkingProcess={feedback.isCorrect ? undefined : currentProblem.thinkingProcess}
              onNext={handleNextProblem}
            />
          )}

          {feedback?.imageData && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Your Work with AI Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {feedback.annotations ? (
                  <AnnotatedImage
                    imageUrl={feedback.imageData}
                    annotations={feedback.annotations}
                    className="overflow-hidden"
                  />
                ) : (
                  <div className="overflow-hidden rounded-md border">
                    <img src={feedback.imageData || "/placeholder.svg"} alt="Your solution" className="w-full h-auto" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

