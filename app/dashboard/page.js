'use client'
import { useAppStore } from '../../lib/store'
import StudentDashboard from '../../components/dashboards/StudentDashboard'
import TeacherDashboard from '../../components/dashboards/TeacherDashboard'
import ParentDashboard from '../../components/dashboards/ParentDashboard'
import AdminDashboard from '../../components/dashboards/AdminDashboard'
import ContentMgrDashboard from '../../components/dashboards/ContentMgrDashboard'
import SuperAdminDashboard from '../../components/dashboards/SuperAdminDashboard'

const DASHBOARDS = {
  student: StudentDashboard,
  teacher: TeacherDashboard,
  parent: ParentDashboard,
  admin: AdminDashboard,
  content_mgr: ContentMgrDashboard,
  super_admin: SuperAdminDashboard,
}

export default function DashboardPage() {
  const { profile } = useAppStore()
  const Dashboard = DASHBOARDS[profile?.role] || StudentDashboard

  return <Dashboard />
}
