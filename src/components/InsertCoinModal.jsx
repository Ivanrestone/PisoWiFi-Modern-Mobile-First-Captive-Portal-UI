import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Coins, Clock, CheckCircle2, Sparkles } from 'lucide-react'
import LiveCoinCounter from './LiveCoinCounter'

const InsertCoinModal = ({ onClose, onCoinInsert, insertedAmount }) => {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const packages = [
    { price: 1, time: '10 Minutes', isRecommended: false },
    { price: 5, time: '1 Hour', isRecommended: true },
    { price: 10, time: '3 Hours', isRecommended: false },
  ]

  const getTimeEquivalent = (amount) => {
    if (amount >= 10) return '3 Hours'
    if (amount >= 5) return '1 Hour'
    if (amount >= 1) return '10 Minutes'
    return '0 Minutes'
  }

  const handleStartInternet = () => {
    if (insertedAmount >= 1) {
      setIsProcessing(true)
      setTimeout(() => {
        onCoinInsert(insertedAmount)
        setIsProcessing(false)
      }, 1500)
    }
  }

  useEffect(() => {
    if (insertedAmount >= 5) {
      setSelectedPackage(packages[1])
    } else if (insertedAmount >= 1) {
      setSelectedPackage(packages[0])
    } else {
      setSelectedPackage(null)
    }
  }, [insertedAmount])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Insert Money</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Shop Name */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Piso WiFi Portal</p>
          <p className="text-lg font-semibold text-gray-900">Fast Internet Access</p>
        </div>

        {/* Live Coin Counter */}
        <LiveCoinCounter insertedAmount={insertedAmount} />

        {/* Time Equivalent */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-200">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Time Equivalent:</p>
            <p className="text-lg font-bold text-green-700">
              {getTimeEquivalent(insertedAmount)}
            </p>
          </div>
        </div>

        {/* Package Selection */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Select Package:</p>
          {packages.map((pkg) => (
            <motion.button
              key={pkg.price}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPackage(pkg)}
              className={`w-full p-4 rounded-2xl border-2 transition-all relative ${
                selectedPackage?.price === pkg.price
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {pkg.isRecommended && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Best Value
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Coins className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-gray-900">₱{pkg.price}</p>
                    <p className="text-sm text-gray-500">{pkg.time}</p>
                  </div>
                </div>
                {selectedPackage?.price === pkg.price && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleStartInternet}
            disabled={insertedAmount < 1 || isProcessing}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              insertedAmount >= 1 && !isProcessing
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                />
                Processing...
              </>
            ) : (
              <>
                {insertedAmount >= 1 ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Start Internet
                  </>
                ) : (
                  <>
                    <Coins className="w-5 h-5" />
                    Insert Coins First
                  </>
                )}
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 Please insert coins into the Piso WiFi machine
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Amount will update automatically
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default InsertCoinModal
