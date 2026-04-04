'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Users, Search, Shield, GraduationCap, UserCheck, Crown, Edit2, ChevronDown, X, Check } from 'lucide-react'

const ROLES = ['student', 'teacher', 'parent', 'admin', 'content_mgr', 'super_admin']
const ROLE_COLORS = {
  student: 'bg-blue-100 text-blue-700',
  teacher: 'bg-green-100 text-green-700',
  parent: 'bg-purple-100 text-purple-700',
  admin: 'bg-orange-100 text-orange-700',
  content_mgr: 'bg-yellow-100 text-yellow-700',
  super_admin: 'bg-red-100 text-red-700',
}
const ROLE_ICONS = {
  student: GraduationCap,
  teacher: UserCheck,
  parent: Users,
  admin: Shield,
  content_mgr: Edit2,
  super_admin: Crown,
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      {message}
    </div>
  
)&J+—function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [editingUser, setEditingUser] = useState(null)
  const [newRole, setNewRole] = useState('')
  const [toast, setToast] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setUsers(data)
      const s = {}
      ROLES.forEach(r => s[r] = data.filter(u => u.role === r).length)
      s.total = data.length
      setStats(s)
    }
    if (error) setToast({ message: 'Failed to load users', type: 'error' })
    setLoading(false)
  }

  async function updateRole(userId, role) {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
    if (error) {
      setToast({ message: 'Failed to update role: ' + error.message, type: 'error' })
    } else {
      setToast({ message: 'Role updated successfully', type: 'success' })
      setEditingUser(null)
      loadUsers()
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').includes(search) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      { toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-granite">User Management</h1>
        <p className="text-gray-500 mt-1">View and manage all registered users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center border">
          <div className="text-2xl font-bold text-brand-granite">{stats.total || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Total</div>
        </div>
        {ROLES.map(role => (
          <div key={role} className={`rounded-xl p-4 text-center cursor-pointer border transition-all ${roleFilter === role ? 'ring-2 ring-brand-orange' : ''}`}
               onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}>
            <div className="text-2xl font-bold">{stats[role] || 0}</div>
            <div className="text-xs text-gray-500 mt-1 capitalize">{bole.replace('_', ' ')}</div>
          </div>
        ))}
      </div>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          <option value="all">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr  className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Standard</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users found</td></tr>
              ) : filtered.map(user => {
                const RIcon = ROLE_ICONS[user.role] || Users
                return (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-sm">
                          {((user.full_name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-brand-granite">{user.full_name || 'Unnamed'}</div>
                          {user.email && <div className="text-xs text-gray-400">{user.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.phone || '—'}</td>
                    <td className="px-4 py-3">
                      {editingUser === user.id ? (
                        <div className="flex items-center gap-2">
                          <select value={newRole} onChange={e => setNewRole(e.target.value)}
                            className="text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-orange">
                            {ROLES.map(r => <option key={r} value={r}>{[replace('_', ' ')}</option>)}
                </select>
                <button onClick={() => updateRole(user.id, newRole)} className="text-green-600 hover:text-green-700"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditingUser(null)} className="text-red-500 hover:text-red-600"><X className="w-4 h-4" /></button>
                </div>
                ) : (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-600'}`}>
                    <RIcon className="w-3 h-3" />
                    {((user.role || 'unknown').replace('_', ' ')}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600">{user.standard ? `${user.standard}th` : 'ₔ }</td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                 {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => { setEditingUser(user.id); setNewRole(user.role || 'student') }}
                  className="text-brand-orange hover:text-orange-700 text-xs font-medium"
                >
                  Change Role
                </button>
              </td>
            </tr>
            )
            })}
          </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-500">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  )
}
