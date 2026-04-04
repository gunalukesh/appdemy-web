import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ── Auth helpers ─────────────────────────────────────────
export const auth = {
  // Send OTP to phone
  async sendOTP(phone) {
    const { data, error } = await supabase.auth.signInWithOtp({ phone })
    return { data, error }
  },

  // Verify OTP
  async verifyOTP(phone, token) {
    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
    return { data, error }
  },

  // Get current user
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get profile with role
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Sign out
  async signOut() {
    await supabase.auth.signOut()
  }
}

// ── Curriculum queries ───────────────────────────────────
export const curriculum = {
  async getStandards() {
    const { data } = await supabase.from('standards').select('*').eq('is_active', true).order('number')
    return data
  },

  async getSubjects(standardId) {
    const { data } = await supabase.from('subjects').select('*').eq('standard_id', standardId).order('sort_order')
    return data
  },

  async getChapters(subjectId) {
    const { data } = await supabase.from('chapters').select('*').eq('subject_id', subjectId).order('sort_order')
    return data
  },

  async getLessons(chapterId) {
    const { data } = await supabase.from('lessons').select('*').eq('chapter_id', chapterId).eq('status', 'published').order('sort_order')
    return data
  },

  async getQuestions(chapterId) {
    const { data } = await supabase.from('questions').select('*').eq('chapter_id', chapterId).order('difficulty')
    return data
  }
}

// ── Student progress ─────────────────────────────────────
export const progress = {
  async updateLessonProgress(studentId, lessonId, progressPercent, positionSeconds) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        student_id: studentId,
        lesson_id: lessonId,
        progress_percent: progressPercent,
        last_position_seconds: positionSeconds,
        completed: progressPercent >= 95,
        updated_at: new Date().toISOString()
      }, { onConflict: 'student_id,lesson_id' })
    return { data, error }
  },

  async getStudentProgress(studentId, subjectId) {
    const { data } = await supabase
      .from('lesson_progress')
      .select('*, lessons(*, chapters(*))')
      .eq('student_id', studentId)
    return data
  },

  async submitQuizAttempt(studentId, chapterId, score, totalQuestions, answers, timeSpent) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        student_id: studentId,
        chapter_id: chapterId,
        score,
        total_questions: totalQuestions,
        answers_json: answers,
        time_spent_seconds: timeSpent
      })
    return { data, error }
  },

  async getQuizHistory(studentId) {
    const { data } = await supabase
      .from('quiz_attempts')
      .select('*, chapters(title_en, title_ta, subjects(name_en, name_ta))')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false })
      .limit(20)
    return data
  },

  async updateStreak(studentId) {
    const today = new Date().toISOString().split('T')[0]
    const { data: existing } = await supabase
      .from('streaks')
      .select('*')
      .eq('student_id', studentId)
      .single()

    if (!existing) {
      await supabase.from('streaks').insert({ student_id: studentId, current_streak: 1, longest_streak: 1, last_active_date: today })
      return 1
    }

    const lastDate = new Date(existing.last_active_date)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24))

    let newStreak = existing.current_streak
    if (diffDays === 1) newStreak = existing.current_streak + 1
    else if (diffDays > 1) newStreak = 1
    // diffDays === 0 means already counted today

    const longest = Math.max(newStreak, existing.longest_streak)
    await supabase.from('streaks').update({ current_streak: newStreak, longest_streak: longest, last_active_date: today, updated_at: new Date().toISOString() }).eq('student_id', studentId)
    return newStreak
  }
}

// ── Doubts ───────────────────────────────────────────────
export const doubts = {
  async createDoubt(studentId, subjectId, chapterId, questionText) {
    const { data, error } = await supabase
      .from('doubt_sessions')
      .insert({ student_id: studentId, subject_id: subjectId, chapter_id: chapterId, question_text: questionText })
      .select()
      .single()
    return { data, error }
  },

  async getStudentDoubts(studentId) {
    const { data } = await supabase
      .from('doubt_sessions')
      .select('*, subjects(name_en, name_ta), chapters(title_en, title_ta), profiles!doubt_sessions_teacher_id_fkey(name_en)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
    return data
  },

  async getTeacherQueue(teacherId) {
    const { data } = await supabase
      .from('doubt_sessions')
      .select('*, subjects(name_en, name_ta), profiles!doubt_sessions_student_id_fkey(name_en, avatar_url)')
      .or(`status.eq.queued,and(teacher_id.eq.${teacherId},status.eq.active)`)
      .order('created_at')
    return data
  },

  async acceptDoubt(doubtId, teacherId) {
    const { data, error } = await supabase
      .from('doubt_sessions')
      .update({ teacher_id: teacherId, status: 'active' })
      .eq('id', doubtId)
    return { data, error }
  },

  async sendMessage(sessionId, senderId, content, type = 'text') {
    const { data, error } = await supabase
      .from('doubt_messages')
      .insert({ session_id: sessionId, sender_id: senderId, content, type })
    return { data, error }
  },

  async getMessages(sessionId) {
    const { data } = await supabase
      .from('doubt_messages')
      .select('*, profiles(name_en, avatar_url)')
      .eq('session_id', sessionId)
      .order('sent_at')
    return data
  },

  // Real-time subscription for new messages
  subscribeToMessages(sessionId, callback) {
    return supabase
      .channel(`doubt_${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'doubt_messages', filter: `session_id=eq.${sessionId}` }, callback)
      .subscribe()
  }
}

// ── Attention tracking ───────────────────────────────────
export const attention = {
  async startSession(studentId, lessonId) {
    const { data, error } = await supabase
      .from('attention_sessions')
      .insert({ student_id: studentId, lesson_id: lessonId })
      .select()
      .single()
    return { data, error }
  },

  async addSnapshot(sessionId, score, faceDetected) {
    await supabase.from('attention_snapshots').insert({ session_id: sessionId, score, face_detected: faceDetected })
  },

  async endSession(sessionId) {
    const { data: snapshots } = await supabase
      .from('attention_snapshots')
      .select('score')
      .eq('session_id', sessionId)

    if (snapshots?.length) {
      const scores = snapshots.map(s => s.score)
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      await supabase.from('attention_sessions').update({
        ended_at: new Date().toISOString(),
        avg_score: avg,
        min_score: Math.min(...scores),
        max_score: Math.max(...scores)
      }).eq('id', sessionId)
    }
  },

  async getWeeklyReport(studentId) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data } = await supabase
      .from('attention_sessions')
      .select('*')
      .eq('student_id', studentId)
      .gte('started_at', weekAgo)
      .order('started_at')
    return data
  }
}

// ── Subscriptions ────────────────────────────────────────
export const subscriptions = {
  async getActiveSubscription(studentId) {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('student_id', studentId)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .single()
    return data
  },

  async createSubscription(studentId, plan, razorpayPaymentId, amountPaise) {
    const expiresAt = new Date()
    if (plan === 'monthly_99') expiresAt.setMonth(expiresAt.getMonth() + 1)
    else if (plan === 'yearly_799') expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    else expiresAt.setMonth(expiresAt.getMonth() + 1) // single subject = 1 month

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        student_id: studentId,
        plan,
        razorpay_payment_id: razorpayPaymentId,
        amount_paise: amountPaise,
        expires_at: expiresAt.toISOString()
      })
    return { data, error }
  }
}

// ── Admin CRUD (for content managers / admins) ──────────
export const admin = {
  // Standards
  async getStandards() {
    const { data, error } = await supabase.from('standards').select('*').order('number')
    return { data, error }
  },
  async upsertStandard(standard) {
    const { data, error } = await supabase.from('standards').upsert(standard).select().single()
    return { data, error }
  },
  async deleteStandard(id) {
    const { error } = await supabase.from('standards').delete().eq('id', id)
    return { error }
  },

  // Subjects
  async getSubjects(standardId) {
    let q = supabase.from('subjects').select('*, standards(number, name_en)').order('sort_order')
    if (standardId) q = q.eq('standard_id', standardId)
    const { data, error } = await q
    return { data, error }
  },
  async upsertSubject(subject) {
    const { data, error } = await supabase.from('subjects').upsert(subject).select().single()
    return { data, error }
  },
  async deleteSubject(id) {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    return { error }
  },

  // Chapters
  async getChapters(subjectId) {
    let q = supabase.from('chapters').select('*, subjects(name_en, standards(number, name_en))').order('sort_order')
    if (subjectId) q = q.eq('subject_id', subjectId)
    const { data, error } = await q
    return { data, error }
  },
  async upsertChapter(chapter) {
    const { data, error } = await supabase.from('chapters').upsert(chapter).select().single()
    return { data, error }
  },
  async deleteChapter(id) {
    const { error } = await supabase.from('chapters').delete().eq('id', id)
    return { error }
  },

  // Lessons
  async getLessons(chapterId) {
    let q = supabase.from('lessons').select('*, chapters(title_en, subjects(name_en, standards(number)))').order('sort_order')
    if (chapterId) q = q.eq('chapter_id', chapterId)
    const { data, error } = await q
    return { data, error }
  },
  async upsertLesson(lesson) {
    const { data, error } = await supabase.from('lessons').upsert(lesson).select().single()
    return { data, error }
  },
  async deleteLesson(id) {
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    return { error }
  },

  // Questions
  async getQuestions(chapterId) {
    let q = supabase.from('questions').select('*, chapters(title_en, subjects(name_en))').order('difficulty')
    if (chapterId) q = q.eq('chapter_id', chapterId)
    const { data, error } = await q
    return { data, error }
  },
  async upsertQuestion(question) {
    const { data, error } = await supabase.from('questions').upsert(question).select().single()
    return { data, error }
  },
  async deleteQuestion(id) {
    const { error } = await supabase.from('questions').delete().eq('id', id)
    return { error }
  },

  // Dashboard stats
  async getContentStats() {
    const [standards, subjects, chapters, lessons, questions, profiles] = await Promise.all([
      supabase.from('standards').select('id', { count: 'exact', head: true }),
      supabase.from('subjects').select('id', { count: 'exact', head: true }),
      supabase.from('chapters').select('id', { count: 'exact', head: true }),
      supabase.from('lessons').select('id', { count: 'exact', head: true }),
      supabase.from('questions').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ])
    return {
      standards: standards.count || 0,
      subjects: subjects.count || 0,
      chapters: chapters.count || 0,
      lessons: lessons.count || 0,
      questions: questions.count || 0,
      users: profiles.count || 0,
    }
  }
}

// ── File uploads (for content managers) ──────────────────
export const storage = {
  async uploadVideo(file, chapterId, lessonNumber) {
    const ext = file.name.split('.').pop() || 'mp4'
    const path = `chapter_${chapterId}/lesson_${lessonNumber}_${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('videos').upload(path, file, { upsert: true })
    if (error) return { url: null, error }
    const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(path)
    return { url: publicUrl, error: null }
  },

  async uploadThumbnail(file, chapterId, lessonNumber) {
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `chapter_${chapterId}/thumb_${lessonNumber}_${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('thumbnails').upload(path, file, { upsert: true })
    if (error) return { url: null, error }
    const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(path)
    return { url: publicUrl, error: null }
  },

  async uploadLessonMaterial(file, chapterId, lessonNumber) {
    const ext = file.name.split('.').pop() || 'pdf'
    const path = `chapter_${chapterId}/material_${lessonNumber}_${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('materials').upload(path, file, { upsert: true })
    if (error) return { url: null, error }
    const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(path)
    return { url: publicUrl, error: null }
  },

  async uploadQuestionImage(file, chapterId, questionIndex) {
    const ext = file.name.split('.').pop() || 'png'
    const path = `chapter_${chapterId}/q_${questionIndex}_${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('materials').upload(path, file, { upsert: true })
    if (error) return { url: null, error }
    const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(path)
    return { url: publicUrl, error: null }
  }
}
