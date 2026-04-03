'use client'
import '../lib/i18n'
import { AuthProvider } from '../lib/auth-context'
import InstallPrompt from '../components/ui/InstallPrompt'

export function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <InstallPrompt />
    </AuthProvider>
  )
}
