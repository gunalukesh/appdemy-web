-- ══════════════════════════════════════════════════════════
-- SAMACHEER KALVI LMS — Database Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor)
-- ══════════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── ENUMS ────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'parent', 'admin', 'content_mgr', 'super_admin');
CREATE TYPE content_status AS ENUM ('draft', 'recording', 'editing', 'review', 'published');
CREATE TYPE doubt_status AS ENUM ('queued', 'active', 'resolved', 'expired');
CREATE TYPE subscription_plan AS ENUM ('free', 'monthly_99', 'yearly_799', 'single_subject_29');
CREATE TYPE lang_pref AS ENUM ('en', 'ta');

-- ── USERS & AUTH ─────────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE,
  name_en TEXT NOT NULL,
  name_ta TEXT,
  role user_role NOT NULL DEFAULT 'student',
  lang_pref lang_pref NOT NULL DEFAULT 'en',
  avatar_url TEXT,
  standard_id INTEGER, -- For students: which class (1-12)
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- ── CURRICULUM ───────────────────────────────────────────
CREATE TABLE standards (
  id SERIAL PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 12),
  name_en TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  standard_id INTEGER NOT NULL REFERENCES standards(id),
  name_en TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  code TEXT NOT NULL,
  icon TEXT, -- emoji or icon name
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(standard_id, code)
);

CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  number INTEGER NOT NULL,
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL,
  description_en TEXT,
  description_ta TEXT,
  is_free BOOLEAN NOT NULL DEFAULT false, -- Freemium gating
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(subject_id, number)
);

CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id),
  number INTEGER NOT NULL,
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'video' CHECK (type IN ('video', 'interactive', 'reading')),
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  video_url TEXT, -- Supabase Storage URL
  thumbnail_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── QUIZZES ──────────────────────────────────────────────
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id),
  question_en TEXT NOT NULL,
  question_ta TEXT,
  type TEXT NOT NULL DEFAULT 'mcq' CHECK (type IN ('mcq', 'fill', 'match')),
  options_json JSONB NOT NULL, -- ["opt1", "opt2", "opt3", "opt4"]
  correct_answer INTEGER NOT NULL, -- index into options
  explanation_en TEXT,
  explanation_ta TEXT,
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  chapter_id INTEGER NOT NULL REFERENCES chapters(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_spent_seconds INTEGER,
  answers_json JSONB, -- [{question_id, selected, correct}]
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── PROGRESS TRACKING ────────────────────────────────────
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  lesson_id INTEGER NOT NULL REFERENCES lessons(id),
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  last_position_seconds INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);

CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── CONCENTRATION TRACKING ───────────────────────────────
CREATE TABLE attention_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  lesson_id INTEGER REFERENCES lessons(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  avg_score INTEGER CHECK (avg_score BETWEEN 0 AND 100),
  min_score INTEGER,
  max_score INTEGER,
  alerts_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE attention_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES attention_sessions(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  face_detected BOOLEAN NOT NULL DEFAULT true,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── DOUBT CLEARING ───────────────────────────────────────
CREATE TABLE doubt_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  teacher_id UUID REFERENCES profiles(id),
  subject_id INTEGER REFERENCES subjects(id),
  chapter_id INTEGER REFERENCES chapters(id),
  question_text TEXT NOT NULL,
  status doubt_status NOT NULL DEFAULT 'queued',
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE doubt_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES doubt_sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'voice')),
  media_url TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── SUBSCRIPTIONS & PAYMENTS ─────────────────────────────
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  plan subscription_plan NOT NULL,
  subject_id INTEGER REFERENCES subjects(id), -- For single_subject_29 plan
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  amount_paise INTEGER NOT NULL, -- Store in paise (799*100 = 79900)
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── INDEXES ──────────────────────────────────────────────
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_standard ON profiles(standard_id);
CREATE INDEX idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX idx_questions_chapter ON questions(chapter_id);
CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX idx_attention_sessions_student ON attention_sessions(student_id);
CREATE INDEX idx_doubt_sessions_student ON doubt_sessions(student_id);
CREATE INDEX idx_doubt_sessions_teacher ON doubt_sessions(teacher_id);
CREATE INDEX idx_doubt_sessions_status ON doubt_sessions(status);
CREATE INDEX idx_subscriptions_student ON subscriptions(student_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ── ROW LEVEL SECURITY ───────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attention_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubt_messages ENABLE ROW LEVEL SECURITY;

-- Students can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Students can read/write their own progress
CREATE POLICY "Students own progress" ON lesson_progress FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students own quiz attempts" ON quiz_attempts FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students own attention" ON attention_sessions FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = student_id);

-- Doubt sessions: students see theirs, teachers see assigned
CREATE POLICY "Doubt access" ON doubt_sessions FOR SELECT USING (
  auth.uid() = student_id OR auth.uid() = teacher_id
);
CREATE POLICY "Doubt messages access" ON doubt_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM doubt_sessions ds WHERE ds.id = session_id AND (ds.student_id = auth.uid() OR ds.teacher_id = auth.uid()))
);

-- Public read access for curriculum (everyone can browse)
ALTER TABLE standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read standards" ON standards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read subjects" ON subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read chapters" ON chapters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read lessons" ON lessons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read questions" ON questions FOR SELECT TO authenticated USING (true);

-- ── SEED DATA: 10th Standard Curriculum ──────────────────
INSERT INTO standards (number, name_en, name_ta) VALUES
  (9, '9th Standard', '9ஆம் வகுப்பு'),
  (10, '10th Standard', '10ஆம் வகுப்பு'),
  (11, '11th Standard', '11ஆம் வகுப்பு'),
  (12, '12th Standard', '12ஆம் வகுப்பு');

INSERT INTO subjects (standard_id, name_en, name_ta, code, icon, sort_order) VALUES
  (2, 'Mathematics', 'கணிதம்', 'MATH_10', '📐', 1),
  (2, 'Science', 'அறிவியல்', 'SCI_10', '🔬', 2),
  (2, 'Tamil', 'தமிழ்', 'TAM_10', '📖', 3),
  (2, 'English', 'ஆங்கிலம்', 'ENG_10', '📝', 4),
  (2, 'Social Science', 'சமூக அறிவியல்', 'SOC_10', '🌍', 5);

-- 10th Maths Chapters
INSERT INTO chapters (subject_id, number, title_en, title_ta, is_free, sort_order) VALUES
  (1, 1, 'Relations and Functions', 'உறவுகளும் சார்புகளும்', true, 1),
  (1, 2, 'Numbers and Sequences', 'எண்களும் தொடர்வரிசைகளும்', true, 2),
  (1, 3, 'Algebra', 'இயற்கணிதம்', false, 3),
  (1, 4, 'Geometry', 'வடிவியல்', false, 4),
  (1, 5, 'Coordinate Geometry', 'ஆய வடிவியல்', false, 5),
  (1, 6, 'Trigonometry', 'முக்கோணவியல்', false, 6),
  (1, 7, 'Mensuration', 'அளவியல்', false, 7),
  (1, 8, 'Statistics and Probability', 'புள்ளியியலும் நிகழ்தகவும்', false, 8);

-- 10th Science Chapters
INSERT INTO chapters (subject_id, number, title_en, title_ta, is_free, sort_order) VALUES
  (2, 1, 'Laws of Motion', 'இயக்க விதிகள்', true, 1),
  (2, 2, 'Optics', 'ஒளியியல்', true, 2),
  (2, 3, 'Thermal Physics', 'வெப்ப இயற்பியல்', false, 3),
  (2, 4, 'Electricity', 'மின்சாரம்', false, 4),
  (2, 5, 'Acoustics', 'ஒலியியல்', false, 5),
  (2, 6, 'Nuclear Physics', 'அணுக்கரு இயற்பியல்', false, 6),
  (2, 7, 'Chemistry in Everyday Life', 'அன்றாட வாழ்வில் வேதியியல்', false, 7),
  (2, 8, 'Heredity and Evolution', 'மரபியல் மற்றும் பரிணாமவியல்', false, 8);

-- Sample questions for Chapter 1 (Maths)
INSERT INTO questions (chapter_id, question_en, question_ta, options_json, correct_answer, explanation_en, difficulty) VALUES
  (1, 'If f(x) = 2x + 3, find f(5)', 'f(x) = 2x + 3 எனில், f(5) காண்க', '["10", "13", "15", "8"]', 1, 'f(5) = 2(5) + 3 = 10 + 3 = 13', 1),
  (1, 'Which of the following is a function?', 'பின்வருவனவற்றுள் எது சார்பு?', '["One-to-many", "Many-to-one", "Many-to-many", "None"]', 1, 'A many-to-one relation is a function because each input has exactly one output.', 2),
  (1, 'The range of f(x) = x² is:', 'f(x) = x² இன் வீச்சு:', '["All real numbers", "Non-negative reals", "Positive reals", "Integers"]', 1, 'x² is always ≥ 0, so the range is [0, ∞)', 2),
  (1, 'If f = {(1,2), (3,4), (5,6)}, then f(3) = ?', 'f = {(1,2), (3,4), (5,6)} எனில், f(3) = ?', '["2", "4", "6", "3"]', 1, 'From the ordered pair (3,4), f(3) = 4', 1),
  (1, 'Domain of f(x) = 1/(x-2) is:', 'f(x) = 1/(x-2) இன் சார்பகம்:', '["R", "R - {2}", "R - {0}", "R - {-2}"]', 1, 'f(x) is undefined when x-2=0, i.e., x=2', 3);

-- ── STORAGE BUCKETS ──────────────────────────────────────
-- Run these in Supabase Dashboard → Storage → Create Bucket:
-- 1. "videos" (public) — lesson video files
-- 2. "thumbnails" (public) — video thumbnails
-- 3. "avatars" (public) — user profile photos
-- 4. "doubt-media" (authenticated) — doubt session images/voice

SELECT 'Schema created successfully! Run this in Supabase SQL Editor.' AS status;
