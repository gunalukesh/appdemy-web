'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'
import { curriculum, progress, subscriptions } from '../../lib/supabase'
import StatCard from '../ui/StatCard'
import { BookOpen, Award, TrendingUp, Clock, ChevronRight, Play, Star, Zap, Target } from 'lucide-react'

export default function StudentDashboard() {
  const { t } = useTranslation()
  const { profile, setSubscription } = useAppStore()
  const [subjects, setSubjects] = useState([])
  const [recentProgress, setRecentProgress] = useState([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // Load subjects for student's standard
        if (profile?.standard_id) {
          const subs = await curriculum.getSubjects(profile.standard_id)
          setSubjects(subs || [])
        }
        // Load recent progress
        const prog = await progress.getStudentProgress(profile?.id)
        setRecentProgress(prog || [])
        // Update streak
        const s = await progress.updateStreak(profile?.id)
        setStreak(s)
        // Check subscription
        const sub = await subscriptions.getActiveSubscription(profile?.id)
        if (sub) setSubscription(sub)
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    if (profile?.id) load()
  }, [profile?.id])

  const completedLessons = recentProgress.filter(p => p.completed).length
  const totalProgress = recentProgress.length > 0
    ? Math.round(recentProgress.reduce((sum, p) => sum + p.progress_percent, 0) / recentProgress.length)
    : 0

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-granite">
          {t('welcome')}, {profile?.name_en || 'Student'} 👋
        </h1>
        <p className="text-sm text-brand-clay mt-1">
          {profile?.standard_id ? `${t('standard')} ${profile.standard_id}` : ''} &middot; {t('todayGoal')}: Complete 3 lessons
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title={t('streak')} value={`${streak} 🔥`} icon={Zap} trend={12} />
        <StatCard title={t('completed')} value={completedLessons} subtitle="lessons" icon={Award} />
        <StatCard title="Avg. Score" value={`${totalProgress}%`} icon={Target} trend={5} />
        <StatCard title={t('doubts')} value="2" subtitle={t('resolved')} icon={Star} />
      </div>

      {/* Subjects Grid */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-brand-granite mb-4">{t('selectSubject')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {(subjects.length > 0 ? subjects : [
            { id: 1, name_en: 'Mathematics', name_ta: 'கணிதம்', icon: '📐' },
            { id: 2, name_en: 'Science', name_ta: 'அறிவியல்', icon: '🔬' },
            { id: 3, name_en: 'Tamil', name_ta: 'தமிழ்', icon: '📖' },
            { id: 4, name_en: 'English', name_ta: 'ஆங்கிலம்', icon: '📝' },
            { id: 5, name_en: 'Social Science', name_ta: 'சமூக அறிவியல்', icon: '🌍' },
          ]).map((sub) => (
            <Link
              key={sub.id}
              href={`/learn?subject=${sub.id}`}
              className="bg-white rounded-xl border border-brand-grey p-4 hover:border-brand-orange hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-2">{sub.icon || '📚'}</div>
              <h3 className="font-semibold text-brand-granite text-sm group-hover:text-brand-orange transition-colors">
                {sub.name_en}
              </h3>
              <p className="text-xs text-brand-clay mt-0.5">{sub.name_ta}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-brand-orange font-medium">
                <span>8 chapters</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Continue Learning */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-brand-granite mb-4">{t('continueLesson')}</h2>
        <div className="space-y-3">
          {[
            { chapter: 'Real Numbers', subject: 'Mathematics', progress: 65, lesson: 'Types of Real Numbers' },
            { chapter: 'Laws of Motion', subject: 'Science', progress: 30, lesson: "Newton's First Law" },
            { chapter: 'Sets and Relations', subject: 'Mathematics', progress: 90, lesson: 'Venn Diagrams' },
          ].map((item, i) => (
            <Link
              key={i}
              href={`/learn/chapter-${i + 1}`}
              className="flex items-center gap-4 bg-white rounded-xl border border-brand-grey p-4 hover:border-brand-orange transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                <Play className="w-5 h-5 text-brand-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-granite text-sm">{item.lesson}</p>
                <p className="text-xs text-brand-clay">{item.subject} &middot; {item.chapter}</p>
                <div className="mt-2 h-1.5 bg-brand-grey rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-orange rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-brand-clay">{item.progress}%</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
