'use client'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useAppStore } from '../../lib/store'
import { auth } from '../../lib/supabase'
import { BookOpen, Menu, X, Globe, LogOut, Bell } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const { profile, lang, toggleLang, sidebarOpen, toggleSidebar } = useAppStore()

  const handleLangToggle = () => {
    const newLang = lang === 'en' ? 'ta' : 'en'
    toggleLang()
    i18n.changeLanguage(newLang)
  }

  const handleLogout = async () => {
    await auth.signOut()
    router.push('/')
  }

  const roleColors = {
    student: 'bg-brand-orange',
    teacher: 'bg-brand-clay',
    parent: 'bg-brand-blue',
    admin: 'bg-brand-granite',
    content_mgr: 'bg-green-600',
    super_admin: 'bg-purple-600',
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-brand-grey">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2 hover:bg-brand-grey rounded-lg lg:hidden">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-brand-granite hidden sm:block">Appdemy</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleLangToggle} className="flex items-center gap-1 px-3 py-2 text-sm text-brand-granite hover:bg-brand-grey rounded-lg transition-colors">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{t('switchLang')}</span>
          </button>

          <button className="p-2 hover:bg-brand-grey rounded-lg relative">
            <Bell className="w-5 h-5 text-brand-granite" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-brand-grey">
            <div className={`w-8 h-8 rounded-full ${roleColors[profile?.role] || 'bg-brand-granite'} flex items-center justify-center text-white text-xs font-bold`}>
              {profile?.name_en?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-brand-granite leading-tight">{profile?.name_en || 'User'}</p>
              <p className="text-xs text-brand-clay capitalize">{profile?.role?.replace('_', ' ')}</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-brand-grey rounded-lg" title={t('logout')}>
              <LogOut className="w-4 h-4 text-brand-clay" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
