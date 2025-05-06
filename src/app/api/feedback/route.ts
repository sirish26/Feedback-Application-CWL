import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await connectDB();
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  return NextResponse.json({ data: feedbacks }, { status: 200 });
}

export async function POST(request: Request) {
  await connectDB();
  const { name, email, message } = await request.json();
  const feedback = await Feedback.create({ name, email, message });
  return NextResponse.json(feedback, { status: 201 });
}
