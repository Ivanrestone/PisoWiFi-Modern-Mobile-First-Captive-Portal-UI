import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, AlertTriangle } from 'lucide-react'

const DisconnectConfirmModal = ({ step, onConfirm, onCancel }) => {
  const isFirstStep = step === 1

  return (
    <AnimatePresence>
      {step > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  isFirstStep ? 'bg-orange-100' : 'bg-red-100'
                }`}
              >
                {isFirstStep ? (
                  <WifiOff className="w-8 h-8 text-orange-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {isFirstStep ? 'Disconnect WiFi?' : 'Really sure?? WHAHHA'}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isFirstStep
                  ? 'Are you sure you want to disconnect? Your remaining time will be lost.'
                  : 'Last chance! Once you disconnect, your session ends for good. No take-backs!'
                }
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all active:scale-[0.98] ${
                  isFirstStep
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isFirstStep ? 'Yes, disconnect' : 'Yes, really disconnect!'}
              </button>
              <button
                onClick={onCancel}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DisconnectConfirmModal
