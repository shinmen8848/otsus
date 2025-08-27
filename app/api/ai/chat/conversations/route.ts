import { NextRequest, NextResponse } from 'next/server';

// NOTE: This is a Vite project, not Next.js. These API routes are non-functional.
// The conversation functionality works through the frontend components calling chatService directly.
// See src/lib/chatService.ts for the actual implementation.

// GET /api/ai/chat/conversations - List conversations (NON-FUNCTIONAL - Vite project)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // ARCHITECTURE ISSUE: This is a Vite project, not Next.js
    // The actual conversation functionality is implemented in src/lib/chatService.ts
    // and used directly by frontend components
    return NextResponse.json(
      {
        error: 'API routes are not functional in this Vite project',
        message: 'Use the conversation functionality through the frontend components instead',
        implementation: 'See src/lib/chatService.ts ConversationManager class'
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST /api/ai/chat/conversations - Create conversation (NON-FUNCTIONAL - Vite project)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sessionId, title } = body;

    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'User ID and Session ID are required' },
        { status: 400 }
      );
    }

    // ARCHITECTURE ISSUE: This is a Vite project, not Next.js
    // The actual conversation creation is implemented in src/lib/chatService.ts
    // ConversationManager.getOrCreateConversation() method
    return NextResponse.json(
      {
        error: 'API routes are not functional in this Vite project',
        message: 'Use the conversation functionality through the frontend components instead',
        implementation: 'See src/lib/chatService.ts ConversationManager.getOrCreateConversation()'
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Failed to create conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}