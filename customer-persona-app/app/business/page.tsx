'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BusinessSelector from '@/components/BusinessSelector';
import BusinessForm from '@/components/BusinessForm';

interface Business {
  id: string;
  name: string;
  description?: string;
}

export default function BusinessPage() {
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const handleSelectBusiness = (business: Business) => {
    // Store the selected business in localStorage or state management
    localStorage.setItem('selectedBusiness', JSON.stringify(business));
    
    // Navigate directly to the persona generation page
    router.push('/');
  };

  const handleCreateBusiness = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleSubmitForm = async (data: { 
    name: string; 
    description: string; 
    characteristics: string[] 
  }) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create business: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Store the new business in localStorage
      localStorage.setItem('selectedBusiness', JSON.stringify(result.data));
      
      // Navigate to the persona generation page
      router.push('/');
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Customer Persona Experience</h1>
      
      {showForm ? (
        <BusinessForm 
          onSubmit={handleSubmitForm} 
          onCancel={handleCancelForm} 
        />
      ) : (
        <BusinessSelector 
          onSelect={handleSelectBusiness} 
          onCreateNew={handleCreateBusiness} 
        />
      )}
    </div>
  );
}