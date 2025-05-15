'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface BusinessFormProps {
  onSubmit: (data: { name: string; description: string; characteristics: string[] }) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    name: string;
    description: string;
    characteristics: string[];
  };
  isEdit?: boolean;
}

export default function BusinessForm({ 
  onSubmit, 
  onCancel, 
  initialData = { name: '', description: '', characteristics: [''] },
  isEdit = false
}: BusinessFormProps) {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [characteristics, setCharacteristics] = useState<string[]>(initialData.characteristics);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCharacteristic = () => {
    setCharacteristics([...characteristics, '']);
  };

  const removeCharacteristic = (index: number) => {
    const newCharacteristics = [...characteristics];
    newCharacteristics.splice(index, 1);
    setCharacteristics(newCharacteristics);
  };

  const updateCharacteristic = (index: number, value: string) => {
    const newCharacteristics = [...characteristics];
    newCharacteristics[index] = value;
    setCharacteristics(newCharacteristics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      setError('Business name is required');
      return;
    }
    
    // Filter out empty characteristics
    const filteredCharacteristics = characteristics.filter(c => c.trim() !== '');
    
    if (filteredCharacteristics.length === 0) {
      setError('At least one characteristic is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onSubmit({
        name,
        description,
        characteristics: filteredCharacteristics,
      });
    } catch (err) {
      console.error('Error submitting business:', err);
      setError('Failed to save business. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'Edit Business' : 'Create New Business'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Business Name*
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter business name"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your business"
            rows={3}
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Characteristics*
          </label>
          {characteristics.map((characteristic, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={characteristic}
                onChange={(e) => updateCharacteristic(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Characteristic ${index + 1}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => removeCharacteristic(index)}
                className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:outline-none"
                disabled={characteristics.length <= 1 || isLoading}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addCharacteristic}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
            disabled={isLoading}
          >
            <i className="fas fa-plus mr-1"></i>
            Add Another Characteristic
          </button>
        </div>
        
        <div className="flex justify-between">
          <motion.button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            Cancel
          </motion.button>
          
          <motion.button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-blue-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span>{isEdit ? 'Update Business' : 'Create Business'}</span>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}