import { NextResponse } from 'next/server'
import type { CompanyData, Persona } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, characteristics, knowledgeDomain, problemToSolve } = body as CompanyData
    
    // Forward the request to the backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    
    // Use the new endpoint if knowledge domain or problem is provided
    const endpoint = (knowledgeDomain || problemToSolve) 
      ? `${apiUrl}/persona/generate-with-knowledge`
      : `${apiUrl}/persona/generate`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, characteristics, knowledgeDomain, problemToSolve }),
      cache: 'no-store',
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json()
    
    // The NestJS API returns data in a specific format with a 'data' property
    const rawPersona = data.data || data;
    
    // Clean the persona object to remove properties that shouldn't be used in the frontend
    const persona = {
      id: rawPersona.id,
      name: rawPersona.name,
      age: rawPersona.age,
      gender: rawPersona.gender,
      location: rawPersona.location,
      jobTitle: rawPersona.jobTitle,
      interests: rawPersona.interests,
      challenges: rawPersona.challenges,
      initialChallenge: rawPersona.initialChallenge,
      knowledgeDomain: rawPersona.knowledgeDomain,
      problemToSolve: rawPersona.problemToSolve
    };
    
    return NextResponse.json({ persona })
  } catch (error) {
    console.error('Error generating persona:', error)
    return NextResponse.json(
      { error: 'Failed to generate persona' },
      { status: 500 }
    )
  }
}