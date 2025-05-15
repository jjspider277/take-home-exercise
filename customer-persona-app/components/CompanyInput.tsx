'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CompanyInputProps {
  onSubmit: (data: { name: string; characteristics: string[] }) => void
  isLoading: boolean
  initialData?: {
    name: string;
    characteristics: string[];
  }
}

export default function CompanyInput({ onSubmit, isLoading, initialData }: CompanyInputProps) {
  const [companyName, setCompanyName] = useState(initialData?.name || '')
  const [characteristic, setCharacteristic] = useState('')
  const [characteristics, setCharacteristics] = useState<string[]>(initialData?.characteristics || [])
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.name);
      setCharacteristics(initialData.characteristics);
    }
  }, [initialData]);
  const [error, setError] = useState('')
  
  // Suggested characteristics
  const suggestedCharacteristics = [
    'Sustainable', 'Tech-focused', 'Innovative', 'Luxury', 'Budget-friendly',
    'Family-oriented', 'Health-conscious', 'Educational', 'Creative', 'Service-oriented'
  ]

  const addCharacteristic = (char: string = characteristic) => {
    if (!char.trim()) return
    
    // Don't add duplicates
    if (characteristics.includes(char.trim())) return
    
    setCharacteristics([...characteristics, char.trim()])
    setCharacteristic('')
  }

  const removeCharacteristic = (index: number) => {
    setCharacteristics(characteristics.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!companyName.trim()) {
      setError('Company name is required')
      return
    }
    
    if (characteristics.length === 0) {
      setError('At least one company characteristic is required')
      return
    }
    
    setError('')
    onSubmit({
      name: companyName.trim(),
      characteristics
    })
  }

  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-2">Company Information</h2>
      <p className="text-gray-600 mb-6">Tell us about your company to generate a relevant customer persona.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter your company name"
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="characteristics" className="block text-sm font-medium text-gray-700 mb-1">
            Company Characteristics <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">Add tags that describe your company's values, products, or services</p>
          
          <div className="flex">
            <input
              type="text"
              id="characteristics"
              value={characteristic}
              onChange={(e) => setCharacteristic(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="e.g., Sustainable, Tech-focused, etc."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCharacteristic())}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => addCharacteristic()}
              className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={!characteristic.trim() || isLoading}
            >
              <i className="fas fa-plus mr-1"></i> Add
            </button>
          </div>
          
          {/* Suggested characteristics */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Suggested characteristics:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedCharacteristics.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => addCharacteristic(char)}
                  className={`text-xs px-2 py-1 rounded-full transition-all ${
                    characteristics.includes(char)
                      ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  disabled={characteristics.includes(char) || isLoading}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
          
          {/* Selected characteristics */}
          {characteristics.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Selected characteristics:</p>
              <div className="flex flex-wrap gap-2">
                {characteristics.map((char, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-blue-800">{char}</span>
                    <button
                      type="button"
                      onClick={() => removeCharacteristic(index)}
                      className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
                      disabled={isLoading}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <motion.div 
            className="bg-red-50 text-red-800 p-3 rounded-md mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </motion.div>
        )}
        
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Generating Persona...
            </>
          ) : (
            <>
              <i className="fas fa-magic mr-2"></i>
              Generate Customer Persona
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}