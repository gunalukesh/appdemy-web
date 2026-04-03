'use client'

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'brand-orange', trend }) {
  return (
    <div className="bg-white rounded-xl border border-brand-grey p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-brand-clay font-medium">{title}</p>
          <p className="text-2xl font-bold text-brand-granite mt-1">{value}</p>
          {subtitle && <p className="text-xs text-brand-clay mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last week
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${color}`} />
          </div>
        )}
      </div>
    </div>
  )
}
