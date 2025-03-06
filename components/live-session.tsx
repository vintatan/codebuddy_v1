"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AvatarGuide } from "./avatar-guide"
import { useChat } from "ai/react"
import { Play, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { MonsterAvatar } from "@/components/monster-avatar"

interface LiveSessionProps {
  studentName?: string
  taskId?: string
}

export function LiveSession({ studentName = "Student", taskId }: LiveSessionProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [actions, setActions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const { messages, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "initial",
        role: "assistant",
        content: "Hello! I'm here to help you learn coding. What would you like to explore today?",
      },
    ],
  })

  // Handle sending actions to webhook with simplified error handling
  const sendAction = useCallback(
    async (action: string) => {
      setIsLoading(true)
      try {
        // Build URL with query parameters instead of using POST body
        const url = new URL("/api/webhook", window.location.origin)
        url.searchParams.append("action", action)
        url.searchParams.append("studentName", studentName)
        url.searchParams.append("taskId", taskId || "default_task")

        const response = await fetch(url.toString(), {
          method: "GET", // Changed from POST to GET
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          // Just log the error but don't interrupt the user experience
          console.log("Webhook notification failed, but continuing session")
        }
      } catch (error) {
        // Just log the error and continue
        console.log("Failed to send action, but continuing session:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [studentName, taskId],
  )

  // Simulate receiving student actions
  useEffect(() => {
    if (!isStreaming) {
      setIsStreaming(true)

      // Add initial welcome message
      setMessages((prev) => [
        ...prev,
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! I'm your AI tutor. I'll be guiding you through your coding journey!",
        },
      ])
    }

    const interval = setInterval(async () => {
      const newAction = `${studentName} is exploring the lesson`
      setActions((prev) => [...prev, newAction])

      try {
        await sendAction(newAction)
      } catch (error) {
        // Error already handled in sendAction
      }
    }, 10000) // Reduced frequency to every 10 seconds

    return () => clearInterval(interval)
  }, [studentName, sendAction, setMessages, isStreaming])

  return (
    <div className="space-y-4">
      <AvatarGuide message="I'm here to help and provide feedback on your progress!" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className={`h-5 w-5 ${isStreaming ? "text-green-500" : "text-gray-500"}`} />
            Live Session {isLoading && "(Sending...)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {actions.map((action, index) => (
                <div key={index} className="flex items-start gap-2 mb-2">
                  <User className="h-5 w-5 mt-1" />
                  <p className={isLoading && index === actions.length - 1 ? "opacity-50" : ""}>{action}</p>
                </div>
              ))}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 mb-2 ${message.role === "assistant" ? "text-primary" : ""}`}
                >
                  {message.role === "assistant" ? (
                    <div className="flex items-start gap-2">
                      <MonsterAvatar type="smart" size="sm" />
                      <div className="flex-1 space-y-2">
                        {message.content.split("\n").map((line, i) => {
                          // Add special styling for step numbers and emojis
                          if (line.match(/^\d+\./)) {
                            return (
                              <div key={i} className="pl-4 animate-pop">
                                <span className="font-medium">{line}</span>
                              </div>
                            )
                          }
                          // Style emoji sections
                          if (line.match(/^[📝🔍➕➖✖️➗✨✅🌟❌🤔]/u)) {
                            return (
                              <div key={i} className="flex items-start gap-2 animate-pop">
                                <span className="text-xl">{line.charAt(0)}</span>
                                <span>{line.slice(1)}</span>
                              </div>
                            )
                          }
                          // Style mathematical expressions
                          if (line.includes("--------")) {
                            return (
                              <pre key={i} className="font-mono bg-primary/5 p-2 rounded-md">
                                {line}
                              </pre>
                            )
                          }
                          return <p key={i}>{line}</p>
                        })}
                      </div>
                    </div>
                  ) : (
                    <>
                      <User className="h-5 w-5 mt-1" />
                      <p>{message.content}</p>
                    </>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

