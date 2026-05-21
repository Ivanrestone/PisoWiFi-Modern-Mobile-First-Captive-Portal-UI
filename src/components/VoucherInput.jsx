import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Ticket, CheckCircle2, AlertCircle } from 'lucide-react'

const VoucherInput = ({ onSubmit, onError }) => {
  const [voucherCode, setVoucherCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!voucherCode.trim()) {
      setError('Please enter a voucher code')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate MAC address (in real app, this would come from device)
      const macAddress = '00:1A:2B:3C:4D:5E'
      const ipAddress = '192.168.1.100'

      const response = await fetch('http://localhost:3001/api/vouchers/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: voucherCode.trim(),
          macAddress,
          ipAddress
        })
      })

      const data = await response.json()

      if (data.success) {
        onSubmit(data.data)
        setVoucherCode('')
      } else {
        setError(data.message || 'Invalid voucher code')
        if (onError) onError(data.message)
      }
    } catch (err) {
      setError('Failed to validate voucher. Please try again.')
      if (onError) onError('Connection error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Ticket className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => {
            setVoucherCode(e.target.value.toUpperCase())
            setError('')
          }}
          placeholder="Enter voucher code"
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all placeholder-gray-400 uppercase"
          disabled={isSubmitting}
          maxLength={20}
        />
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!voucherCode.trim() || isSubmitting}
        className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
          voucherCode.trim() && !isSubmitting
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
            />
            Verifying...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Redeem Voucher
          </>
        )}
      </motion.button>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          💡 Ask the store owner for a voucher code
        </p>
      </div>
    </form>
  )
}

export default VoucherInput
