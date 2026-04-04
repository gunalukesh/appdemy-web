'use client'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { admin } from '../../lib/supabase'
import StatCard from '../ui/StatCard'
import { Shield, Activity, AlertTriangle, Server, Users, Layers, BookOpen, Video, HelpCircle, ArrowRight } from 'lucide-react'

export default function SuperAdminDashboard() {
  const { t } = useTranslation()
  const router = useRouter()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    admin.getContentStats().then(setStats)
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-granite">{t('platformHealth')}</h1>
        <p className="text-sm text-brand-clay mt-1">System-wide monitoring and content management</p>
      </div>

      {/* Content Stats from DB */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.standards}</p>
            <p className="text-xs font-medium text-blue-600 mt-1">Standards</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">{stats.subjects}</p>
            <p className="text-xs font-medium text-purple-600 mt-1">Subjects</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-700">{stats.chapters}</p>
            <p className="text-xs font-medium text-orange-600 mt-1">Chapters</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{stats.lessons}</p>
            <p className="text-xs font-medium text-green-600 mt-1">Lessons</p>
          </div>
          <div className="bg-pink-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-pink-700">{stats.questions}</p>
            <p className="text-xs font-medium text-pink-600 mt-1">Questions</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-700">{stats.users}</p>
            <p className="text-xs font-medium text-gray-600 mt-1">Users</p>
          </div>
        </div>
      )}

      {/* Quick Action: Content Management */}
      <button
        onClick={() => router.push('/admin/content')}
        className="w-full bg-brand-granite rounded-xl p-6 text-left text-white mb-6 hover:bg-brand-granite/90 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">Content Management Panel</h2>
            <p className="text-sm text-brand-blue mt-1">Manage standards, subjects, chapters, video lessons & quiz questions</p>
          </div>
          <ArrowRight className="w-6 h-6 text-brand-orange group-hover:translate-x-1 transition-transform" />
        </div>
      </button>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Infrastructure */}
        <div className="bg-white rounded-xl border border-brand-grey p-6">
          <h2 className="font-bold text-brand-granite mb-4">Infrastructure</h2>
          <div className="space-y-3">
            {[
              { name: 'Vercel (Frontend)', status: 'healthy', latency: '45ms', region: 'Mumbai' },
              { name: 'Supabase (Database)', status: 'healthy', latency: '12ms', region: 'Mumbai' },
              { name: 'Supabase (Storage)', status: 'healthy', latency: '89ms', region: 'Mumbai' },
              { name: 'Supabase (Realtime)', status: 'healthy', latency: '23ms', region: 'Mumbai' },
            ].map((svc, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-brand-grey last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${svc.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-brand-granite">{svc.name}</p>
                    <p className="text-xs text-brand-clay">{svc.region}</p>
                  </div>
                </div>
                <span className="text-sm font-mono text-brand-clay">{svc.latency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Cost */}
        <div className="bg-white rounded-xl border border-brand-grey p-6">
          <h2 className="font-bold text-brand-granite mb-4">Monthly Cost</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-brand-grey/50 rounded-lg p-4">
              <p className="font-bold text-2xl text-brand-granite">₹0</p>
              <p className="text-xs text-brand-clay mt-1">Vercel (Free)</p>
            </div>
            <div className="bg-brand-grey/50 rounded-lg p-4">
              <p className="font-bold text-2xl text-brand-granite">₹0</p>
              <p className="text-xs text-brand-clay mt-1">Supabase (Free)</p>
            </div>
            <div className="bg-brand-grey/50 rounded-lg p-4">
              <p className="font-bold text-2xl text-brand-granite">₹899</p>
              <p className="text-xs text-brand-clay mt-1">Domain (GoDaddy)</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 font-medium text-center">Total: ~₹75/month (domain cost only)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
