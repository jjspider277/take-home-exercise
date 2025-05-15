'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const steps = [
    { number: 1, title: 'Company Info' },
    { number: 2, title: 'Persona' },
    { number: 3, title: 'Chat' },
  ]

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step) => {
          const isActive = step.number <= currentStep
          const isCurrentStep = step.number === currentStep
          
          return (
            <div key={step.number} className="flex flex-col items-center relative">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                } ${isCurrentStep ? 'ring-4 ring-blue-100' : ''}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrentStep ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {step.number}
              </motion.div>
              <span className={`mt-2 text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
      
      <div className="relative mt-4">
        <div className="absolute top-0 h-1 bg-gray-200 w-full rounded"></div>
        <motion.div 
          className="absolute top-0 h-1 bg-blue-600 rounded"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
    </div>
  )
}