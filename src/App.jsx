import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Ticket, Pause, Play, X, LogOut } from 'lucide-react'
import { io } from 'socket.io-client'
import ConnectionStatusCard from './components/ConnectionStatusCard'
import RemainingTimeDisplay from './components/RemainingTimeDisplay'
import PromoRatesCard from './components/PromoRatesCard'
import VoucherInput from './components/VoucherInput'
import SuccessAnimation from './components/SuccessAnimation'
import DisconnectConfirmModal from './components/DisconnectConfirmModal'

const socket = io('http://localhost:3001')

function App() {
  const [showRates, setShowRates] = useState(false)
  const [showVoucher, setShowVoucher] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [sessionId, setSessionId] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [macAddress] = useState('00:1A:2B:3C:4D:5E')
  const [ipAddress] = useState('192.168.1.100')
  const [disconnectStep, setDisconnectStep] = useState(0)
  const timerRef = useRef(null)
  const sessionIdRef = useRef(null)

  useEffect(() => {
    sessionIdRef.current = sessionId
  }, [sessionId])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearTimer()
          handleSessionExpired()
          return 0
        }
        const next = prev - 1
        updateSessionTime(next)
        return next
      })
    }, 1000)
  }, [clearTimer])

  useEffect(() => {
    // Check for existing session on load
    checkExistingSession()

    // Socket.io event listeners
    socket.on('time-update', (data) => {
      setRemainingTime(data.remainingTime)
    })

    socket.on('session-paused', (data) => {
      setIsPaused(true)
    })

    socket.on('session-resumed', (data) => {
      setIsPaused(false)
    })

    socket.on('session-expired', () => {
      handleSessionExpired()
    })

    socket.on('session-terminated', () => {
      handleSessionExpired()
    })

    return () => {
      clearTimer()
      socket.disconnect()
    }
  }, [clearTimer])

  const checkExistingSession = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/sessions/mac/${macAddress}`)
      const data = await response.json()
      
      if (data.success && (data.data.status === 'active' || data.data.status === 'paused')) {
        const timeLeft = Math.max(0, data.data.remainingTime ?? data.data.duration ?? 0)

        if (timeLeft <= 0) {
          await fetch(`http://localhost:3001/api/sessions/${data.data.id}/terminate`, {
            method: 'POST'
          })
          return
        }

        sessionIdRef.current = data.data.id
        setSessionId(data.data.id)
        setRemainingTime(timeLeft)
        setIsConnected(true)
        setIsPaused(data.data.isPaused || data.data.status === 'paused')

        socket.emit('join-session', data.data.id)

        if (!data.data.isPaused && data.data.status === 'active') {
          startTimer()
        }
      }
    } catch (error) {
      console.error('Error checking session:', error)
    }
  }

  const updateSessionTime = async (time) => {
    const id = sessionIdRef.current
    if (!id) return

    try {
      await fetch(`http://localhost:3001/api/sessions/${id}/time`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remainingTime: time })
      })
    } catch (error) {
      console.error('Error updating session time:', error)
    }
  }

  const handleSessionExpired = () => {
    clearTimer()
    sessionIdRef.current = null
    setRemainingTime(0)
    setIsConnected(false)
    setSessionId(null)
    setIsPaused(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handlePauseResume = async () => {
    if (!sessionId) return

    try {
      const endpoint = isPaused ? 'resume' : 'pause'
      const response = await fetch(`http://localhost:3001/api/sessions/${sessionId}/${endpoint}`, {
        method: 'POST'
      })
      
      const data = await response.json()
      if (data.success) {
        const nowPaused = !isPaused
        setIsPaused(nowPaused)

        if (nowPaused) {
          clearTimer()
        } else {
          startTimer()
        }
      }
    } catch (error) {
      console.error('Error toggling pause:', error)
    }
  }

  const handleVoucherSubmit = (data) => {
    setShowVoucher(false)

    const session = data.session
    const initialTime =
      session.remainingTime ??
      session.duration ??
      (data.voucher?.duration ? data.voucher.duration * 60 : 0)

    sessionIdRef.current = session.id
    setSessionId(session.id)
    setRemainingTime(initialTime)
    setIsConnected(true)
    setIsPaused(false)

    socket.emit('join-session', session.id)

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)

    if (initialTime > 0) {
      startTimer()
    }
  }

  const handleDisconnectClick = () => {
    setDisconnectStep(1)
  }

  const handleDisconnectCancel = () => {
    setDisconnectStep(0)
  }

  const handleDisconnectConfirm = async () => {
    if (disconnectStep === 1) {
      setDisconnectStep(2)
      return
    }

    if (!sessionId) {
      setDisconnectStep(0)
      return
    }

    try {
      await fetch(`http://localhost:3001/api/sessions/${sessionId}/terminate`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error disconnecting session:', error)
    }

    clearTimer()
    sessionIdRef.current = null
    setRemainingTime(0)
    setIsConnected(false)
    setSessionId(null)
    setIsPaused(false)
    setDisconnectStep(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && <SuccessAnimation />}
      </AnimatePresence>

      <DisconnectConfirmModal
        step={disconnectStep}
        onConfirm={handleDisconnectConfirm}
        onCancel={handleDisconnectCancel}
      />


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
      <div className="container mx-auto px-4 py-4 max-w-lg">
        {/* Gaming Banner */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 rounded-2xl overflow-hidden shadow-lg"
        >
          <div className="relative h-48 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop"
              alt="Gaming Banner"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-xl text-center font-bold text-lg shadow-lg"
              >
                The Best Connections WiFi Machine
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
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
            isConnected={isConnected}
            ipAddress={ipAddress}
            macAddress={macAddress}
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

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {!isConnected ? (
            <button
              onClick={() => setShowVoucher(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-5 px-6 rounded-2xl font-semibold text-lg shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <Ticket className="w-6 h-6" />
              Enter Voucher
            </button>
          ) : (
            <>
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
                onClick={handleDisconnectClick}
                className="w-full bg-white text-red-600 py-5 px-6 rounded-2xl font-semibold text-lg shadow-sm border-2 border-red-200 hover:border-red-300 hover:bg-red-50 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <LogOut className="w-6 h-6" />
                Disconnect
              </button>
            </>
          )}

          <button
            onClick={() => setShowRates(true)}
            className="w-full bg-white text-gray-900 py-5 px-6 rounded-2xl font-semibold text-lg shadow-sm border-2 border-gray-200 hover:border-gray-300 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Clock className="w-6 h-6 text-blue-500" />
            WiFi Rates
          </button>
        </motion.div>

        {/* Helper Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          {!isConnected ? (
            <p className="text-sm text-gray-500 leading-relaxed">
              💡 Ask the store owner for a voucher code to start browsing
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500 leading-relaxed">
                💡 Your remaining internet time is shown above
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                Pause your time to save remaining minutes
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default App
