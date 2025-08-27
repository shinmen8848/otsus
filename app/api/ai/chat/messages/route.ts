import { NextRequest, NextResponse } from 'next/server';

// NOTE: This is a Vite project, not Next.js. These API routes are non-functional.
// The chat functionality works through the frontend components calling chatService directly.
// See src/components/sections/ChatSection.tsx for the actual implementation.

// POST /api/ai/chat/messages - Send message (NON-FUNCTIONAL - Vite project)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, userId } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and Session ID are required' },
        { status: 400 }
      );
    }

    // ARCHITECTURE ISSUE: This is a Vite project, not Next.js
    // The actual chat functionality is implemented in src/lib/chatService.ts
    // and used directly by frontend components in src/components/sections/ChatSection.tsx
    return NextResponse.json(
      {
        error: 'API routes are not functional in this Vite project',
        message: 'Use the chat functionality through the frontend components instead',
        implementation: 'See src/lib/chatService.ts and src/components/sections/ChatSection.tsx'
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET /api/ai/chat/messages/:conversationId - Get messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual message fetching from database
    // For now, return empty array
    const messages = [];

    return NextResponse.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}