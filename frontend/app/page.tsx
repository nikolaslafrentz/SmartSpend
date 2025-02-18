import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome to SmartSpend
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your personal finance companion for better spending habits
        </p>
        <div className="space-y-4">
          <Link 
            href="/register" 
            className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Account
          </Link>
          <Link 
            href="/login" 
            className="block w-full bg-gray-100 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  )
}
