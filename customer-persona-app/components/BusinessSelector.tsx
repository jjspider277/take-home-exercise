'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Business {
  id: string;
  name: string;
  description?: string;
}

interface BusinessSelectorProps {
  onSelect: (business: Business) => void;
  onCreateNew: () => void;
}

export default function BusinessSelector({ onSelect, onCreateNew }: BusinessSelectorProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/businesses');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch businesses: ${response.status}`);
        }
        
        const data = await response.json();
        setBusinesses(data.data || []);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError('Failed to load businesses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinesses();
  }, []);

  const handleSelect = (business: Business) => {
    setSelectedId(business.id);
    onSelect(business);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Select a Business</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {businesses.length > 0 ? (
              businesses.map((business) => (
                <motion.div
                  key={business.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedId === business.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleSelect(business)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="font-medium text-lg">{business.name}</h3>
                  {business.description && (
                    <p className="text-gray-600 text-sm mt-1">{business.description}</p>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No businesses found. Create your first business to get started.
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <motion.button
              onClick={onCreateNew}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-plus mr-2"></i>
              Create New Business
            </motion.button>
            
            <motion.button
              onClick={() => selectedId && handleSelect(businesses.find(b => b.id === selectedId)!)}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                !selectedId ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={selectedId ? { scale: 1.05 } : {}}
              whileTap={selectedId ? { scale: 0.95 } : {}}
              disabled={!selectedId}
            >
              <i className="fas fa-arrow-right mr-2"></i>
              Continue
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}