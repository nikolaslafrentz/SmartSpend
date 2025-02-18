'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TransferForm from '../components/TransferForm'

interface User {
  id: number
  email: string
  full_name: string
  weekly_budget: number
  total_balance: number
  points: number
}

interface Transaction {
  id: number
  amount: number
  category: string
  description: string
  is_good_spending: boolean
  created_at: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTransferForm, setShowTransferForm] = useState(false)

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('http://localhost:8000/api/transactions/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.status === 401) {
        // Unauthorized, token might be expired
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setError('Failed to load transactions. Please try again later.')
    }
  }

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('http://localhost:8000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await response.json()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to load user data. Please try again later.')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const initializeDashboard = async () => {
      setLoading(true)
      await Promise.all([fetchUserData(), fetchTransactions()])
      setLoading(false)
    }

    initializeDashboard()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-highlight">SmartSpend</h1>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/login')
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weekly Budget Card */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Weekly Budget</h2>
            <p className="text-3xl font-bold text-green-600">
              ${user?.weekly_budget.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Resets every Monday</p>
          </div>

          {/* Total Balance Card */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Balance</h2>
            <p className="text-3xl font-bold text-blue-600">
              ${user?.total_balance.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Available funds</p>
          </div>

          {/* Points Card */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">SmartSpend Points</h2>
            <p className="text-3xl font-bold text-purple-600">{user?.points}</p>
            <p className="text-sm text-gray-500 mt-2">Earn more by staying on budget</p>
          </div>
        </div>

        {/* Transaction List */}
        <div className="mt-8 card">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
            {transactions.length === 0 ? (
              <p className="text-gray-500">No transactions yet. Start adding your expenses!</p>
            ) : (
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.category} • {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`font-semibold ${
                        transaction.is_good_spending ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${transaction.amount.toFixed(2)}
                      </span>
                      {transaction.is_good_spending && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Good Spending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transfer Money Button */}
        <button
          onClick={() => setShowTransferForm(true)}
          className="button-primary fixed bottom-8 right-8 shadow-lg"
        >
          Transfer Money
        </button>

        {/* Transfer Form Modal */}
        {showTransferForm && (
          <TransferForm
            onClose={() => setShowTransferForm(false)}
            onSuccess={async () => {
              await Promise.all([fetchTransactions(), fetchUserData()])
              setShowTransferForm(false)
            }}
          />
        )}
      </main>
    </div>
  )
}
