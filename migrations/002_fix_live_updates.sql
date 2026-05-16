DROP TABLE IF EXISTS public.live_updates;

CREATE TABLE public.live_updates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.live_updates (title, content, type) VALUES
  ('Welcome to Spring 2026', 'Classes begin January 19th. Check your timetable for room assignments.', 'academic'),
  ('Ramzan Schedule Update', 'During Ramzan, class timings will be adjusted. Stay tuned for the revised schedule.', 'schedule'),
  ('Sessional II Results', 'Second sessional examination results have been announced. Check your portal.', 'exam'),
  ('Final Exams Approaching', 'Final examinations start May 18th. Datesheet is available on the exams page.', 'exam'),
  ('Lab Exam Notice', 'Lab exams will be conducted before the final theory exams. Check your schedule.', 'exam');
