'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '../../lib/store'
import Navbar from '../../components/ui/Navbar'
import Sidebar from '../../components/ui/Sidebar'

const ADMIN_ROLES = ['super_admin', 'admin', 'content_mgr']

export default function AdminLayout({ children }) {
  const router = useRouter()
  const { user, profile, loading, sidebarOpen } = useAppStore()

  useEffect(() => {
    if (!loading) {
      if (!user || !profile) {
        router.push('/auth')
      } else if (!ADMIN_ROLES.includes(profile.role)) {
        router.push('/dashboard')
      }
    }
  }, [user, profile, loading, router])

  if (loading || !user || !profile || !ADMIN_ROLES.includes(profile?.role)) {
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
