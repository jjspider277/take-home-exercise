'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Business {
  id: string;
  name: string;
  description?: string;
}

export default function BusinessBadge() {
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
          className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md cursor-pointer flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-building mr-2"></i>
          <span>Select Business</span>
        </motion.div>
      </Link>
    );
  }

  return (
    <div className="fixed top-4 right-4 flex items-center">
      <Link href={`/business/${business.id}`}>
        <motion.div
          className="bg-blue-600 text-white px-4 py-2 rounded-l-full shadow-md cursor-pointer flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-building mr-2"></i>
          <span>{business.name}</span>
        </motion.div>
      </Link>
      
      <Link href="/business">
        <motion.div
          className="bg-gray-700 text-white px-3 py-2 rounded-r-full shadow-md cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-exchange-alt"></i>
        </motion.div>
      </Link>
    </div>
  );
}