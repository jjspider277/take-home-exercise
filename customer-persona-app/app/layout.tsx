import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import BusinessBadge from '@/components/BusinessBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Customer Persona Experience App',
  description: 'Generate customer personas and chat with them to solve challenges',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          <header className="bg-white shadow-sm py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-users text-blue-600 text-2xl mr-2"></i>
                  <span className="font-bold text-xl text-gray-800">Customer Persona App</span>
                </div>
                <nav>
                  <a href="https://github.com/yourusername/customer-persona-app" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                    <i className="fab fa-github text-xl"></i>
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <BusinessBadge />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p>&copy; {new Date().getFullYear()} Customer Persona Experience App</p>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    <i className="fab fa-github"></i>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}