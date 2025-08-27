import { NextRequest, NextResponse } from 'next/server';

// NOTE: This is a Vite project, not Next.js. These API routes are non-functional.
// The context functionality works through the frontend components calling chatService directly.
// See src/lib/chatService.ts for the actual implementation.

// GET /api/ai/context/:userId - Get user context (NON-FUNCTIONAL - Vite project)
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // ARCHITECTURE ISSUE: This is a Vite project, not Next.js
    // The actual context functionality is implemented in src/lib/chatService.ts
    // ContextBuilder.buildContext() and related methods
    return NextResponse.json(
      {
        error: 'API routes are not functional in this Vite project',
        message: 'Use the context functionality through the frontend components instead',
        implementation: 'See src/lib/chatService.ts ContextBuilder class'
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Failed to fetch context:', error);
    return NextResponse.json(
      { error: 'Failed to fetch context' },
      { status: 500 }
    );
  }
}

// POST /api/ai/context/:userId - Update user context (NON-FUNCTIONAL - Vite project)
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // ARCHITECTURE ISSUE: This is a Vite project, not Next.js
    // The actual context updating is implemented in src/lib/chatService.ts
    // ContextMemoryManager.storeContextMemory() method
    return NextResponse.json(
      {
        error: 'API routes are not functional in this Vite project',
        message: 'Use the context functionality through the frontend components instead',
        implementation: 'See src/lib/chatService.ts ContextMemoryManager.storeContextMemory()'
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Failed to update context:', error);
    return NextResponse.json(
      { error: 'Failed to update context' },
      { status: 500 }
    );
  }
}