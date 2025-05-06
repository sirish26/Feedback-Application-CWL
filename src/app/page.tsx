"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { feedbackSchema, FeedbackForm } from "@/schemas/feedbackSchema"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

type Feedback = {
  _id: string;
  name: string
  email: string
  message: string
  createdAt: string
}

export default function Home() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
  })

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const fetchFeedbacks = async () => {
    const res = await fetch("/api/feedback")
    const data = await res.json()
    setFeedbacks(data.data)
  }

  const onSubmit = async (data: FeedbackForm) => {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      reset()
      toast.success("Feedback submitted successfully!")
      await fetchFeedbacks()
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const paginatedFeedbacks = feedbacks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const totalPages = Math.ceil(feedbacks.length / pageSize)

  return (
    <main className="max-w-7xl mx-auto py-10 px-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Feedback</Label>
              <Textarea id="message" {...register("message")} />
              {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="w-full">
        <h2 className="text-xl font-semibold">All Feedback</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFeedbacks.map((fb, index) => (
              <TableRow key={fb._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{fb.name}</TableCell>
                <TableCell>{fb.email}</TableCell>
                <TableCell className="max-w-sm break-words">{fb.message}</TableCell>
                <TableCell>{new Date(fb.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  )
}
