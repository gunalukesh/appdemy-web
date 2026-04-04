'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { BarChart2, Users, BookOpen, TrendingUp, Clock, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentUsers, setRecentUsers] = useState([])
  const [contentProgress, setContentProgress] = useState({})

  useEffect(() => { loadAnalytics() }, [])

  async function loadAnalytics() {
    setLoading(true)
    try {
      // Get counts
      const [standards, subjects, chapters, lessons, questions, profiles] = await Promise.all([
        supabase.from('standards').select('id', { count: 'exact', head: true }),
        supabase.from('subjects').select('id', { count: 'exact', head: true }),
        supabase.from('chapters').select('id', { count: 'exact', head: true }),
        supabase.from('lessons').select('id', { count: 'exact', head: true }),
        supabase.from('questions').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ])

      setStats({
        standards: standards.count || 0,
        subjects: subjects.count || 0,
        chapters: chapters.count || 0,
        lessons: lessons.count || 0,
        questions: questions.count || 0,
        users: profiles.count || 0,
      })

      // Recent signups
      const { data: recent } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at, standard')
        .order('created_at', { ascending: false })
        .limit(10)
      setRecentUsers(recent || [])

      // Content per standard
      const { data: stds } = await supabase.from('standards').select('id, number, name_en').order('number')
      if (stds) {
        const progress = {}
        for (const std of stds) {
          const { data: subs } = await supabase.from('subjects').select('id').eq('standard_id', std.id)
          const subIds = (subs || []).map(s => s.id)
          let chapCount = 0, lessonCount = 0, qCount = 0
          if (subIds.length > 0) {
            const { count: cc } = await supabase.from('chapters').select('id', { count: 'exact', head: true }).in('subject_id', subIds)
            chapCount = cc || 0
            const { data: chaps } = await supabase.from('chapters').select('id').in('subject_id', subIds)
            const chapIds = (chaps || []).map(c => c.id)
            if (chapIds.length > 0) {
              const { count: lc } = await supabase.from('lessons').select('id', { count: 'exact', head: true }).in('chapter_id', chapIds)
              lessonCount = lc || 0
              const { count: qc } = await supabase.from('questions').select('id', { count: 'exact', head: true }).in('chapter_id', chapIds)
              qCount = qc || 0
            }
          }
          progress[std.number] = { subjects: subIds.length, chapters: chapCount, lessons: lessonCount, questions: qCount }
        }
        setContentProgress(progress)
      }
    } catch (err) {
      console.error('Analytics load error:', err)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-granite">Platform Analytics</h1>
        <p className="text-gray-500 mt-1">Overview of content and user activity</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Users', value: stats?.users, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Standards', value: stats?.standards, icon: BookOpen, color: 'text-green-600 bg-green-50' },
          { label: 'Subjects', value: stats?.subjects, icon: BarChart2, color: 'text-purple-600 bg-purple-50' },
          { label: 'Chapters', value: stats?.chapters, icon: TrendingUp, color: 'text-orange-600 bg-orange-50' },
          { label: 'Lessons', value: stats?.lessons, icon: Clock, color: 'text-pink-600 bg-pink-50' },
          { label: 'Questions', value: stats?.questions, icon: Activity, color: 'text-indigo-600 bg-indigo-50' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border p-4">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-brand-granite">{card.value}</div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Content per Standard */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-brand-granite mb-4">Content by Standard</h2>
          <div className="space-y-4">
            {Object.entries(contentProgress).map(([std, data]) => (
              <div key={std} className="border rounded-lg p-4">
                <div className="font-medium text-brand-granite mb-2">Standard {std}</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{data.subjects}</div>
                    <div className="text-xs text-gray-500">Subjects</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{data.chapters}</div>
                    <div className="text-xs text-gray-500">Chapters</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{data.lessons}</div>
                    <div className="text-xs text-gray-500">Lessons</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{[data.questions}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Content completeness</span>
                    <span>{[data.lessons > 0 ? Math.round((data.lessons / Math.max(data.chapters, 1)) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-orange rounded-full transition-all"
                         style={{ width: `${[data.lessons > 0 ? Math.min(100, Math.round((data.lessons / Math.max(data.chapters, 1)) * 100)) : 0}%` }} />
                  </div>
                </div>
              </div>
            ))}
            {Object.keys(contentProgress).length === 0 && (
              <p className="text-gray-400 text-center py-8">No standards found</p>
            )}
          </div>
        </div>

        {/* Recent Signups */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-brand-granite mb-4">Recent Signups</h2>
             <div className="space-y-3">
            {recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-sm">
                    {(user.full_name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-brand-granite">{user.full_name || 'Unnamed'}</div>
                    <div className="text-xs text-gray-400 capitalize">{(user.role || 'student').replace('_', ' ')}{user.standard ? ` • Std ${user.standard}` : ''}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                </div>
              </diw>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-gray-400 text-center py-8">No users yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
