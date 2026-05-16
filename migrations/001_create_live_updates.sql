-- Migration: Create live_updates table
-- This table is required for the Live Updates feature

CREATE TABLE IF NOT EXISTS public.live_updates (
  update_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed some initial data
INSERT INTO public.live_updates (title, message, category) VALUES
  ('Welcome to Spring 2026', 'Classes begin January 19th. Check your timetable for room assignments.', 'academic'),
  ('Ramzan Schedule Update', 'During Ramzan, class timings will be adjusted. Stay tuned for the revised schedule.', 'schedule'),
  ('Sessional II Results', 'Second sessional examination results have been announced. Check your portal.', 'exam'),
  ('Final Exams Approaching', 'Final examinations start May 18th. Datesheet is available on the exams page.', 'exam'),
  ('Lab Exam Notice', 'Lab exams will be conducted before the final theory exams. Check your schedule.', 'exam');
