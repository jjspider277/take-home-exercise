import { CompanyData, Persona } from './types';

export async function generatePersona(companyData: CompanyData): Promise<Persona> {
  const response = await fetch('/api/generate-persona', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.persona;
}

export async function getChatResponse(
  message: { role: 'user'; content: string },
  persona: any,
  companyName: string,
  messageHistory: Array<{ role: 'user' | 'persona'; content: string }>,
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      persona,
      companyName,
      messageHistory,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data?.response || '';
}

export async function getBusinesses() {
  const response = await fetch('/api/businesses', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data || [];
}

export async function getBusiness(id: string) {
  const response = await fetch(`/api/businesses/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function createBusiness(businessData: {
  name: string;
  description?: string;
  characteristics: string[];
}) {
  const response = await fetch('/api/businesses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(businessData),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function updateBusiness(
  id: string,
  businessData: {
    name: string;
    description?: string;
    characteristics: string[];
  },
) {
  const response = await fetch(`/api/businesses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(businessData),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}