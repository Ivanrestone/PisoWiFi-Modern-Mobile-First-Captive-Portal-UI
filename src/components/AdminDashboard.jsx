import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Clock, 
  DollarSign, 
  Plus,
  RefreshCw,
  LogOut,
  Menu,
  X
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [vouchers, setVouchers] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const API_URL = 'http://localhost:3001/api'

  useEffect(() => {
    fetchDashboardStats()
    fetchVouchers()
    fetchSessions()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/dashboard/stats`)
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchVouchers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/vouchers`)
      const data = await response.json()
      if (data.success) {
        setVouchers(data.data)
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error)
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/sessions`)
      const data = await response.json()
      if (data.success) {
        setSessions(data.data)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out pt-20 lg:pt-0`}>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('vouchers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'vouchers'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Ticket className="w-5 h-5" />
              <span>Vouchers</span>
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'sessions'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Sessions</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={Ticket}
                  label="Total Vouchers"
                  value={stats?.vouchers?.total || 0}
                  color="bg-blue-500"
                />
                <StatCard
                  icon={Ticket}
                  label="Active Vouchers"
                  value={stats?.vouchers?.active || 0}
                  color="bg-green-500"
                />
                <StatCard
                  icon={Users}
                  label="Active Sessions"
                  value={stats?.sessions?.active || 0}
                  color="bg-purple-500"
                />
                <StatCard
                  icon={DollarSign}
                  label="Total Earnings"
                  value={`₱${stats?.earnings?.total || 0}`}
                  color="bg-yellow-500"
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{session.macAddress}</p>
                        <p className="text-sm text-gray-500">{session.voucherCode}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          session.status === 'active' ? 'text-green-600' : 
                          session.status === 'paused' ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                          {session.status}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.floor(session.remainingTime / 60)}m remaining
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'vouchers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Voucher Management</h2>
                <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>Generate Vouchers</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Devices Used</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {vouchers.map((voucher) => (
                        <tr key={voucher.code} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">{voucher.code}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{voucher.duration} min</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              voucher.status === 'active' ? 'bg-green-100 text-green-700' :
                              voucher.status === 'used' ? 'bg-gray-100 text-gray-700' :
                              voucher.status === 'expired' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {voucher.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{voucher.devicesUsed}/{voucher.deviceLimit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sessions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Active Sessions</h2>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">MAC Address</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Voucher</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Remaining</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sessions.map((session) => (
                        <tr key={session.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">{session.macAddress}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{session.voucherCode}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'active' ? 'bg-green-100 text-green-700' :
                              session.status === 'paused' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {session.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {Math.floor(session.remainingTime / 60)}m {session.remainingTime % 60}s
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
