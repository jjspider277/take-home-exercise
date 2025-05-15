'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Business } from '@/lib/types';

export default function BusinessInfo() {
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    // Load the selected business from localStorage
    const loadBusiness = () => {
      const stored = localStorage.getItem('selectedBusiness');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setBusiness(parsed);
        } catch (error) {
          console.error('Error parsing stored business:', error);
        }
      }
    };

    loadBusiness();
    
    // Listen for storage changes (in case another tab updates the business)
    window.addEventListener('storage', loadBusiness);
    
    return () => {
      window.removeEventListener('storage', loadBusiness);
    };
  }, []);

  if (!business) {
    return (
      <Link href="/business">
        <motion.div
          className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <i className="fas fa-building text-blue-500 mr-3 text-xl"></i>
            <div>
              <h3 className="font-medium">No business selected</h3>
              <p className="text-sm text-gray-600">Click here to select or create a business</p>
            </div>
            <i className="fas fa-chevron-right ml-auto text-blue-500"></i>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href="/business">
      <motion.div
        className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          <i className="fas fa-building text-blue-500 mr-3 text-xl"></i>
          <div>
            <h3 className="font-medium">{business.name}</h3>
            {business.description && (
              <p className="text-sm text-gray-600">{business.description}</p>
            )}
            <div className="flex flex-wrap gap-1 mt-1">
              {business.characteristics.slice(0, 3).map((char, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {char}
                </span>
              ))}
              {business.characteristics.length > 3 && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  +{business.characteristics.length - 3} more
                </span>
              )}
            </div>
          </div>
          <i className="fas fa-chevron-right ml-auto text-blue-500"></i>
        </div>
      </motion.div>
    </Link>
  );
}