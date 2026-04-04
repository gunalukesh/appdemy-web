'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'
import { curriculum } from '../../lib/supabase'
import Navbar from '../../components/ui/Navbar'
import Sidebar from '../../components/ui/Sidebar'
import { BookOpen, Play, Lock, CheckCircle, ChevronRight } from 'lucide-react'

export default function LearnPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const subjectId = searchParams.get('subject')
  const { profile, sidebarOpen, hasAccess } = useAppStore()

  const [chapters, setChapters] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (subjectId) {
        const chaps = await curriculum.getChapters(subjectId)
        setChapters(chaps || [])
        if (chaps?.length) {
          setSelectedChapter(chaps[0])
          const lsns = await curriculum.getLessons(chaps[0].id)
          setLessons(lsns || [])
        }
      }
      setLoading(false)
    }
    load()
  }, [subjectId])

  const handleChapterSelect = async (chapter) => {
    setSelectedChapter(chapter)
    const lsns = await curriculum.getLessons(chapter.id)
    setLessons(lsns || [])
  }

  // Fallback chapters for demo
  const displayChapters = chapters.length > 0 ? chapters : [
    { id: 1, title_en: 'Real Numbers', title_ta: 'மெய் எண்கள்', sort_order: 1 },
    { id: 2, title_en: 'Sets and Relations', title_ta: 'கணங்கள் மற்றும் தொடர்புகள்', sort_order: 2 },
    { id: 3, title_en: 'Algebra', title_ta: 'இயற்கணிதம்', sort_order: 3 },
    { id: 4, title_en: 'Geometry', title_ta: 'வடிவியல்', sort_order: 4 },
    { id: 5, title_en: 'Coordinate Geometry', title_ta: 'ஆய வடிவியல்', sort_order: 5 },
    { id: 6, title_en: 'Trigonometry', title_ta: 'முக்கோணவியல்', sort_order: 6 },
    { id: 7, title_en: 'Mensuration', title_ta: 'அளவியல்', sort_order: 7 },
    { id: 8, title_en: 'Statistics & Probability', title_ta: 'புள்ளியியல் & நிகழ்தகவு', sort_order: 8 },
  ]

  const displayLessons = lessons.length > 0 ? lessons : [
    { id: 1, title_en: 'Introduction to Real Numbers', duration_minutes: 15, is_free: true, sort_order: 1 },
    { id: 2, title_en: 'Types of Real Numbers', duration_minutes: 20, is_free: true, sort_order: 2 },
    { id: 3, title_en: 'Properties of Real Numbers', duration_minutes: 18, is_free: false, sort_order: 3 },
    { id: 4, title_en: 'Decimal Expansion', duration_minutes: 22, is_free: false, sort_order: 4 },
    { id: 5, title_en: 'Practice Problems', duration_minutes: 25, is_free: false, sort_order: 5 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className={`transition-all duration-200 pt-4 pb-8 px-4 lg:px-6 ${sidebarOpen ? 'lg:ml-56' : 'lg:ml-16'}`}>
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-brand-clay mb-6">
            <Link href="/dashboard" className="hover:text-brand-orange">{t('dashboard')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-granite font-medium">{t('lessons')}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chapters List */}
            <div className="lg:col-span-1">
              <h2 className="font-bold text-brand-granite mb-3">Chapters</h2>
              <div className="space-y-2">
                {displayChapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => handleChapterSelect(ch)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedChapter?.id === ch.id
                        ? 'border-brand-orange bg-orange-50'
                        : 'border-brand-grey bg-white hover:border-brand-blue'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        selectedChapter?.id === ch.id
                          ? 'bg-brand-orange text-white'
                          : 'bg-brand-grey text-brand-granite'
                      }`}>
                        {ch.sort_order}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-granite">{ch.title_en}</p>
                        <p className="text-xs text-brand-clay">{ch.title_ta}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lessons */}
            <div className="lg:col-span-2">
              <h2 className="font-bold text-brand-granite mb-3">
                {selectedChapter?.title_en || displayChapters[0]?.title_en} — Lessons
              </h2>
              <div className="space-y-3">
                {displayLessons.map((lesson) => {
                  const canAccess = lesson.is_free || hasAccess(lesson)
                  return (
                    <Link
                      key={lesson.id}
                      href={canAccess ? `/learn/${selectedChapter?.id || 1}?lesson=${lesson.id}` : '/pricing'}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        canAccess
                          ? 'bg-white border-brand-grey hover:border-brand-orange'
                          : 'bg-gray-50 border-brand-grey opacity-75'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        canAccess ? 'bg-brand-orange/10' : 'bg-gray-200'
                      }`}>
                        {canAccess ? (
                          <Play className="w-5 h-5 text-brand-orange" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-brand-granite text-sm">{lesson.title_en}</p>
                        <p className="text-xs text-brand-clay mt-0.5">
                          {lesson.duration_minutes} min
                          {lesson.is_free && (
                            <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">{t('free')}</span>
                          )}
                        </p>
                      </div>
                      {canAccess && <ChevronRight className="w-5 h-5 text-brand-clay" />}
                    </Link>
                  )
                })}
              </div>

              {/* Quiz CTA */}
              <div className="mt-6 bg-brand-granite rounded-xl p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{t('takeQuiz')}</h3>
                  <p className="text-sm text-brand-blue mt-1">Test your understanding of {selectedChapter?.title_en || 'this chapter'}</p>
                </div>
                <Link
                  href={`/quizzes/${selectedChapter?.id || 1}`}
                  className="px-5 py-2.5 bg-brand-orange text-white rounded-lg font-semibold text-sm hover:bg-brand-clay transition-colors"
                >
                  {t('startQuiz')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
