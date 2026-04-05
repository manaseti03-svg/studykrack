import { NextResponse } from 'next/server';

export async function GET() {
  // Mock backend logic for tasks
  return NextResponse.json({ 
    message: "This is your Task Management Backend API Route!", 
    status: 200 
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  // Here we would interact with Supabase server-side
  return NextResponse.json({ 
    message: "Task created via backend API", 
    data 
  });
}
