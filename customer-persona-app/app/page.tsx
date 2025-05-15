'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CompanyInput from '@/components/CompanyInput'
import PersonaDisplay from '@/components/PersonaDisplay'
import ChatExperience from '@/components/ChatExperience'
import ProgressBar from '@/components/ProgressBar'
import BusinessInfo from '@/components/BusinessInfo'
import { Persona, Business } from '@/lib/types'

type Step = 'company-input' | 'persona-generation' | 'chat-experience'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('company-input')
  const [companyData, setCompanyData] = useState<{ name: string; characteristics: string[] }>({ 
    name: '', 
    characteristics: [] 
  })
  const [persona, setPersona] = useState<Persona | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)

  // Check for selected business on component mount and when localStorage changes
  useEffect(() => {
    const loadSelectedBusiness = () => {
      const storedBusiness = localStorage.getItem('selectedBusiness');
      if (storedBusiness) {
        try {
          const business = JSON.parse(storedBusiness);
          setSelectedBusiness(business);
          setCompanyData({
            name: business.name,
            characteristics: business.characteristics
          });
        } catch (error) {
          console.error('Error parsing stored business:', error);
        }
      }
    };
    
    loadSelectedBusiness();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', loadSelectedBusiness);
    return () => window.removeEventListener('storage', loadSelectedBusiness);
  }, []);

  const handleCompanySubmit = async (data: { name: string; characteristics: string[] }) => {
    setCompanyData(data)
    setIsLoading(true)
    setError(null)
    
    try {
      // Call the backend API through our Next.js API route
      const response = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`Failed to generate persona: ${response.status}`)
      }
      
      const result = await response.json()
      
      // Extract the persona from the response
      const personaData = result.persona || {}
      
      // Add an ID if it doesn't exist (needed for chat)
      if (!personaData.id) {
        personaData.id = crypto.randomUUID()
      }
      
      setPersona(personaData)
      setCurrentStep('persona-generation')
    } catch (error) {
      console.error('Error generating persona:', error)
      setError('Failed to generate persona. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const startChatExperience = () => {
    setCurrentStep('chat-experience')
  }

  const getStepNumber = (step: Step): number => {
    switch (step) {
      case 'company-input': return 1
      case 'persona-generation': return 2
      case 'chat-experience': return 3
      default: return 1
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Customer Persona Experience</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate realistic customer personas based on your company profile and engage in a simulated conversation to understand their needs.
        </p>
      </div>
      
      <BusinessInfo />
      
      <ProgressBar currentStep={getStepNumber(currentStep)} totalSteps={3} />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {currentStep === 'company-input' && (
          <motion.div
            key="company-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CompanyInput 
            onSubmit={handleCompanySubmit} 
            isLoading={isLoading} 
            initialData={selectedBusiness ? {
              name: selectedBusiness.name,
              characteristics: selectedBusiness.characteristics
            } : undefined}
          />
          </motion.div>
        )}
        
        {currentStep === 'persona-generation' && persona && (
          <motion.div
            key="persona-generation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PersonaDisplay 
              persona={persona} 
              onContinue={startChatExperience} 
            />
          </motion.div>
        )}
        
        {currentStep === 'chat-experience' && persona && (
          <motion.div
            key="chat-experience"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ChatExperience 
              persona={persona} 
              companyName={companyData.name}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}