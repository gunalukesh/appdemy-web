'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'
import { doubts } from '../../lib/supabase'
import StatCard from '../ui/StatCard'
import { Users, MessageCircle, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

export default function TeacherDashboard() {
  const { t } = useTranslation()
  const { profile } = useAppStore()
  const [doubtQueue, setDoubtQueue] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const queue = await doubts.getTeacherQueue(profile?.id)
        setDoubtQueue(queue || [])
      } catch (err) {
        console.error('Teacher dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }
    if (profile?.id) load()
  }, [profile?.id])

  const activeDoubts = doubtQueue.filter(d => d.status === 'active')
  const queuedDoubts = doubtQueue.filter(d => d.status === 'queued')

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-granite">{t('welcome')}, {profile?.name_en || 'Teacher'} 👨‍🏫</h1>
        <p className="text-sm text-brand-clay mt-1">You have {queuedDoubts.length} students waiting for help</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title={t('doubts')} value={queuedDoubts.length} subtitle={t('queued')} icon={MessageCircle} />
        <StatCard title="Active Sessions" value={activeDoubts.length} icon={Clock} />
        <StatCard title="Resolved Today" value="14" icon={CheckCircle} trend={8} />
        <StatCard title="My Students" value="127" icon={Users} />
      </div>

      {/* Doubt Queue */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-brand-granite mb-4">Doubt Queue</h2>
        {queuedDoubts.length === 0 && !loading ? (
          <div className="bg-white rounded-xl border border-brand-grey p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="font-medium text-brand-granite">No doubts in queue</p>
            <p className="text-sm text-brand-clay">All students are doing well!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(queuedDoubts.length > 0 ? queuedDoubts : [
              { id: 1, question_text: 'How to solve quadratic equations with complex roots?', subjects: { name_en: 'Mathematics' }, profiles: { name_en: 'Arun Kumar' }, created_at: new Date().toISOString() },
              { id: 2, question_text: "Explain Newton's 3rd law with examples", subjects: { name_en: 'Science' }, profiles: { name_en: 'Priya Devi' }, created_at: new Date().toISOString() },
              { id: 3, question_text: 'What is the difference between sets and relations?', subjects: { name_en: 'Mathematics' }, profiles: { name_en: 'Karthik R' }, created_at: new Date().toISOString() },
            ]).map((doubt) => (
              <Link
                key={doubt.id}
                href={`/doubts?session=${doubt.id}`}
                className="flex items-start gap-4 bg-white rounded-xl border border-brand-grey p-4 hover:border-brand-orange transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-brand-orange">
                  {doubt.profiles?.name_en?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-granite text-sm">{doubt.question_text}</p>
                  <p className="text-xs text-brand-clay mt-1">
                    {doubt.profiles?.name_en || 'Student'} &middot; {doubt.subjects?.name_en || 'General'}
                  </p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex-shrink-0">
                  {t('queued')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Today's Stats */}
      <div>
        <h2 className="text-lg font-bold text-brand-granite mb-4">Student Performance</h2>
        <div className="bg-white rounded-xl border border-brand-grey p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-brand-orange">82%</p>
              <p className="text-sm text-brand-clay mt-1">Avg. Quiz Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">76%</p>
              <p className="text-sm text-brand-clay mt-1">Avg. Focus Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-granite">4.2</p>
              <p className="text-sm text-brand-clay mt-1">Avg. Lessons/Day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
