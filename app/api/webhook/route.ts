import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Use the new webhook URL directly
  const webhookUrl = "https://vintatan.app.n8n.cloud/webhook/859ebf62-f9da-4d6a-af48-87f36b13d606"

  try {
    // Parse the request body
    const data = await request.json().catch((error) => {
      console.error("Error parsing request JSON:", error)
      throw new Error("Invalid JSON in request body")
    })

    const { studentName = "student", action = "completed task" } = data

    console.log("Preparing webhook request to:", webhookUrl)
    console.log("Request payload:", JSON.stringify(data))

    // Add a timeout to the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("Webhook response status:", response.status)

      // Some webhooks might not return JSON, so handle that case
      let result
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        result = await response.json().catch((e) => {
          console.log("Error parsing response JSON:", e)
          return { message: "Response received but couldn't parse JSON" }
        })
      } else {
        const text = await response.text()
        console.log("Non-JSON response:", text)
        result = { message: text || "Response received (not JSON)" }
      }

      if (!response.ok) {
        console.error(`N8N webhook error: ${response.status} ${response.statusText}`)
        return NextResponse.json(
          {
            success: false,
            error: `Webhook responded with status: ${response.status}`,
            details: result,
          },
          { status: 502 },
        ) // Bad Gateway for upstream errors
      }

      return NextResponse.json({
        success: true,
        data: result,
      })
    } catch (fetchError) {
      console.error("Fetch error:", fetchError)
      throw new Error(`Fetch error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)
    }
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Add a GET handler function to the file, keeping the existing POST handler

export async function GET(request: Request) {
  // Use the new webhook URL directly
  const webhookUrl = "https://vintatan.app.n8n.cloud/webhook/859ebf62-f9da-4d6a-af48-87f36b13d606"

  try {
    // Get query parameters from the URL
    const url = new URL(request.url)
    const studentName = url.searchParams.get("studentName") || "student"
    const action = url.searchParams.get("action") || "viewed lesson"
    const taskId = url.searchParams.get("taskId") || "default_task"

    const data = {
      studentName,
      action,
      taskId,
      timestamp: new Date().toISOString(),
    }

    console.log("Preparing GET webhook request to:", webhookUrl)
    console.log("Request payload:", JSON.stringify(data))

    // Add a timeout to the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(webhookUrl, {
        method: "GET", // Using GET method
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("Webhook response status:", response.status)

      // Some webhooks might not return JSON, so handle that case
      let result
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        result = await response.json().catch((e) => {
          console.log("Error parsing response JSON:", e)
          return { message: "Response received but couldn't parse JSON" }
        })
      } else {
        const text = await response.text()
        console.log("Non-JSON response:", text)
        result = { message: text || "Response received (not JSON)" }
      }

      if (!response.ok) {
        console.error(`N8N webhook error: ${response.status} ${response.statusText}`)
        return NextResponse.json(
          {
            success: false,
            error: `Webhook responded with status: ${response.status}`,
            details: result,
          },
          { status: 502 },
        ) // Bad Gateway for upstream errors
      }

      return NextResponse.json({
        success: true,
        data: result,
      })
    } catch (fetchError) {
      console.error("Fetch error:", fetchError)
      throw new Error(`Fetch error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)
    }
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

