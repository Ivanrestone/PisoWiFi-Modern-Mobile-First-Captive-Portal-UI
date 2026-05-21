import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, Clock, Coins, Ticket, Pause, Play, X, CheckCircle, Sparkles } from 'lucide-react'
import ConnectionStatusCard from './components/ConnectionStatusCard'
import RemainingTimeDisplay from './components/RemainingTimeDisplay'
import InsertCoinModal from './components/InsertCoinModal'
import PromoRatesCard from './components/PromoRatesCard'
import VoucherInput from './components/VoucherInput'
import PauseResumeButton from './components/PauseResumeButton'
import SuccessAnimation from './components/SuccessAnimation'
import LiveCoinCounter from './components/LiveCoinCounter'

function App() {
  const [showInsertModal, setShowInsertModal] = useState(false)
  const [showRates, setShowRates] = useState(false)
  const [showVoucher, setShowVoucher] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [insertedAmount, setInsertedAmount] = useState(0)
  const [remainingTime, setRemainingTime] = useState(1800) // 30 minutes in seconds
  const [userCredits, setUserCredits] = useState(15)

  const handleInsertMoney = () => {
    setShowInsertModal(true)
  }

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  const handleVoucherSubmit = (code) => {
    console.log('Voucher code:', code)
    setShowVoucher(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleCoinInsert = (amount) => {
    setInsertedAmount(amount)
    if (amount >= 1) {
      setTimeout(() => {
        setShowInsertModal(false)
        setShowSuccess(true)
        setUserCredits(prev => prev + amount)
        setRemainingTime(prev => prev + (amount * 600)) // 10 minutes per peso
        setTimeout(() => setShowSuccess(false), 3000)
        setInsertedAmount(0)
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && <SuccessAnimation />}
      </AnimatePresence>

      {/* Insert Coin Modal */}
      <AnimatePresence>
        {showInsertModal && (
          <InsertCoinModal
            onClose={() => setShowInsertModal(false)}
            onCoinInsert={handleCoinInsert}
            insertedAmount={insertedAmount}
          />
        )}
      </AnimatePresence>

      {/* WiFi Rates Modal */}
      <AnimatePresence>
        {showRates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">WiFi Rates</h2>
                <button
                  onClick={() => setShowRates(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <PromoRatesCard price={1} time="10 Minutes" isRecommended={false} />
                <PromoRatesCard price={5} time="1 Hour" isRecommended={true} />
                <PromoRatesCard price={10} time="3 Hours" isRecommended={false} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voucher Modal */}
      <AnimatePresence>
        {showVoucher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowVoucher(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Use Voucher</h2>
                <button
                  onClick={() => setShowVoucher(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <VoucherInput onSubmit={handleVoucherSubmit} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Piso WiFi</h1>
          <p className="text-gray-600">Fast & Affordable Internet</p>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <ConnectionStatusCard
            isConnected={true}
            ipAddress="192.168.1.100"
            macAddress="00:1A:2B:3C:4D:5E"
          />
        </motion.div>

        {/* Remaining Time */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <RemainingTimeDisplay
            remainingTime={remainingTime}
            isPaused={isPaused}
          />
        </motion.div>

        {/* Credits Display */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Your Credits</p>
              <p className="text-3xl font-bold text-gray-900">₱{userCredits.toFixed(2)}</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <Coins className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <button
            onClick={handleInsertMoney}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-5 px-6 rounded-2xl font-semibold text-lg shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Coins className="w-6 h-6" />
            Insert Money
          </button>

          <button
            onClick={handlePauseResume}
            className="w-full bg-white text-gray-900 py-5 px-6 rounded-2xl font-semibold text-lg shadow-sm border-2 border-gray-200 hover:border-gray-300 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {isPaused ? (
              <>
                <Play className="w-6 h-6 text-green-600" />
                Resume Time
              </>
            ) : (
              <>
                <Pause className="w-6 h-6 text-orange-500" />
                Pause Time
              </>
            )}
          </button>

          <button
            onClick={() => setShowRates(true)}
            className="w-full bg-white text-gray-900 py-5 px-6 rounded-2xl font-semibold text-lg shadow-sm border-2 border-gray-200 hover:border-gray-300 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Clock className="w-6 h-6 text-blue-500" />
            WiFi Rates
          </button>

          <button
            onClick={() => setShowVoucher(true)}
            className="w-full bg-white text-gray-900 py-5 px-6 rounded-2xl font-semibold text-lg shadow-sm border-2 border-gray-200 hover:border-gray-300 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Ticket className="w-6 h-6 text-purple-500" />
            Use Voucher
          </button>
        </motion.div>

        {/* Helper Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 leading-relaxed">
            💡 Insert coins into the machine to start browsing
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mt-2">
            Your remaining internet time is shown above
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mt-2">
            Pause your time to save remaining minutes
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default App
