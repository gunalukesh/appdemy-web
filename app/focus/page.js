'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'
import { attention } from '../../lib/supabase'
import Navbar from '../../components/ui/Navbar'
import Sidebar from '../../components/ui/Sidebar'
import { Brain, Eye, TrendingUp, Clock, ChevronRight, Calendar } from 'lucide-react'

export default function FocusPage() {
  const { t } = useTranslation()
  const { profile, sidebarOpen } = useAppStore()
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await attention.getWeeklyReport(profile?.id)
        setWeeklyData(data || [])
      } catch (err) {
        console.error('Focus data error:', err)
      } finally {
        setLoading(false)
      }
    }
    if (profile?.id) load()
  }, [profile?.id])

  // Fallback weekly data for demo
  const displayData = weeklyData.length > 0 ? weeklyData.map(d => ({
    day: new Date(d.started_at).toLocaleDateString('en-IN', { weekday: 'short' }),
    avgScore: d.avg_score || 0,
    sessions: 1,
  })) : [
    { day: 'Mon', avgScore: 82, sessions: 4 },
    { day: 'Tue', avgScore: 75, sessions: 3 },
    { day: 'Wed', avgScore: 88, sessions: 5 },
    { day: 'Thu', avgScore: 70, sessions: 2 },
    { day: 'Fri', avgScore: 91, sessions: 6 },
    { day: 'Sat', avgScore: 85, sessions: 3 },
    { day: 'Sun', avgScore: 65, sessions: 1 },
  ]

  const avgFocus = displayData.length > 0
    ? Math.round(displayData.reduce((s, d) => s + d.avgScore, 0) / displayData.length)
    : 0

  const bestDay = displayData.reduce((best, d) => d.avgScore > (best?.avgScore || 0) ? d : best, displayData[0])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className={`transition-all duration-200 pt-4 pb-8 px-4 lg:px-6 ${sidebarOpen ? 'lg:ml-56' : 'lg:ml-16'}`}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm text-brand-clay mb-6">
            <Link href="/dashboard" className="hover:text-brand-orange">{t('dashboard')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-granite font-medium">{t('concentration')}</span>
          </div>

          <h1 className="text-2xl font-bold text-brand-granite mb-6">{t('concentration')}</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-brand-grey p-5">
              <Brain className="v-6 h-6 text-brand-orange mb-2" />
              <p className="text-2xl font-bold text-brand-granite">{avgFocus}%</p>
              <p className="text-xs text-brand-clay">{t('avgAttention')}</p>
            </div>
            <div className="bg-white rounded-xl border border-brand-grey p-5">
              <TrendingUp className="v-6 h-6 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-brand-granite">{bestDay?.avgScore || 0}%</p>
              <p className="text-xs text-brand-clay">Best Day ({bestDay?.day})</p>
            </div>
            <div className="bg-white rounded-xl border border-brand-grey p-5">
              <Eye className="w-6 h-6 text-brand-blue mb-2" />
              <p className="text-2xl font-bold text-brand-granite">{displayData.reduce((s, d) => s + d.sessions, 0)}</p>
              <p className="text-xs text-brand-clay">Sessions This Week</p>
            </div>
            <div className="bg-white rounded-xl border border-brand-grey p-5">
              <Clock className="w-6 h-6 text-brand-clay mb-2" />
              <p className="text-2xl font-bold text-brand-granite">Morning</p>
              <p className="text-xs text-brand-clay">{t('bestTime')}</p>
            </div>
          </div>

          {/* Weekly Chart (simple bar visualization) */}
          <div className="bg-white rounded-xl border border-brand-grey p-6 mb-6">
            <h2 className="font-bold text-brand-granite mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-orange" />
              Weekly Focus Trend
            </h2>
            <div className="flex items-end gap-4 h-48">
              {displayData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-brand-granite">{d.avgScore}%</span>
                  <div className="w-full bg-brand-grey rounded-t-lg relative" style={{ height: '100%' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                        d.avgScore >= 80 ? 'bg-green-500' :
                        d.avgScore >= 60 ? 'bg-brand-orange' :
                        'bg-red-400'
                      }`}
                      style={{ height: `${d.avgScore}%` }}
                    />
                  </div>
                  <span className="text-xs text-brand-clay">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-brand-granite rounded-xl p-6 text-white">
            <h2 className="font-bold mb-3">Tips to Improve Focus</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { tip: 'Study in the morning (6-9 AM) when your focus is highest', icon: '🌅' },
                { tip: 'Take a 5-min break every 25 minutes (Pomodoro technique)', icon: '⏱️' },
                { tip: 'Keep your phone in another room while studying', icon: '📱' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-4">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-sm text-brand-blue mt-2">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
