'use client'
import { useState, useEffect, useCallback } from 'react'
import { admin, curriculum } from '../../../lib/supabase'
import {
  Layers, BookOpen, FileText, Video, HelpCircle,
  Plus, Pencil, Trash2, ChevronRight, ChevronDown,
  Save, X, ArrowLeft, AlertCircle, Check, Loader2
} from 'lucide-react'

// ─── Tabs ────────────────────────────────────────────────
const TABS = [
  { key: 'overview', label: 'Overview', icon: Layers },
  { key: 'chapters', label: 'Chapters', icon: BookOpen },
  { key: 'lessons', label: 'Lessons', icon: Video },
  { key: 'questions', label: 'Questions', icon: HelpCircle },
]

// ─── Toast component ─────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}>
      {type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────
export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [standards, setStandards] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedStandard, setSelectedStandard] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  const showToast = (message, type = 'success') => setToast({ message, type })

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [statsRes, standardsRes] = await Promise.all([
      admin.getContentStats(),
      admin.getStandards(),
    ])
    setStats(statsRes)
    setStandards(standardsRes.data || [])
    setLoading(false)
  }

  // Load subjects when standard changes
  useEffect(() => {
    if (selectedStandard) {
      admin.getSubjects(selectedStandard.id).then(r => setSubjects(r.data || []))
    } else {
      setSubjects([])
    }
    setSelectedSubject(null)
  }, [selectedStandard])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-granite">Content Management</h1>
        <p className="text-sm text-brand-clay mt-1">Manage curriculum: standards, subjects, chapters, lessons & quizzes</p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Standards', value: stats.standards, color: 'bg-blue-50 text-blue-700' },
            { label: 'Subjects', value: stats.subjects, color: 'bg-purple-50 text-purple-700' },
            { label: 'Chapters', value: stats.chapters, color: 'bg-orange-50 text-orange-700' },
            { label: 'Lessons', value: stats.lessons, color: 'bg-green-50 text-green-700' },
            { label: 'Questions', value: stats.questions, color: 'bg-pink-50 text-pink-700' },
            { label: 'Users', value: stats.users, color: 'bg-gray-50 text-gray-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Standard / Subject Selector */}
      <div className="bg-white rounded-xl border border-brand-grey p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-brand-clay">Standard:</span>
          <div className="flex flex-wrap gap-2">
            {standards.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStandard(selectedStandard?.id === s.id ? null : s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStandard?.id === s.id
                    ? 'bg-brand-orange text-white'
                    : 'bg-brand-grey text-brand-granite hover:bg-brand-orange/10'
                }`}
              >
                {s.number}th
              </button>
            ))}
          </div>

          {selectedStandard && subjects.length > 0 && (
            <>
              <div className="w-px h-8 bg-brand-grey mx-2" />
              <span className="text-sm font-medium text-brand-clay">Subject:</span>
              <div className="flex flex-wrap gap-2">
                {subjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubject(selectedSubject?.id === s.id ? null : s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedSubject?.id === s.id
                        ? 'bg-brand-granite text-white'
                        : 'bg-brand-grey text-brand-granite hover:bg-brand-granite/10'
                    }`}
                  >
                    {s.icon} {s.name_en}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-brand-grey p-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === tab.key
                ? 'bg-brand-orange text-white'
                : 'text-brand-clay hover:bg-brand-grey'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          standards={standards}
          selectedStandard={selectedStandard}
          selectedSubject={selectedSubject}
          showToast={showToast}
          onRefresh={loadData}
        />
      )}
      {activeTab === 'chapters' && (
        <ChaptersTab
          selectedStandard={selectedStandard}
          selectedSubject={selectedSubject}
          showToast={showToast}
        />
      )}
      {activeTab === 'lessons' && (
        <LessonsTab
          selectedStandard={selectedStandard}
          selectedSubject={selectedSubject}
          showToast={showToast}
        />
      )}
      {activeTab === 'questions' && (
        <QuestionsTab
          selectedStandard={selectedStandard}
          selectedSubject={selectedSubject}
          showToast={showToast}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════
function OverviewTab({ standards, selectedStandard, selectedSubject, showToast, onRefresh }) {
  const [subjects, setSubjects] = useState([])
  const [editingSubject, setEditingSubject] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedStandard) {
      admin.getSubjects(selectedStandard.id).then(r => setSubjects(r.data || []))
    }
  }, [selectedStandard])

  const handleSaveSubject = async (formData) => {
    const { data, error } = await admin.upsertSubject({
      ...formData,
      standard_id: selectedStandard.id,
    })
    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast(editingSubject ? 'Subject updated!' : 'Subject created!')
      setShowForm(false)
      setEditingSubject(null)
      admin.getSubjects(selectedStandard.id).then(r => setSubjects(r.data || []))
      onRefresh()
    }
  }

  const handleDeleteSubject = async (id) => {
    if (!confirm('Delete this subject? All chapters, lessons, and questions under it will be orphaned.')) return
    const { error } = await admin.deleteSubject(id)
    if (error) showToast(error.message, 'error')
    else {
      showToast('Subject deleted')
      admin.getSubjects(selectedStandard.id).then(r => setSubjects(r.data || []))
      onRefresh()
    }
  }

  if (!selectedStandard) {
    return (
      <div className="bg-white rounded-xl border border-brand-grey p-12 text-center">
        <Layers className="w-12 h-12 text-brand-clay mx-auto mb-3" />
        <h3 className="font-bold text-brand-granite text-lg">Select a Standard</h3>
        <p className="text-sm text-brand-clay mt-1">Choose a standard above to manage its subjects and content</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-brand-granite">
          {selectedStandard.name_en} — Subjects ({subjects.length})
        </h2>
        <button
          onClick={() => { setEditingSubject(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-brand-clay transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {showForm && (
        <SubjectForm
          initial={editingSubject}
          onSave={handleSaveSubject}
          onCancel={() => { setShowForm(false); setEditingSubject(null) }}
        />
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white rounded-xl border border-brand-grey p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{subject.icon}</div>
              <div className="flex gap-1">
                <button
                  onClick={() => { setEditingSubject(subject); setShowForm(true) }}
                  className="p-1.5 text-brand-clay hover:text-brand-orange rounded-lg hover:bg-brand-grey"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSubject(subject.id)}
                  className="p-1.5 text-brand-clay hover:text-red-500 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-brand-granite">{subject.name_en}</h3>
            <p className="text-sm text-brand-clay">{subject.name_ta}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-brand-clay">
              <span className="bg-brand-grey px-2 py-0.5 rounded">{subject.code}</span>
              <span>Sort: {subject.sort_order}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Subject form ────────────────────────────────────────
function SubjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name_en: initial?.name_en || '',
    name_ta: initial?.name_ta || '',
    code: initial?.code || '',
    icon: initial?.icon || '',
    sort_order: initial?.sort_order || 1,
    ...(initial?.id ? { id: initial.id } : {}),
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 rounded-xl border border-blue-200 p-5 space-y-4">
      <h3 className="font-bold text-brand-granite">{initial ? 'Edit Subject' : 'New Subject'}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Name (English)*</label>
          <input required value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" placeholder="Mathematics" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Name (Tamil)</label>
          <input value={form.name_ta} onChange={e => setForm({ ...form, name_ta: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" placeholder="கணிதம்" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Code*</label>
          <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" placeholder="MATH_10" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-brand-clay mb-1">Icon (emoji)</label>
            <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
              className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" placeholder="🐐" />
          </div>
          <div className="w-24">
            <label className="block text-xs font-medium text-brand-clay mb-1">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-brand-clay hover:bg-brand-grey rounded-lg">Cancel</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-brand-clay disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}

// ═══════════════════════════════════════════════════════════
// CHAPTERS TAB
// ═══════════════════════════════════════════════════════════
function ChaptersTab({ selectedStandard, selectedSubject, showToast }) {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const loadChapters = useCallback(async () => {
    if (!selectedSubject) return
    setLoading(true)
    const { data } = await admin.getChapters(selectedSubject.id)
    setChapters(data || [])
    setLoading(false)
  }, [selectedSubject])

  useEffect(() => { loadChapters() }, [loadChapters])

  const handleSave = async (formData) => {
    const { data, error } = await admin.upsertChapter({
      ...formData,
      subject_id: selectedSubject.id,
    })
    if (error) showToast(error.message, 'error')
    else {
      showToast(editingChapter ? 'Chapter updated!' : 'Chapter created!')
      setShowForm(false)
      setEditingChapter(null)
      loadChapters()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this chapter? All lessons and questions under it will be orphaned.')) return
    const { error } = await admin.deleteChapter(id)
    if (error) showToast(error.message, 'error')
    else { showToast('Chapter deleted'); loadChapters() }
  }

  if (!selectedSubject) {
    return (
      <div className="bg-white rounded-xl border border-brand-grey p-12 text-center">
        <BookOpen className="w-12 h-12 text-brand-clay mx-auto mb-3" />
        <h3 className="font-bold text-brand-granite text-lg">Select a Subject</h3>
        <p className="text-sm text-brand-clay mt-1">Choose a standard and subject above to manage chapters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-brand-granite">
          {selectedSubject.icon} {selectedSubject.name_en} — Chapters ({chapters.length})
        </h2>
        <button
          onClick={() => { setEditingChapter(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-brand-clay transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Chapter
        </button>
      </div>

      {showForm && (
        <ChapterForm
          initial={editingChapter}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingChapter(null) }}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-brand-orange animate-spin" /></div>
      ) : chapters.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-grey p-8 text-center text-brand-clay text-sm">
          No chapters yet. Click "Add Chapter" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {chapters.map((ch, i) => (
            <div key={ch.id} className="bg-white rounded-xl border border-brand-grey p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold text-sm">
                {ch.number || i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-brand-granite text-sm truncate">{ch.title_en}</h3>
                <p className="text-xs text-brand-clay truncate">{ch.title_ta || '—'}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${ch.is_free ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {ch.is_free ? 'Free' : 'Premium'}
              </span>
              <div className="flex gap-1">
                <button onClick={() => { setEditingChapter(ch); setShowForm(true) }}
                  className="p-1.5 text-brand-clay hover:text-brand-orange rounded-lg hover:bg-brand-grey">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(ch.id)}
                  className="p-1.5 text-brand-clay hover:text-red-500 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ChapterForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    number: initial?.number || 1,
    title_en: initial?.title_en || '',
    title_ta: initial?.title_ta || '',
    description_en: initial?.description_en || '',
    description_ta: initial?.description_ta || '',
    is_free: initial?.is_free ?? true,
    sort_order: initial?.sort_order || 1,
    ...(initial?.id ? { id: initial.id } : {}),
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-green-50 rounded-xl border border-green-200 p-5 space-y-4">
      <h3 className="font-bold text-brand-granite">{initial ? 'Edit Chapter' : 'New Chapter'}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Title (English)*</label>
          <input required value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" placeholder="Polynomials" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Title (Tamil)</label>
          <input value={form.title_ta} onChange={e => setForm({ ...form, title_ta: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" placeholder="பல்லுறுப்னுக்கோவை" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Description (English)</label>
          <textarea value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" rows={2} placeholder="Introduction to polynomials..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Description (Tamil)</label>
          <textarea value={form.description_ta} onChange={e => setForm({ ...form, description_ta: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" rows={2} />
        </div>
        <div className="flex gap-4 items-end">
          <div className="w-24">
            <label className="block text-xs font-medium text-brand-clay mb-1">Chapter #</label>
            <input type="number" value={form.number} onChange={e => setForm({ ...form, number: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" />
          </div>
          <div className="w-24">
            <label className="block text-xs font-medium text-brand-clay mb-1">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm text-brand-granite cursor-pointer pb-2">
            <input type="checkbox" checked={form.is_free} onChange={e => setForm({ ...form, is_free: e.target.checked })}
              className="w-4 h-4 accent-brand-orange" />
            Free chapter
          </label>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-brand-clay hover:bg-brand-grey rounded-lg">Cancel</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-brand-clay disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}

// ═══════════════════════════════════════════════════════════
// LESSONS TAB
// ═══════════════════════════════════════════════════════════
function LessonsTab({ selectedStandard, selectedSubject, showToast }) {
  const [chapters, setChapters] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedSubject) {
      admin.getChapters(selectedSubject.id).then(r => {
        setChapters(r.data || [])
        setSelectedChapter(null)
        setLessons([])
      })
    }
  }, [selectedSubject])

  const loadLessons = useCallback(async () => {
    if (!selectedChapter) return
    setLoading(true)
    const { data } = await admin.getLessons(selectedChapter.id)
    setLessons(data || [])
    setLoading(false)
  }, [selectedChapter])

  useEffect(() => { loadLessons() }, [loadLessons])

  const handleSave = async (formData) => {
    const { data, error } = await admin.upsertLesson({
      ...formData,
      chapter_id: selectedChapter.id,
    })
    if (error) showToast(error.message, 'error')
    else {
      showToast(editingLesson ? 'Lesson updated!' : 'Lesson created!')
      setShowForm(false)
      setEditingLesson(null)
      loadLessons()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this lesson?')) return
    const { error } = await admin.deleteLesson(id)
    if (error) showToast(error.message, 'error')
    else { showToast('Lesson deleted'); loadLessons() }
  }

  if (!selectedSubject) {
    return (
      <div className="bg-white rounded-xl border border-brand-grey p-12 text-center">
        <Video className="w-12 h-12 text-brand-clay mx-auto mb-3" />
        <h3 className="font-bold text-brand-granite text-lg">Select a Subject</h3>
        <p className="text-sm text-brand-clay mt-1">Choose a standard and subject above, then pick a chapter</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Chapter selector */}
      <div className="bg-white rounded-xl border border-brand-grey p-4">
        <span className="text-sm font-medium text-brand-clay block mb-2">Chapter:</span>
        <div className="flex flex-wrap gap-2">
          {chapters.length === 0 && (
            <p className="text-sm text-brand-clay">No chapters found. Create chapters in the Chapters tab first.</p>
          )}
          {chapters.map(ch => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapter(selectedChapter?.id === ch.id ? null : ch)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedChapter?.id === ch.id
                  ? 'bg-brand-granite text-white'
                  : 'bg-brand-grey text-brand-granite hover:bg-brand-granite/10'
              }`}
            >
              Ch {ch.number}: {ch.title_en}
            </button>
          ))}
        </div>
      </div>

      {selectedChapter && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-brand-granite">
              Ch {selectedChapter.number}: {selectedChapter.title_en} — Lessons ({lessons.length})
            </h2>
            <button
              onClick={() => { setEditingLesson(null); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-brand-clay transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Lesson
            </button>
          </div>

          {showForm && (
            <LessonForm
              initial={editingLesson}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingLesson(null) }}
            />
          )}

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-brand-orange animate-spin" /></div>
          ) : lessons.length === 0 ? (
            <div className="bg-white rounded-xl border border-brand-grey p-8 text-center text-brand-clay text-sm">
              No lessons yet. Click "Add Lesson" to create one.
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, i) => (
                <div key={lesson.id} className="bg-white rounded-xl border border-brand-grey p-4 flex items-center gap-4 hover:shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-brand-granite text-sm truncate">{lesson.title_en}</h3>
                    <p className="text-xs text-brand-clay">
                      {lesson.type} &middot; {lesson.duration_seconds ? `${Math.floor(lesson.duration_seconds / 60)}min` : 'No duration'} &middot; {lesson.status}
                    </p>
                  </div>
                  {lesson.video_url && (
                    <a href={lesson.video_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline">Preview</a>
                  )}
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    lesson.status === 'published' ? 'bg-green-100 text-green-700' :
                    lesson.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {lesson.status}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingLesson(lesson); setShowForm(true) }}
                      className="p-1.5 text-brand-clay hover:text-brand-orange rounded-lg hover:bg-brand-grey">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(lesson.id)}
                      className="p-1.5 text-brand-clay hover:text-red-500 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function LessonForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    number: initial?.number || 1,
    title_en: initial?.title_en || '',
    title_ta: initial?.title_ta || '',
    type: initial?.type || 'video',
    duration_seconds: initial?.duration_seconds || 600,
    video_url: initial?.video_url || '',
    thumbnail_url: initial?.thumbnail_url || '',
    sort_order: initial?.sort_order || 1,
    status: initial?.status || 'draft',
    ...(initial?.id ? { id: initial.id } : {}),
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-purple-50 rounded-xl border border-purple-200 p-5 space-y-4">
      <h3 className="font-bold text-brand-granite">{initial ? 'Edit Lesson' : 'New Lesson'}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Title (English)*</label>
          <input required value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" placeholder="Introduction to Polynomials" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Title (Tamil)</label>
          <input value={form.title_ta} onChange={e => setForm({ ...form, title_ta: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Video URL*</label>
          <input required value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Thumbnail URL</label>
          <input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" placeholder="https://..." />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-brand-clay mb-1">Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm bg-white">
              <option value="video">Video</option>
              <option value="interactive">Interactive</option>
              <option value="reading">Reading</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-brand-clay mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm bg-white">
              <option value="draft">Draft</option>
              <option value="recording">Recording</option>
              <option value="editing">Editing</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-32">
            <label className="block text-xs font-medium text-brand-clay mb-1">Duration (sec)</label>
            <input type="number" value={form.duration_seconds} onChange={e => setForm({ ...form, duration_seconds: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" />
          </div>
          <div className="w-24">
            <label className="block text-xs font-medium text-brand-clay mb-1">Lesson #</label>
            <input type="number" value={form.number} onChange={e => setForm({ ...form, number: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" />
          </div>
          <div className="w-24">
            <label className="block text-xs font-medium text-brand-clay mb-1">Sort</label>
            <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-brand-clay hover:bg-brand-grey rounded-lg">Cancel</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-brand-clay disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}

// ═══════════════════════════════════════════════════════════
// QUESTIONS TAB
// ═══════════════════════════════════════════════════════════
function QuestionsTab({ selectedStandard, selectedSubject, showToast }) {
  const [chapters, setChapters] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedSubject) {
      admin.getChapters(selectedSubject.id).then(r => {
        setChapters(r.data || [])
        setSelectedChapter(null)
        setQuestions([])
      })
    }
  }, [selectedSubject])

  const loadQuestions = useCallback(async () => {
    if (!selectedChapter) return
    setLoading(true)
    const { data } = await admin.getQuestions(selectedChapter.id)
    setQuestions(data || [])
    setLoading(false)
  }, [selectedChapter])

  useEffect(() => { loadQuestions() }, [loadQuestions])

  const handleSave = async (formData) => {
    const { data, error } = await admin.upsertQuestion({
      ...formData,
      chapter_id: selectedChapter.id,
    })
    if (error) showToast(error.message, 'error')
    else {
      showToast(editingQuestion ? 'Question updated!' : 'Question created!')
      setShowForm(false)
      setEditingQuestion(null)
      loadQuestions()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return
    const { error } = await admin.deleteQuestion(id)
    if (error) showToast(error.message, 'error')
    else { showToast('Question deleted'); loadQuestions() }
  }

  if (!selectedSubject) {
    return (
      <div className="bg-white rounded-xl border border-brand-grey p-12 text-center">
        <HelpCircle className="w-12 h-12 text-brand-clay mx-auto mb-3" />
        <h3 className="font-bold text-brand-granite text-lg">Select a Subject</h3>
        <p className="text-sm text-brand-clay mt-1">Choose a standard and subject above, then pick a chapter</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-brand-grey p-4">
        <span className="text-sm font-medium text-brand-clay block mb-2">Chapter:</span>
        <div className="flex flex-wrap gap-2">
          {chapters.length === 0 && (
            <p className="text-sm text-brand-clay">No chapters found. Create chapters first.</p>
          )}
          {chapters.map(ch => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapter(selectedChapter?.id === ch.id ? null : ch)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedChapter?.id === ch.id
                  ? 'bg-brand-granite text-white'
                  : 'bg-brand-grey text-brand-granite hover:bg-brand-granite/10'
              }`}
            >
              Ch {ch.number}: {ch.title_en}
            </button>
          ))}
        </div>
      </div>

      {selectedChapter && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-brand-granite">
              Ch {selectedChapter.number}: {selectedChapter.title_en} — Questions ({questions.length})
            </h2>
            <button
              onClick={() => { setEditingQuestion(null); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-brand-clay transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>

          {showForm && (
            <QuestionForm
              initial={editingQuestion}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingQuestion(null) }}
            />
          )}

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-brand-orange animate-spin" /></div>
          ) : questions.length === 0 ? (
            <div className="bg-white rounded-xl border border-brand-grey p-8 text-center text-brand-clay text-sm">
              No questions yet. Click "Add Question" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={q.id} className="bg-white rounded-xl border border-brand-grey p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      Q{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-brand-granite font-medium">{q.question_en}</p>
                      {q.question_ta && <p className="text-xs text-brand-clay mt-0.5">{q.question_ta}</p>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(q.options_json || []).map((opt, oi) => (
                          <span key={oi} className={`px-2 py-0.5 rounded text-xs ${
                            oi === q.correct_answer ? 'bg-green-100 text-green-700 font-bold' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + oi)}) {typeof opt === 'object' ? opt.en || opt.text : opt}
                          </span>
                        ))}
                      </div>
                      {q.explanation_en && (
                        <p className="text-xs text-brand-clay mt-2 italic">💡 {q.explanation_en}</p>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                      q.difficulty === 1 ? 'bg-green-100 text-green-700' :
                      q.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {q.difficulty === 1 ? 'Easy' : q.difficulty === 2 ? 'Medium' : 'Hard'}
                    </span>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => { setEditingQuestion(q); setShowForm(true) }}
                        className="p-1.5 text-brand-clay hover:text-brand-orange rounded-lg hover:bg-brand-grey">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(q.id)}
                        className="p-1.5 text-brand-clay hover:text-red-500 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function QuestionForm({ initial, onSave, onCancel }) {
  const parseOptions = (opts) => {
    if (!opts || !Array.isArray(opts)) return ['', '', '', '']
    return opts.map(o => typeof o === 'object' ? (o.en || o.text || '') : String(o))
  }

  const [form, setForm] = useState({
    question_en: initial?.question_en || '',
    question_ta: initial?.question_ta || '',
    type: initial?.type || 'mcq',
    correct_answer: initial?.correct_answer ?? 0,
    explanation_en: initial?.explanation_en || '',
    explanation_ta: initial?.explanation_ta || '',
    difficulty: initial?.difficulty || 1,
    ...(initial?.id ? { id: initial.id } : {}),
  })
  const [options, setOptions] = useState(parseOptions(initial?.options_json))
  const [saving, setSaving] = useState(false)

  const updateOption = (idx, val) => {
    const newOpts = [...options]
    newOpts[idx] = val
    setOptions(newOpts)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...form,
      options_json: options.map(o => ({ en: o })),
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-pink-50 rounded-xl border border-pink-200 p-5 space-y-4">
      <h3 className="font-bold text-brand-granite">{initial ? 'Edit Question' : 'New Question'}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-brand-clay mb-1">Question (English)*</label>
          <textarea required value={form.question_en} onChange={e => setForm({ ...form, question_en: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" rows={2} placeholder="What is the degree of polynomial 3x^2 + 5x + 1?" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-brand-clay mb-1">Question (Tamil)</label>
          <textarea value={form.question_ta} onChange={e => setForm({ ...form, question_ta: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" rows={2} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-brand-clay mb-2">Options (A-D)*</label>
        <div className="grid md:grid-cols-2 gap-3">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, correct_answer: i })}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  form.correct_answer === i
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500 hover:bg-green-100'
                }`}
              >
                {String.fromCharCode(65 + i)}
              </button>
              <input
                required
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-brand-grey rounded-lg text-sm"
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-brand-clay mt-1">Click A/B/C/D to mark the correct answer (green = correct)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Explanation (English)</label>
          <textarea value={form.explanation_en} onChange={e => setForm({ ...form, explanation_en: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" rows={2} placeholder="The degree is 2 because..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Explanation (Tamil)</label>
          <textarea value={form.explanation_ta} onChange={e => setForm({ ...form, explanation_ta: e.target.value })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm" rows={2} />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-clay mb-1">Difficulty</label>
          <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-brand-grey rounded-lg text-sm bg-white">
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-brand-clay hover:bg-brand-grey rounded-lg">Cancel</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-brand-clay disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
