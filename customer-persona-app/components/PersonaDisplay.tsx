'use client'

import { motion } from 'framer-motion'
import { Persona } from '@/lib/types'

interface PersonaDisplayProps {
  persona: Persona
  onContinue: () => void
}

export default function PersonaDisplay({ persona, onContinue }: PersonaDisplayProps) {
  // Generate a random avatar color based on the persona name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-yellow-100 text-yellow-600',
      'bg-indigo-100 text-indigo-600',
    ]
    
    // Use the first character of the name to select a color
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }
  
  const avatarColor = getAvatarColor(persona.name)
  
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-2">Your Customer Persona</h2>
      <p className="text-gray-600 mb-6">Meet your potential customer and understand their needs.</p>
      
      <div className="mb-8">
        <motion.div 
          className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 p-6 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={`w-24 h-24 ${avatarColor} rounded-full flex items-center justify-center text-4xl font-bold shrink-0`}>
            {persona.name.charAt(0)}
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-center md:text-left">{persona.name}</h3>
            <p className="text-gray-600 mb-4 text-center md:text-left">{persona.age} • {persona.gender} • {persona.location}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-1 flex items-center">
                  <i className="fas fa-briefcase mr-2 text-blue-500"></i>
                  Job Title
                </h4>
                <p className="ml-6">{persona.jobTitle}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-1 flex items-center">
                  <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                  Location
                </h4>
                <p className="ml-6">{persona.location}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <i className="fas fa-heart mr-2 text-blue-500"></i>
                Interests
              </h4>
              <div className="flex flex-wrap gap-2 ml-6">
                {persona.interests.map((interest, index) => (
                  <motion.span 
                    key={index} 
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <i className="fas fa-mountain mr-2 text-blue-500"></i>
            Challenges
          </h4>
          <ul className="list-none pl-6 space-y-2">
            {persona.challenges.map((challenge, index) => (
              <motion.li 
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              >
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>{challenge}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
      
      <motion.div 
        className="bg-blue-50 p-5 rounded-lg mb-6 border-l-4 border-blue-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
          <i className="fas fa-comment-alt mr-2"></i>
          Initial Challenge
        </h4>
        <p className="italic text-blue-700">{persona.initialChallenge}</p>
      </motion.div>
      
      <motion.button
        onClick={onContinue}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <i className="fas fa-comments mr-2"></i>
        Start Chat Experience
      </motion.button>
    </motion.div>
  )
}