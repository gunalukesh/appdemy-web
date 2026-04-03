'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '../../lib/store'
import Navbar from '../../components/ui/Navbar'
import Sidebar from '../../components/ui/Sidebar'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { user, profile, loading, sidebarOpen } = useAppStore()

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/auth')
    }
  }, [user, profile, loading, router])

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-grey">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className={`transition-all duration-200 pt-4 pb-8 px-4 lg:px-6 ${
        sidebarOpen ? 'lg:ml-56' : 'lg:ml-16'
      }`}>
        {children}
      </main>
    </div>
  )
}
