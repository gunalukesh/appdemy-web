'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'
import {
  Home, BookOpen, HelpCircle, Brain, BarChart2,
  Users, FileText, Settings, Video, Shield, Layers
} from 'lucide-react'

const NAV_ITEMS = {
  student: [
    { href: '/dashboard', icon: Home, label: 'dashboard' },
    { href: '/learn', icon: BookOpen, label: 'lessons' },
    { href: '/quizzes', icon: FileText, label: 'quizzes' },
    { href: '/doubts', icon: HelpCircle, label: 'doubts' },
    { href: '/focus', icon: Brain, label: 'concentration' },
  ],
  teacher: [
    { href: '/dashboard', icon: Home, label: 'dashboard' },
    { href: '/doubts', icon: HelpCircle, label: 'doubts' },
    { href: '/teacher/students', icon: Users, label: 'students' },
    { href: '/teacher/analytics', icon: BarChart2, label: 'analytics' },
  ],
  parent: [
    { href: '/dashboard', icon: Home, label: 'dashboard' },
    { href: '/parent/progress', icon: BarChart2, label: 'childProgress' },
    { href: '/parent/reports', icon: FileText, label: 'weeklyReport' },
  ],
  admin: [
    { href: '/dashboard', icon: Home, label: 'dashboard' },
    { href: '/admin/users', icon: Users, label: 'users' },
    { href: '/admin/analytics', icon: BarChart2, label: 'analytics' },
    { href: '/admin/revenue', icon: Layers, label: 'revenue' },
    { href: '/admin/settings', icon: Settings, label: 'settings' },
  ],
  content_mgr: [
    { href: '/dashboard', icon: Home, label: 'dashboard' },
    { href: '/admin/content', icon: Layers, label: 'content' },
    { href: '/content-mgr/review', icon: Shield, label: 'pendingReview' },
  ],
  super_admin: [
    { href: '/dashboard', icon: Home, label: 'dashboard' },
    { href: '/admin/content', icon: Layers, label: 'content' },
    { href: '/admin/users', icon: Users, label: 'users' },
    { href: '/admin/analytics', icon: BarChart2, label: 'analytics' },
    { href: '/super-admin/system', icon: Shield, label: 'platformHealth' },
    { href: '/admin/settings', icon: Settings, label: 'settings' },
  ],
}

export default function Sidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { profile, sidebarOpen } = useAppStore()

  const items = NAV_ITEMS[profile?.role] || NAV_ITEMS.student

  return (
    <aside className={`fixed left-0 top-[57px] h-[calc(100vh-57px)] bg-white border-r border-brand-grey z-40 transition-all duration-200 ${
      sidebarOpen ? 'w-56' : 'w-0 lg:w-16'
    } overflow-hidden`}>
      <nav className="p-3 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-orange text-white'
                  : 'text-brand-granite hover:bg-brand-grey'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={sidebarOpen ? 'block' : 'hidden lg:hidden'}>{t(item.label)}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
