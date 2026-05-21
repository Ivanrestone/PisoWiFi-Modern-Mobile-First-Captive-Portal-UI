import React from 'react'
import { motion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'

const PauseResumeButton = ({ isPaused, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full py-5 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
        isPaused
          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300'
          : 'bg-white text-gray-900 shadow-sm border-2 border-gray-200 hover:border-gray-300'
      }`}
    >
      {isPaused ? (
        <>
          <Play className="w-6 h-6" />
          Resume Time
        </>
      ) : (
        <>
          <Pause className="w-6 h-6 text-orange-500" />
          Pause Time
        </>
      )}
    </motion.button>
  )
}

export default PauseResumeButton
