'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../lib/store'
import { BookOpen, Video, Brain, MessageCircle, Shield, Globe, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { user, profile, loading } = useAppStore()

  useEffect(() => {
    if (!loading && user && profile) {
      router.push('/dashboard')
    }
  }, [user, profile, loading, router])

  if (loading) return null

  const features = [
    { icon: Video, title: 'Video Lessons', desc: 'HD video lessons for every chapter, with Tamil & English audio', color: 'bg-brand-orange' },
    { icon: Brain, title: 'AI Focus Tracking', desc: 'Camera-based concentration detection to help students stay engaged', color: 'bg-brand-clay' },
    { icon: MessageCircle, title: 'Live Doubt Clearing', desc: 'Real-time chat with qualified teachers for instant help', color: 'bg-brand-blue' },
    { icon: Shield, title: 'Parent Dashboard', desc: 'Weekly progress reports sent to parents with focus analytics', color: 'bg-brand-granite' },
  ]

  const plans = [
    { name: 'Monthly', price: '₹99', period: '/month', desc: 'All subjects, all standards', popular: false },
    { name: 'Annual', price: '₹799', period: '/year', desc: 'Save ₹389 — best value', popular: true },
    { name: 'Per Subject', price: '₹29', period: '/subject/month', desc: 'Pick the subjects you need', popular: false },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-brand-grey">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-orange flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-brand-granite">Appdemy</h1>
              <p className="text-xs text-brand-clay">Tamil Nadu State Board</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <button
              onClick={() => router.push('/auth')}
              className="px-5 py-2.5 bg-brand-orange text-white rounded-lg font-semibold text-sm hover:bg-brand-clay transition-colors"
            >
              {t('login')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-granite leading-tight mb-6">
          Learn Smarter with<br />
          <span className="text-brand-orange">Appdemy</span>
        </h2>
        <p className="text-lg text-brand-clay max-w-2xl mx-auto mb-8">
          Interactive video lessons, AI-powered focus tracking, live doubt clearing, and parent dashboards — aligned to the Tamil Nadu Samacheer Kalvi syllabus.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/auth')}
            className="px-8 py-3.5 bg-brand-orange text-white rounded-xl font-bold text-base hover:bg-brand-clay transition-colors flex items-center justify-center gap-2"
          >
            Start Learning Free <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/auth?role=teacher')}
            className="px-8 py-3.5 border-2 border-brand-granite text-brand-granite rounded-xl font-bold text-base hover:bg-brand-grey transition-colors"
          >
            I&apos;m a Teacher
          </button>
        </div>
        <p className="text-sm text-brand-blue mt-4">Free chapters available — no credit card needed</p>
      </section>

      {/* Features */}
      <section className="bg-brand-grey py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-12 text-brand-granite">Everything Students Need</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className={`w-12 h-12 ${f.color} rounded-lg flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-brand-granite mb-2">{f.title}</h4>
                <p className="text-sm text-brand-clay">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-2 text-brand-granite">Simple Pricing</h3>
          <p className="text-center text-brand-clay mb-12">Affordable for every family in Tamil Nadu</p>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`rounded-xl p-6 border-2 ${plan.popular ? 'border-brand-orange bg-orange-50' : 'border-brand-grey bg-white'} relative`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h4 className="font-bold text-brand-granite text-lg">{plan.name}</h4>
                <div className="mt-3 mb-4">
                  <span className="text-3xl font-extrabold text-brand-granite">{plan.price}</span>
                  <span className="text-sm text-brand-clay">{plan.period}</span>
                </div>
                <p className="text-sm text-brand-clay mb-6">{plan.desc}</p>
                <button
                  onClick={() => router.push('/auth')}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm ${
                    plan.popular
                      ? 'bg-brand-orange text-white hover:bg-brand-clay'
                      : 'bg-brand-grey text-brand-granite hover:bg-brand-blue hover:text-white'
                  } transition-colors`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="bg-brand-granite text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8">Complete Syllabus Coverage</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['9th Standard', '10th Standard', '11th Standard', '12th Standard'].map((std, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-6 backdrop-blur">
                <p className="text-3xl font-extrabold mb-1">{9 + i}th</p>
                <p className="text-sm text-brand-blue">{std}</p>
                <p className="text-xs text-brand-blue/70 mt-1">5 subjects &middot; 40+ chapters</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-8">
            <Globe className="w-5 h-5 text-brand-blue" />
            <p className="text-brand-blue">Available in Tamil and English</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-grey py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-brand-clay">&copy; 2026 Pentimenti AI &middot; Appdemy &middot; Built for Tamil Nadu students</p>
        </div>
      </footer>
    </div>
  )
}

function LangToggle() {
  const { lang, toggleLang } = useAppStore()
  const { i18n } = useTranslation()

  const handleToggle = () => {
    const newLang = lang === 'en' ? 'ta' : 'en'
    toggleLang()
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={handleToggle}
      className="px-3 py-2 text-sm font-medium text-brand-granite border border-brand-grey rounded-lg hover:bg-brand-grey transition-colors"
    >
      {lang === 'en' ? 'தமிழ்' : 'English'}
    </button>
  )
}
