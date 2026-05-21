import React from 'react'
import { motion } from 'framer-motion'
import { Coins, Clock, Sparkles } from 'lucide-react'

const PromoRatesCard = ({ price, time, isRecommended }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-5 rounded-2xl border-2 transition-all ${
        isRecommended
          ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-100'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {isRecommended && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          Best Value
        </motion.div>
      )}
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isRecommended ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          <Coins className={`w-8 h-8 ${isRecommended ? 'text-green-600' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <p className={`text-3xl font-bold ${isRecommended ? 'text-green-700' : 'text-gray-900'}`}>
              ₱{price}
            </p>
            <p className="text-sm text-gray-500">=</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${isRecommended ? 'text-green-600' : 'text-gray-500'}`} />
            <p className={`text-lg font-semibold ${isRecommended ? 'text-green-700' : 'text-gray-900'}`}>
              {time}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PromoRatesCard
