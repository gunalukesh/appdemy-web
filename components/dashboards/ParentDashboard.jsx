'use client'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'
import StatCard from '../ui/StatCard'
import { BookOpen, Award, Brain, Clock, TrendingUp, Calendar } from 'lucide-react'

export default function ParentDashboard() {
  const { t } = useTranslation()
  const { profile } = useAppStore()

  // Placeholder data — in production, fetch linked children's data
  const children = [
    {
      name: 'Arun Kumar',
      standard: '10th',
      streak: 12,
      lessonsThisWeek: 18,
      avgQuizScore: 78,
      avgFocus: 76,
      subjects: [
        { name: 'Maths', score: 85, trend: 3 },
        { name: 'Science', score: 72, trend: -2 },
        { name: 'Tamil', score: 91, trend: 5 },
        { name: 'English', score: 68, trend: 1 },
        { name: 'Social', score: 80, trend: 4 },
      ]
    }
  ]

  const child = children[0]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-granite">{t('childProgress')} 👪</h1>
        <p className="text-sm text-brand-clay mt-1">{t('weeklyReport')} for {child.name} ({child.standard} Standard)</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title={t('streak')} value={`${child.streak} 🔥`} icon={Calendar} trend={15} />
        <StatCard title="Lessons This Week" value={child.lessonsThisWeek} icon={BookOpen} trend={8} />
        <StatCard title="Avg. Quiz Score" value={`${child.avgQuizScore}%`} icon={Award} trend={3} />
        <StatCard title={t('avgAttention')} value={`${child.avgFocus}%`} icon={Brain} trend={-2} />
      </div>

      {/* Subject Breakdown */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-brand-granite mb-4">Subject-wise Performance</h2>
        <div className="bg-white rounded-xl border border-brand-grey divide-y divide-brand-grey">
          {child.subjects.map((sub, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center font-bold text-brand-orange text-sm">
                  {sub.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-brand-granite text-sm">{sub.name}</p>
                  <div className="w-32 h-1.5 bg-brand-grey rounded-full mt-1">
                    <div className="h-full bg-brand-orange rounded-full" style={{ width: `${sub.score}%` }} />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand-granite">{sub.score}%</p>
                <p className={`text-xs font-medium ${sub.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {sub.trend >= 0 ? '+' : ''}{sub.trend}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Focus Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 text-sm">Focus Alert</h3>
            <p className="text-sm text-yellow-800 mt-1">
              {child.name}&apos;s attention drops during afternoon Science lessons (2-3 PM). Consider scheduling study sessions in the morning when focus is highest.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
