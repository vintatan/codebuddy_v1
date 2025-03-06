import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AvatarGuide } from "@/components/avatar-guide"
import Link from "next/link"
import { Brain, Code, Trophy } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">CodeBuddy</h1>
          <p className="text-muted-foreground">Your personal AI coding tutor</p>
        </div>

        <AvatarGuide message="Hi! I'm your coding buddy. Let's start learning together!" />

        <div className="grid gap-4">
          <Card>
            <CardContent className="p-6">
              <Link href="/placement-test">
                <Button className="w-full" size="lg">
                  <Brain className="mr-2 h-5 w-5" />
                  Take Placement Test
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <Link href="/lessons">
                  <Button variant="outline" className="w-full" size="lg">
                    <Code className="mr-2 h-5 w-5" />
                    Lessons
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Link href="/progress">
                  <Button variant="outline" className="w-full" size="lg">
                    <Trophy className="mr-2 h-5 w-5" />
                    Progress
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

