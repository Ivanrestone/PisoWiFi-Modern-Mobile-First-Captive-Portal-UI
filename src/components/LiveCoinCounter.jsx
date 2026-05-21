import React from 'react'
import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'

const LiveCoinCounter = ({ insertedAmount }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-4 border-2 border-blue-200">
      <div className="text-center">
        <motion.div
          key={insertedAmount}
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <Coins className="w-8 h-8 text-blue-600" />
          <p className="text-4xl font-bold text-gray-900">
            ₱{insertedAmount.toFixed(2)}
          </p>
        </motion.div>
        <p className="text-sm text-gray-600">
          {insertedAmount > 0 ? 'Amount Inserted' : 'Waiting for coins...'}
        </p>
        {insertedAmount === 0 && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-2 text-xs text-blue-600 font-medium"
          >
            Insert coins to begin
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default LiveCoinCounter
