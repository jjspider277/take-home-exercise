import { NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'persona';
  content: string;
}

interface ChatRequest {
  message: Message;
  persona: {
    id?: string;
    name: string;
    knowledgeDomain?: string;
    problemToSolve?: string;
    temporaryContext?: string;
  };
  companyName: string;
  messageHistory: Message[];
  additionalContext?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, persona, companyName, messageHistory, additionalContext } = body as ChatRequest
    
    // Forward the request to the backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    
    // Use the contextual endpoint if additional context is provided
    const endpoint = additionalContext 
      ? `${apiUrl}/chat/with-context` 
      : `${apiUrl}/chat`
    
    // If additional context is provided, add it to the persona
    if (additionalContext) {
      persona.temporaryContext = additionalContext;
    }
    
    // Clean the persona object to remove properties that shouldn't be sent to the API
    const cleanPersona = {
      id: persona.id,
      name: persona.name,
      age: persona.age,
      gender: persona.gender,
      location: persona.location,
      jobTitle: persona.jobTitle,
      interests: persona.interests,
      challenges: persona.challenges,
      initialChallenge: persona.initialChallenge,
      knowledgeDomain: persona.knowledgeDomain,
      problemToSolve: persona.problemToSolve
    };
    
    // Add temporary context if provided
    if (additionalContext) {
      cleanPersona['temporaryContext'] = additionalContext;
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        persona: cleanPersona,
        companyName,
        messageHistory,
      }),
      cache: 'no-store',
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json()
    
    // The NestJS API returns data in a specific format with a 'data' property
    const responseData = data.data || data;
    
    return NextResponse.json({ data: { response: responseData.response } })
  } catch (error) {
    console.error('Error generating chat response:', error)
    return NextResponse.json(
      { error: 'Failed to generate chat response' },
      { status: 500 }
    )
  }
}