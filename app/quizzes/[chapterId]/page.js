'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../../lib/store'
import { curriculum, progress } from '../../../lib/supabase'
import Navbar from '../../../components/ui/Navbar'
import Sidebar from '../../../components/ui/Sidebar'
import { CheckCircle, XCircle, ChevronRight, Clock, Award, RotateCcw } from 'lucide-react'

const FALLBACK_QUESTIONS = [
  {
    id: 1, question_en: 'Which of the following is an irrational number?',
    question_ta: 'பின்வருவனவற்றுள் எது ஒரு விகிதமுறா எண்?',
    options_json: ['√2', '3/4', '0.25', '7'],
    correct_index: 0, difficulty: 'easy',
    explanation_en: '√2 cannot be expressed as a ratio of two integers, making it irrational.'
  },
  {
    id: 2, question_en: 'The decimal expansion of a rational number is:',
    question_ta: 'ஒரு விகிதமுறு எண்ணின் தசம விரிவு:',
    options_json: ['Always terminating', 'Always non-terminating', 'Either terminating or repeating', 'Always non-repeating'],
    correct_index: 2, difficulty: 'medium',
    explanation_en: 'Rational numbers have decimal expansions that either terminate or eventually repeat.'
  },
  {
    id: 3, question_en: 'If x = 2 + √3, then x + 1/x equals:',
    question_ta: 'x = 2 + √3 எனில், x + 1/x சமம்:',
    options_json: ['4', '2√3', '4 + 2√3', '2'],
    correct_index: 0, difficulty: 'hard',
    explanation_en: '1/x = 1/(2+√3) = (2-√3)/((2+√3)(2-√3)) = (2-√3)/1 = 2-√3. So x + 1/x = (2+√3) + (2-√3) = 4.'
  },
  {
    id: 4, question_en: 'The product of two irrational numbers is:',
    question_ta: 'இரண்டு விகிதமுறா எண்களின் பெருக்கல்:',
    options_json: ['Always irrational', 'Always rational', 'Sometimes rational, sometimes irrational', 'Never defined'],
    correct_index: 2, difficulty: 'medium',
    explanation_en: 'For example, √2 × √2 = 2 (rational), but √2 × √3 = √6 (irrational).'
  },
  {
    id: 5, question_en: 'Between two rational numbers, there exist:',
    question_ta: 'இரண்டு விகிதமுறு எண்களுக்கிடையே உள்ளன:',
    options_json: ['No rational numbers', 'Exactly one rational number', 'Finitely many rational numbers', 'Infinitely many rational numbers'],
    correct_index: 3, difficulty: 'easy',
    explanation_en: 'Between any two rational numbers, there are infinitely many rational numbers (density property).'
  },
]

export default function QuizPage() {
  const { chapterId } = useParams()
  const { t } = useTranslation()
  const { profile, sidebarOpen } = useAppStore()

  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [startTime] = useState(Date.now())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const qs = await curriculum.getQuestions(chapterId)
      setQuestions(qs?.length ? qs : FALLBACK_QUESTIONS)
      setLoading(false)
    }
    load()
  }, [chapterId])

  const handleAnswer = (index) => {
    if (answers[currentQ] !== undefined) return // Already answered
    setAnswers({ ...answers, [currentQ]: index })
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
      setShowExplanation(false)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setShowResult(true)
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    const score = Object.entries(answers).filter(
      ([qi, ai]) => questions[Number(qi)]?.correct_index === ai
    ).length

    if (profile?.id) {
      await progress.submitQuizAttempt(profile.id, chapterId, score, questions.length, answers, timeSpent)
      await progress.updateStreak(profile.id)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setCurrentQ(0)
    setShowResult(false)
    setShowExplanation(false)
  }

  const score = Object.entries(answers).filter(
    ([qi, ai]) => questions[Number(qi)]?.correct_index === ai
  ).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const q = questions[currentQ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className={`transition-all duration-200 pt-4 pb-8 px-4 lg:px-6 ${sidebarOpen ? 'lg:ml-56' : 'lg:ml-16'}`}>
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-brand-clay mb-6">
            <Link href="/dashboard" className="hover:text-brand-orange">{t('dashboard')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-granite font-medium">{t('quizzes')}</span>
          </div>

          {!showResult ? (
            <>
              {/* Progress */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-brand-clay">
                  Question {currentQ + 1} of {questions.length}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-brand-clay">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round((Date.now() - startTime) / 1000)}s</span>
                </div>
              </div>
              <div className="h-2 bg-brand-grey rounded-full mb-6">
                <div
                  className="h-full bg-brand-orange rounded-full transition-all"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className="bg-white rounded-2xl border border-brand-grey p-6 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-brand-granite mb-2">{q.question_en}</h2>
                <p className="text-sm text-brand-clay mb-6">{q.question_ta}</p>

                <div className="space-y-3">
                  {(q.options_json || []).map((option, i) => {
                    const isSelected = answers[currentQ] === i
                    const isCorrect = q.correct_index === i
                    const isAnswered = answers[currentQ] !== undefined

                    let borderClass = 'border-brand-grey hover:border-brand-blue'
                    if (isAnswered) {
                      if (isCorrect) borderClass = 'border-green-500 bg-green-50'
                      else if (isSelected) borderClass = 'border-red-500 bg-red-50'
                    } else if (isSelected) {
                      borderClass = 'border-brand-orange bg-orange-50'
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${borderClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                            isAnswered && isCorrect ? 'border-green-500 text-green-600' :
                            isAnswered && isSelected ? 'border-red-500 text-red-600' :
                            'border-brand-grey text-brand-clay'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-sm font-medium text-brand-granite">{option}</span>
                          {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                          {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Explanation */}
              {showExplanation && q.explanation_en && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-blue-900">Explanation</p>
                  <p className="text-sm text-blue-800 mt-1">{q.explanation_en}</p>
                </div>
              )}

              {/* Next Button */}
              {answers[currentQ] !== undefined && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-brand-orange text-white rounded-xl font-semibold hover:bg-brand-clay transition-colors flex items-center justify-center gap-2"
                >
                  {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </>
          ) : (
            /* Results */
            <div className="bg-white rounded-2xl border border-brand-grey p-8 text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                score / questions.length >= 0.7 ? 'bg-green-100' : score / questions.length >= 0.4 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <Award className={`w-10 h-10 ${
                  score / questions.length >= 0.7 ? 'text-green-600' : score / questions.length >= 0.4 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
              <h2 className="text-2xl font-bold text-brand-granite">
                {score / questions.length >= 0.7 ? 'Excellent!' : score / questions.length >= 0.4 ? 'Good effort!' : 'Keep practicing!'}
              </h2>
              <p className="text-4xl font-extrabold text-brand-orange mt-2">{score}/{questions.length}</p>
              <p className="text-sm text-brand-clay mt-1">
                {Math.round(score / questions.length * 100)}% correct &middot; {Math.round((Date.now() - startTime) / 1000)}s
              </p>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleRetry}
                  className="flex-1 py-3 border-2 border-brand-granite text-brand-granite rounded-xl font-semibold hover:bg-brand-grey transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Retry
                </button>
                <Link
                  href="/learn"
                  className="flex-1 py-3 bg-brand-orange text-white rounded-xl font-semibold hover:bg-brand-clay transition-colors flex items-center justify-center gap-2"
                >
                  Continue Learning <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
