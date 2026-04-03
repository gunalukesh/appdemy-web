import './globals.css'
import { Providers } from './providers'
import { PWARegister } from './pwa-register'

export const metadata = {
  title: 'Appdemy — Tamil Nadu State Board Learning Platform',
  description: 'Interactive video lessons, quizzes, AI concentration tracking, and live doubt clearing for Tamil Nadu State Board syllabus. Standards 9-12.',
  keywords: 'Appdemy, Tamil Nadu, State Board, education, Tamil, online learning, Samacheer Kalvi',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Appdemy',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#FF4A13" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Appdemy" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-96.png" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <PWARegister />
      </body>
    </html>
  )
}
