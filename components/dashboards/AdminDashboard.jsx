'use client'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'
import StatCard from '../ui/StatCard'
import { Users, TrendingUp, Layers, AlertTriangle, Activity } from 'lucide-react'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const { profile } = useAppStore()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-granite">Admin Dashboard</h1>
        <p className="text-sm text-brand-clay mt-1">Platform overview for {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title={t('totalStudents')} value="4,832" icon={Users} trend={12} />
        <StatCard title={t('activeToday')} value="1,247" icon={Activity} trend={5} />
        <StatCard title={t('monthlyRevenue')} value="₹4.7L" icon={Layers} trend={18} />
        <StatCard title="Churn Rate" value="3.2%" icon={AlertTriangle} trend={-1} />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-brand-grey p-6">
          <h2 className="font-bold text-brand-granite mb-4">Revenue by Plan</h2>
          <div className="space-y-3">
            {[
              { plan: 'Monthly (₹99)', count: 2140, revenue: '₹2.12L', percent: 45 },
              { plan: 'Annual (₹799)', count: 890, revenue: '₹7.11L', percent: 38 },
              { plan: 'Per Subject (₹29)', count: 1802, revenue: '₹0.52L', percent: 17 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-brand-granite font-medium">{item.plan}</span>
                  <span className="text-brand-clay">{item.count} users &middot; {item.revenue}</span>
                </div>
                <div className="h-2 bg-brand-grey rounded-full overflow-hidden">
                  <div className="h-full bg-brand-orange rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-brand-grey p-6">
          <h2 className="font-bold text-brand-granite mb-4">Top Performing Standards</h2>
          <div className="space-y-3">
            {[
              { std: '10th Standard', students: 2100, avgScore: 82, avgFocus: 78 },
              { std: '12th Standard', students: 1200, avgScore: 79, avgFocus: 81 },
              { std: '11th Standard', students: 890, avgScore: 75, avgFocus: 74 },
              { std: '9th Standard', students: 642, avgScore: 84, avgFocus: 70 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-brand-grey last:border-0">
                <div>
                  <p className="font-medium text-brand-granite text-sm">{item.std}</p>
                  <p className="text-xs text-brand-clay">{item.students.toLocaleString()} students</p>
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-sm font-bold text-brand-granite">{item.avgScore}%</p>
                    <p className="text-xs text-brand-clay">Quiz</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-blue">{item.avgFocus}%</p>
                    <p className="text-xs text-brand-clay">Focus</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl border border-brand-grey p-6">
        <h2 className="font-bold text-brand-granite mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {[
            { msg: '23 students have not logged in for 7+ days', type: 'warning', time: '2 hours ago' },
            { msg: 'New content published: Chapter 8 — Statistics (10th Maths)', type: 'info', time: '5 hours ago' },
            { msg: 'Payment gateway latency spike detected (resolved)', type: 'resolved', time: '1 day ago' },
          ].map((alert, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${
              alert.type === 'warning' ? 'bg-yellow-50' : alert.type === 'info' ? 'bg-blue-50' : 'bg-green-50'
            }`}>
              <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
                alert.type === 'warning' ? 'text-yellow-600' : alert.type === 'info' ? 'text-blue-600' : 'text-green-600'
              }`} />
              <p className="text-sm text-brand-granite flex-1">{alert.msg}</p>
              <span className="text-xs text-brand-clay flex-shrink-0">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
