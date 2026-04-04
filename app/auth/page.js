'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { auth } from '../../lib/supabase'
import { useAppStore } from '../../lib/store'
import { BookOpen, Phone, ArrowRight, Loader2 } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { setUser, setProfile } = useAppStore()

  const [step, setStep] = useState('phone') // 'phone' | 'otp' | 'profile'
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('student')
  const [standard, setStandard] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`
    if (formattedPhone.length < 13) {
      setError('Please enter a valid 10-digit phone number')
      setLoading(false)
      return
    }

    try {
      const { error: otpError } = await auth.sendOTP(formattedPhone)
      if (otpError) throw otpError
      setStep('otp')
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`

    try {
      const { data, error: verifyError } = await auth.verifyOTP(formattedPhone, otp)
      if (verifyError) throw verifyError

      // Check if profile exists
      const { data: profile } = await auth.getProfile(data.user.id)
      if (profile) {
        setUser(data.user)
        setProfile(profile)
        router.push('/dashboard')
      } else {
        // New user — need to create profile
        setUser(data.user)
        setStep('profile')
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProfile = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { user } = useAppStore.getState()
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          phone: user.phone,
          name_en: name,
          role: role,
          standard_id: standard || null,
          lang_pref: useAppStore.getState().lang,
        })
        .select()
        .single()

      if (profileError) throw profileError
      setProfile(profile)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create profile.')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: 'student', label: 'Student / மாணவர்', emoji: '📚' },
    { value: 'teacher', label: 'Teacher / ஆசிரியர்', emoji: '👨‍🏫' },
    { value: 'parent', label: 'Parent / பெற்றோர்', emoji: '👪' },
  ]

  return (
    <div className="min-h-screen bg-brand-grey flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-granite">Appdemy</h1>
          <p className="text-sm text-brand-clay mt-1">{t('loginSubtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-grey p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Step: Phone */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP}>
              <label className="block text-sm font-medium text-brand-granite mb-2">
                {t('phoneLabel')}
              </label>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-3 bg-brand-grey rounded-lg text-sm font-medium text-brand-granite">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="flex-1 px-4 py-3 border border-brand-grey rounded-lg text-base focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                  maxLength={10}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || phone.replace(/\D/g, '').length < 10}
                className="w-full py-3 bg-brand-orange text-white rounded-lg font-semibold text-sm hover:bg-brand-clay transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                {t('sendOTP')}
              </button>
              <p className="text-xs text-center text-brand-clay mt-4">{t('noAccount')}</p>
            </form>
          )}

          {/* Step: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP}>
              <p className="text-sm text-brand-clay mb-4">
                OTP sent to +91{phone.replace(/\D/g, '')}
                <button type="button" onClick={() => setStep('phone')} className="ml-2 text-brand-orange font-medium">
                  Change
                </button>
              </p>
              <label className="block text-sm font-medium text-brand-granite mb-2">
                {t('enterOTP')}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 border border-brand-grey rounded-lg text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none mb-4"
                maxLength={6}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3 bg-brand-orange text-white rounded-lg font-semibold text-sm hover:bg-brand-clay transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {t('verifyOTP')}
              </button>
            </form>
          )}

          {/* Step: Profile Setup */}
          {step === 'profile' && (
            <form onSubmit={handleCreateProfile}>
              <h3 className="font-bold text-brand-granite mb-4">Complete Your Profile</h3>

              <label className="block text-sm font-medium text-brand-granite mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-brand-grey rounded-lg text-base focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none mb-4"
                autoFocus
              />

              <label className="block text-sm font-medium text-brand-granite mb-2">I am a...</label>
              <div className="space-y-2 mb-4">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`w-full p-3 rounded-lg border-2 text-left text-sm font-medium transition-colors ${
                      role === r.value
                        ? 'border-brand-orange bg-orange-50 text-brand-granite'
                        : 'border-brand-grey text-brand-clay hover:border-brand-blue'
                    }`}
                  >
                    {r.emoji} {r.label}
                  </button>
                ))}
              </div>

              {role === 'student' && (
                <>
                  <label className="block text-sm font-medium text-brand-granite mb-1">Standard</label>
                  <select
                    value={standard}
                    onChange={(e) => setStandard(e.target.value)}
                    className="w-full px-4 py-3 border border-brand-grey rounded-lg text-base focus:ring-2 focus:ring-brand-orange outline-none mb-4"
                  >
                    <option value="">Select standard</option>
                    <option value="9">9th Standard</option>
                    <option value="10">10th Standard</option>
                    <option value="11">11th Standard</option>
                    <option value="12">12th Standard</option>
                  </select>
                </>
              )}

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full py-3 bg-brand-orange text-white rounded-lg font-semibold text-sm hover:bg-brand-clay transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Start Learning
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
