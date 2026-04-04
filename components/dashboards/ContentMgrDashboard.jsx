'use client'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'
import StatCard from '../ui/StatCard'
import { Video, FileText, Shield, Upload, CheckCircle, Clock } from 'lucide-react'

export default function ContentMgrDashboard() {
  const { t } = useTranslation()
  const { profile } = useAppStore()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-granite">Content Manager Dashboard</h1>
        <p className="text-sm text-brand-clay mt-1">Manage video lessons, quizzes, and curriculum content</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title={t('videosUploaded')} value="234" icon={Video} trend={6} />
        <StatCard title={t('quizzesCreated')} value="89" icon={FileText} trend={12} />
        <StatCard title={t('pendingReview')} value="7" icon={Shield} />
        <StatCard title="Published Today" value="3" icon={CheckCircle} />
      </div>

      {/* Content Pipeline */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-brand-grey p-6">
          <h2 className="font-bold text-brand-granite mb-4">Pending Review</h2>
          <div className="space-y-3">
            {[
              { title: 'Chapter 9: Probability — Video Lesson', type: 'video', subject: 'Maths', std: '10th', time: '2h ago' },
              { title: 'Electricity Quiz (15 questions)', type: 'quiz', subject: 'Science', std: '10th', time: '4h ago' },
              { title: 'Coordinate Geometry — Practice Set', type: 'quiz', subject: 'Maths', std: '10th', time: '1d ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                {item.type === 'video' ? <Video className="w-4 h-4 text-yellow-600" /> : <FileText className="w-4 h-4 text-yellow-600" />}
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-granite">{item.title}</p>
                  <p className="text-xs text-brand-clay">{item.subject} &middot; {item.std} &middot; {item.time}</p>
                </div>
                <button className="px-3 py-1 bg-brand-orange text-white text-xs font-medium rounded-lg hover:bg-brand-clay transition-colors">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-brand-grey p-6">
          <h2 className="font-bold text-brand-granite mb-4">Content Coverage</h2>
          <div className="space-y-4">
            {[
              { std: '10th Standard', total: 40, done: 34 },
              { std: '9th Standard', total: 38, done: 22 },
              { std: '11th Standard', total: 42, done: 15 },
              { std: '12th Standard', total: 44, done: 8 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-brand-granite font-medium">{item.std}</span>
                  <span className="text-brand-clay">{item.done}/{item.total} chapters</span>
                </div>
                <div className="h-2.5 bg-brand-grey rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round(item.done / item.total * 100)}%`,
                      backgroundColor: item.done / item.total > 0.7 ? '#22c55e' : item.done / item.total > 0.4 ? '#FF4A13' : '#B8563B'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload CTA */}
      <div className="bg-brand-granite rounded-xl p-8 text-center text-white">
        <Upload className="w-10 h-10 mx-auto mb-3 text-brand-orange" />
        <h3 className="font-bold text-lg mb-1">Upload New Content</h3>
        <p className="text-sm text-brand-blue mb-4">Drag and drop videos or create quizzes for any chapter</p>
        <button className="px-6 py-2.5 bg-brand-orange text-white rounded-lg font-semibold text-sm hover:bg-brand-clay transition-colors">
          Upload Video
        </button>
      </div>
    </div>
  )
}
