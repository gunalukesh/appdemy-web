'use client'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'
import StatCard from '../ui/StatCard'
import { Shield, Activity, AlertTriangle, Server, Users, Layers } from 'lucide-react'

export default function SuperAdminDashboard() {
  const { t } = useTranslation()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-granite">{t('platformHealth')}</h1>
        <p className="text-sm text-brand-clay mt-1">System-wide monitoring and infrastructure</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title={t('uptime')} value="99.97%" icon={Shield} />
        <StatCard title={t('systemLoad')} value="34%" icon={Server} />
        <StatCard title={t('errorRate')} value="0.02%" icon={AlertTriangle} trend={-15} />
        <StatCard title="Active Connections" value="1,247" icon={Activity} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Infrastructure */}
        <div className="bg-white rounded-xl border border-brand-grey p-6">
          <h2 className="font-bold text-brand-granite mb-4">Infrastructure</h2>
          <div className="space-y-3">
            {[
              { name: 'Vercel (Frontend)', status: 'healthy', latency: '45ms', region: 'Mumbai' },
              { name: 'Supabase (Database)', status: 'healthy', latency: '12ms', region: 'Mumbai' },
              { name: 'Supabase (Storage)', status: 'healthy', latency: '89ms', region: 'Mumbai' },
              { name: 'Razorpay (Payments)', status: 'healthy', latency: '156ms', region: 'India' },
              { name: 'Supabase (Realtime)', status: 'healthy', latency: '23ms', region: 'Mumbai' },
            ].map((svc, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-brand-grey last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${svc.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-brand-granite">{svc.name}</p>
                    <p className="text-xs text-brand-clay">{svc.region}</p>
                  </div>
                </div>
                <span className="text-sm font-mono text-brand-clay">{svc.latency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-xl border border-brand-grey p-6">
          <h2 className="font-bold text-brand-granite mb-4">User Distribution</h2>
          <div className="space-y-3">
            {[
              { role: 'Students', count: 4832, color: 'bg-brand-orange' },
              { role: 'Parents', count: 3100, color: 'bg-brand-blue' },
              { role: 'Teachers', count: 45, color: 'bg-brand-clay' },
              { role: 'Content Managers', count: 8, color: 'bg-green-500' },
              { role: 'Admins', count: 3, color: 'bg-brand-granite' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-brand-granite flex-1">{item.role}</span>
                <span className="text-sm font-bold text-brand-granite">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-brand-grey">
            <h3 className="font-medium text-brand-granite text-sm mb-2">Monthly Cost</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-brand-grey/50 rounded-lg p-2">
                <p className="font-bold text-brand-granite">₹0</p>
                <p className="text-xs text-brand-clay">Vercel</p>
              </div>
              <div className="bg-brand-grey/50 rounded-lg p-2">
                <p className="font-bold text-brand-granite">₹0</p>
                <p className="text-xs text-brand-clay">Supabase</p>
              </div>
              <div className="bg-brand-grey/50 rounded-lg p-2">
                <p className="font-bold text-brand-granite">2%</p>
                <p className="text-xs text-brand-clay">Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
  }
