import React from 'react'
import { motion } from 'framer-motion'
import { Wifi, CheckCircle2 } from 'lucide-react'

const ConnectionStatusCard = ({ isConnected, ipAddress, macAddress }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Wifi className={`w-8 h-8 ${isConnected ? 'text-green-600' : 'text-gray-400'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {isConnected ? 'Connected' : 'Disconnected'}
            </h3>
            {isConnected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </div>
          <p className="text-sm text-gray-500">IP: {ipAddress}</p>
          <p className="text-sm text-gray-500">MAC: {macAddress}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default ConnectionStatusCard
