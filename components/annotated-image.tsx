"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface AnnotatedImageProps {
  imageUrl: string
  annotations?: Annotation[]
  className?: string
}

interface Annotation {
  type: "circle" | "rectangle" | "arrow" | "text" | "tick" | "cross" | "thinking"
  x: number
  y: number
  width?: number
  height?: number
  color: string
  text?: string
  fontSize?: number
  steps?: string[]
}

export function AnnotatedImage({ imageUrl, annotations = [], className }: AnnotatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Draw image and annotations
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create new image
    const img = new Image()
    img.crossOrigin = "anonymous"

    // Set up image load handler
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw image
      ctx.drawImage(img, 0, 0)

      // Draw annotations
      if (annotations && annotations.length > 0) {
        annotations.forEach((annotation) => {
          if (!annotation) return

          ctx.strokeStyle = annotation.color || "#FF0000"
          ctx.fillStyle = annotation.color || "#FF0000"
          ctx.lineWidth = 3
          ctx.font = `${annotation.fontSize || 16}px sans-serif`

          switch (annotation.type) {
            case "circle": {
              const radius = annotation.width || 20
              ctx.beginPath()
              ctx.arc(annotation.x, annotation.y, radius, 0, 2 * Math.PI)
              ctx.stroke()
              break
            }

            case "rectangle": {
              const width = annotation.width || 50
              const height = annotation.height || 30
              ctx.beginPath()
              ctx.rect(annotation.x, annotation.y, width, height)
              ctx.stroke()
              break
            }

            case "arrow": {
              // Draw arrow line
              const arrowLength = annotation.width || 50
              const endX = annotation.x + arrowLength
              const endY = annotation.y

              ctx.beginPath()
              ctx.moveTo(annotation.x, annotation.y)
              ctx.lineTo(endX, endY)
              ctx.stroke()

              // Draw arrowhead
              const headLength = 10
              const angle = Math.atan2(endY - annotation.y, endX - annotation.x)

              ctx.beginPath()
              ctx.moveTo(endX, endY)
              ctx.lineTo(
                endX - headLength * Math.cos(angle - Math.PI / 6),
                endY - headLength * Math.sin(angle - Math.PI / 6),
              )
              ctx.lineTo(
                endX - headLength * Math.cos(angle + Math.PI / 6),
                endY - headLength * Math.sin(angle + Math.PI / 6),
              )
              ctx.closePath()
              ctx.fill()
              break
            }

            case "text": {
              if (annotation.text) {
                ctx.fillText(annotation.text, annotation.x, annotation.y)
              }
              break
            }

            case "tick": {
              // Draw a tick mark (✓)
              ctx.lineWidth = 4
              ctx.beginPath()
              ctx.moveTo(annotation.x - 10, annotation.y)
              ctx.lineTo(annotation.x - 5, annotation.y + 10)
              ctx.lineTo(annotation.x + 10, annotation.y - 10)
              ctx.stroke()
              break
            }

            case "cross": {
              // Draw a cross mark (✗)
              ctx.lineWidth = 4
              ctx.beginPath()
              ctx.moveTo(annotation.x - 10, annotation.y - 10)
              ctx.lineTo(annotation.x + 10, annotation.y + 10)
              ctx.stroke()
              ctx.beginPath()
              ctx.moveTo(annotation.x + 10, annotation.y - 10)
              ctx.lineTo(annotation.x - 10, annotation.y + 10)
              ctx.stroke()
              break
            }

            case "thinking": {
              // Draw a thinking bubble with steps
              if (!annotation.steps || annotation.steps.length === 0) break

              const bubbleWidth = 200
              const lineHeight = 20
              const padding = 10
              const bubbleHeight = annotation.steps.length * lineHeight + padding * 2
              const radius = 10

              // Draw the bubble
              ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
              ctx.strokeStyle = annotation.color
              ctx.lineWidth = 2

              // Draw rounded rectangle
              ctx.beginPath()
              ctx.moveTo(annotation.x + radius, annotation.y)
              ctx.lineTo(annotation.x + bubbleWidth - radius, annotation.y)
              ctx.quadraticCurveTo(
                annotation.x + bubbleWidth,
                annotation.y,
                annotation.x + bubbleWidth,
                annotation.y + radius,
              )
              ctx.lineTo(annotation.x + bubbleWidth, annotation.y + bubbleHeight - radius)
              ctx.quadraticCurveTo(
                annotation.x + bubbleWidth,
                annotation.y + bubbleHeight,
                annotation.x + bubbleWidth - radius,
                annotation.y + bubbleHeight,
              )
              ctx.lineTo(annotation.x + radius, annotation.y + bubbleHeight)
              ctx.quadraticCurveTo(
                annotation.x,
                annotation.y + bubbleHeight,
                annotation.x,
                annotation.y + bubbleHeight - radius,
              )
              ctx.lineTo(annotation.x, annotation.y + radius)
              ctx.quadraticCurveTo(annotation.x, annotation.y, annotation.x + radius, annotation.y)
              ctx.closePath()
              ctx.fill()
              ctx.stroke()

              // Draw the tail of the bubble
              ctx.beginPath()
              ctx.moveTo(annotation.x + 20, annotation.y + bubbleHeight)
              ctx.lineTo(annotation.x - 10, annotation.y + bubbleHeight + 20)
              ctx.lineTo(annotation.x + 40, annotation.y + bubbleHeight)
              ctx.closePath()
              ctx.fill()
              ctx.stroke()

              // Draw the steps text
              ctx.fillStyle = "#000000"
              ctx.font = "14px sans-serif"
              annotation.steps.forEach((step, index) => {
                ctx.fillText(step, annotation.x + padding, annotation.y + padding + index * lineHeight + 14)
              })
              break
            }
          }
        })
      }

      setIsLoaded(true)
    }

    // Handle image load errors
    img.onerror = () => {
      console.error("Error loading image:", imageUrl)
      setIsLoaded(true) // Set loaded to true anyway to remove loading state
    }

    // Set image source to trigger loading
    img.src = imageUrl
  }, [imageUrl, annotations])

  return (
    <Card className={className}>
      <div className="relative overflow-hidden rounded-md">
        {!isLoaded && <div className="animate-pulse bg-muted h-[300px] w-full rounded-md"></div>}
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{
            maxHeight: "500px",
            objectFit: "contain",
            display: isLoaded ? "block" : "none",
          }}
        />
      </div>
    </Card>
  )
}

