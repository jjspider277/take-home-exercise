'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BusinessForm from '@/components/BusinessForm';

interface Business {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
}

export default function EditBusinessPage({ params }: { params: { id: string } }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/businesses/${params.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch business: ${response.status}`);
        }
        
        const result = await response.json();
        setBusiness(result.data);
      } catch (err) {
        console.error('Error fetching business:', err);
        setError('Failed to load business. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusiness();
  }, [params.id]);

  const handleCancelForm = () => {
    router.push('/business');
  };

  const handleSubmitForm = async (data: { 
    name: string; 
    description: string; 
    characteristics: string[] 
  }) => {
    try {
      const response = await fetch(`/api/businesses/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update business: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Update the selected business in localStorage if it's the same one
      const selectedBusiness = localStorage.getItem('selectedBusiness');
      if (selectedBusiness) {
        const parsed = JSON.parse(selectedBusiness);
        if (parsed.id === params.id) {
          localStorage.setItem('selectedBusiness', JSON.stringify(result.data));
        }
      }
      
      // Navigate back to the business list
      router.push('/business');
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
          <p>{error || 'Business not found'}</p>
        </div>
        <button
          onClick={() => router.push('/business')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Back to Businesses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Business</h1>
      
      <BusinessForm 
        onSubmit={handleSubmitForm} 
        onCancel={handleCancelForm}
        initialData={{
          name: business.name,
          description: business.description || '',
          characteristics: business.characteristics,
        }}
        isEdit={true}
      />
    </div>
  );
}