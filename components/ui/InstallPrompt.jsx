'use client'
import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // Check if dismissed recently
    const dismissed = localStorage.getItem('pwa-dismissed')
    if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) return

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    if (isIOSDevice) {
      // iOS doesn't fire beforeinstallprompt, show manual instructions
      setTimeout(() => setShowBanner(true), 3000)
      return
    }

    // Android/Chrome install prompt
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowBanner(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    try { localStorage.setItem('pwa-dismissed', String(Date.now())) } catch {}
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 safe-area-bottom">
      <div className="max-w-md mx-auto bg-brand-granite text-white rounded-2xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-orange flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">Install Appdemy App</h3>
            {isIOS ? (
              <p className="text-xs text-brand-blue mt-1">
                Tap the share button <span className="inline-block px-1 bg-white/20 rounded text-xs">⬆</span> then &quot;Add to Home Screen&quot;
              </p>
            ) : (
              <p className="text-xs text-brand-blue mt-1">
                Install for quick access — works offline too!
              </p>
            )}
          </div>
          <button onClick={handleDismiss} className="p-1 hover:bg-white/10 rounded">
            <X className="w-4 h-4 text-brand-blue" />
          </button>
        </div>
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="w-full mt-3 py-2.5 bg-brand-orange text-white rounded-xl font-semibold text-sm hover:bg-brand-clay transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Install App
          </button>
        )}
      </div>
    </div>
  )
}
