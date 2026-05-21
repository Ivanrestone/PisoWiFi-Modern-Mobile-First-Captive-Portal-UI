import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Pause } from 'lucide-react'

const RemainingTimeDisplay = ({ remainingTime, isPaused }) => {
  const seconds = Math.max(0, Number(remainingTime) || 0)

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br rounded-2xl p-6 shadow-lg ${
        isPaused
          ? 'from-orange-100 to-orange-200 border-2 border-orange-300'
          : 'from-green-100 to-green-200 border-2 border-green-300'
      }`}
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <Clock className={`w-6 h-6 ${isPaused ? 'text-orange-600' : 'text-green-600'}`} />
        {isPaused && <Pause className="w-5 h-5 text-orange-600" />}
        <h3 className="text-lg font-semibold text-gray-900">
          {isPaused ? 'Time Paused' : 'Remaining Time'}
        </h3>
      </div>
      <div className="text-center">
        <motion.p
          key={seconds}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-5xl font-bold ${
            isPaused ? 'text-orange-700' : 'text-green-700'
          }`}
        >
          {formatTime(seconds)}
        </motion.p>
        <p className="text-sm text-gray-600 mt-2">
          {isPaused
            ? 'Your remaining time is saved and can be resumed later'
            : 'Keep browsing! Your time is counting down'
          }
        </p>
      </div>
    </motion.div>
  )
}

export default RemainingTimeDisplay
