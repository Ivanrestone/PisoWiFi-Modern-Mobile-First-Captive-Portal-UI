import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Ticket, CheckCircle2 } from 'lucide-react'

const VoucherInput = ({ onSubmit }) => {
  const [voucherCode, setVoucherCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (voucherCode.trim()) {
      setIsSubmitting(true)
      setTimeout(() => {
        onSubmit(voucherCode.trim())
        setVoucherCode('')
        setIsSubmitting(false)
      }, 1000)
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
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="Enter voucher code"
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all placeholder-gray-400"
          disabled={isSubmitting}
        />
      </div>
      
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
          💡 Enter your voucher code to get free internet time
        </p>
      </div>
    </form>
  )
}

export default VoucherInput
