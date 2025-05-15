export interface Persona {
  id?: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  jobTitle: string;
  interests: string[];
  challenges: string[];
  initialChallenge: string;
  knowledgeDomain?: string;
  problemToSolve?: string;
  temporaryContext?: string;
}

export interface CompanyData {
  name: string;
  description?: string;
  characteristics: string[];
  knowledgeDomain?: string;
  problemToSolve?: string;
  isActive?: boolean;
}

export interface Business {
  id: string;
  name: string;
  description?: string;
  characteristics: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}