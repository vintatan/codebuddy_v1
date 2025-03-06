"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, LightbulbIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ProblemFeedbackProps {
  problemStatement: string
  studentSolution: string
  isCorrect: boolean
  correctAnswer?: string
  explanation?: string
  thinkingProcess?: string[]
  onNext?: () => void
}

export function ProblemFeedback({
  problemStatement,
  studentSolution,
  isCorrect,
  correctAnswer,
  explanation,
  thinkingProcess = [],
  onNext,
}: ProblemFeedbackProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <Card className={isCorrect ? "border-green-500" : "border-red-500"}>
      <CardHeader className={isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}>
        <CardTitle className="flex items-center gap-2">
          {isCorrect ? (
            <>
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Correct Solution!</span>
            </>
          ) : (
            <>
              <X className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span>Incorrect Solution</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Problem:</h3>
          <p className="bg-muted p-3 rounded-md">{problemStatement}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Your Solution:</h3>
          <p className="bg-muted p-3 rounded-md">{studentSolution}</p>
        </div>

        {!isCorrect && correctAnswer && (
          <div className="space-y-2">
            <h3 className="font-medium">Correct Answer:</h3>
            <p className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
              {correctAnswer}
            </p>
          </div>
        )}

        {!isCorrect && explanation && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="explanation">
              <AccordionTrigger className="text-blue-600 dark:text-blue-400 font-medium">
                <div className="flex items-center gap-2">
                  <LightbulbIcon className="h-4 w-4" />
                  <span>Show Explanation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800 mt-2">
                  <p>{explanation}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {!isCorrect && thinkingProcess && thinkingProcess.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="thinking">
              <AccordionTrigger className="text-purple-600 dark:text-purple-400 font-medium">
                <div className="flex items-center gap-2">
                  <LightbulbIcon className="h-4 w-4" />
                  <span>Show Step-by-Step Thinking</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md border border-purple-200 dark:border-purple-800 mt-2">
                  <ol className="list-decimal pl-5 space-y-2">
                    {thinkingProcess.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {onNext && (
          <Button
            className={isCorrect ? "bg-green-600 hover:bg-green-700 w-full" : "bg-blue-600 hover:bg-blue-700 w-full"}
            onClick={onNext}
          >
            {isCorrect ? "Next Problem" : "Try Again"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

