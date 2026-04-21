# 🗓️ EasyTimetable

> A smart, real-time university timetable management system powered by Next.js, Supabase, and Groq AI.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/Groq-AI-orange)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 📌 Description

EasyTimetable is a full-stack university timetable system that allows students to look up their class schedules using their roll number, view exam timetables, check the academic calendar, and receive real-time updates about class changes, cancellations, and announcements — all processed intelligently by Groq AI and delivered instantly via Supabase Realtime.

Built as a group academic project with a clear separation of concerns: database design, backend AI processing, and frontend UI — each owned by a dedicated team member.

---

## ✨ Features

- **Roll number lookup** — students enter their roll number and instantly see their full schedule, section, semester, and enrolled courses
- **Timetable view per section** — color-coded weekly timetable grid showing subject, room, and teacher per time slot
- **Exam schedule view** — upcoming midterms and finals with date, time, room, and duration
- **Academic calendar** — monthly calendar view highlighting exam periods, holidays, and key academic events
- **Live updates banner** — persistent real-time banner showing the latest class change or announcement on every page
- **Live updates feed** — full feed of all AI-processed updates tagged by type (room change, cancellation, announcement)
- **Groq AI processing** — raw admin input is processed by Groq LLM to extract structured data (subject, room, day, time) before storing
- **Supabase Realtime** — frontend subscribes to database changes via WebSocket so updates appear instantly without page refresh

---

## 🎯 Benefits

- **Students** get instant, accurate schedule information without calling the admin office
- **Admins** can push updates in plain text — Groq AI structures it automatically
- **Zero refresh needed** — live updates appear on screen the moment they are published
- **Mobile friendly** — works on any device, no app download required
- **Scalable** — Supabase handles thousands of concurrent realtime connections
- **Fast** — Groq inference is among the fastest available, keeping update processing near-instant
- **Free to deploy** — Next.js on Vercel free tier + Supabase free tier covers most university-scale usage

---

## 🏗️ System Flow

```
Admin inputs update (plain text)
        ↓
Express / Supabase Edge Function
        ↓
Groq API (llama-3.3-70b) — extracts structured JSON
{ title, subject, day, time, room, type }
        ↓
Supabase PostgreSQL — inserts into live_updates table
        ↓
Supabase Realtime — broadcasts INSERT event via WebSocket
        ↓
Next.js frontend — receives event, prepends card to live feed
Student sees update instantly ✅
```

For student schedule lookup:

```
Student enters roll number
        ↓
Next.js queries Supabase
        ↓
JOIN: students + course_enrollment + class_schedule
        ↓
Returns: section, semester, subjects, rooms, timings
        ↓
Displayed as timetable grid
```

---

## 🗄️ Database

Built on **Supabase (PostgreSQL)**. The schema consists of five core tables:

### `students`
Stores student identity and enrollment information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `roll_number` | text | Unique roll number e.g. 2024-CS-047 |
| `name` | text | Full name |
| `program` | text | e.g. BS Computer Science |
| `batch` | int | Enrollment year |
| `section` | text | e.g. CS-A |
| `semester` | int | Current semester |

### `course_enrollment`
Links students to the courses they are enrolled in.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `student_id` | uuid | Foreign key → students |
| `course_code` | text | e.g. CS-301 |
| `course_name` | text | e.g. Data Structures |
| `credit_hours` | int | Credit hours |

### `class_schedule`
Defines when and where each section's classes take place.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `section` | text | e.g. CS-A |
| `course_code` | text | Foreign key → courses |
| `day` | text | e.g. Monday |
| `start_time` | time | e.g. 09:00 |
| `end_time` | time | e.g. 10:00 |
| `room` | text | Room or lab number |
| `teacher` | text | Teacher name |

### `exam_schedule`
Stores midterm and final exam details.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `section` | text | Section code |
| `course_name` | text | Subject name |
| `exam_date` | date | Date of exam |
| `start_time` | time | Start time |
| `duration_mins` | int | Duration in minutes |
| `room` | text | Exam hall or room |
| `type` | text | `midterm` or `final` |

### `live_updates`
Stores AI-processed real-time announcements. Realtime is enabled on this table.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Short update title |
| `summary` | text | Detailed description |
| `subject` | text | Affected subject (if any) |
| `day` | text | Affected day (if any) |
| `time` | text | Affected time (if any) |
| `room` | text | New or affected room |
| `type` | text | `change`, `announcement`, `alert` |
| `raw_input` | text | Original admin input |
| `created_at` | timestamptz | Timestamp of update |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 (App Router) | UI, routing, server components |
| Styling | Tailwind CSS | Utility-first responsive styling |
| Database | Supabase (PostgreSQL) | Data storage and querying |
| Realtime | Supabase Realtime | WebSocket live update subscriptions |
| AI Processing | Groq API (llama-3.3-70b) | Parsing plain text into structured updates |
| Backend | Supabase Edge Functions or Node.js/Express | Secure server-side Groq API calls |
| Deployment | Vercel | Frontend hosting with auto-deploy on push |
| Version Control | Git + GitHub | Collaborative development |
| Language | TypeScript | Type-safe frontend code |

---

## 📁 Project Structure

```
src/
├── lib/
│   └── supabase.ts              # Supabase client setup
├── app/
│   ├── page.tsx                 # Home — roll number lookup
│   ├── timetable/
│   │   └── page.tsx             # Timetable view per section
│   ├── exams/
│   │   └── page.tsx             # Exam schedule
│   ├── calendar/
│   │   └── page.tsx             # Academic calendar
│   ├── updates/
│   │   └── page.tsx             # Full live updates feed
│   └── components/
│       ├── RollLookup.tsx       # Roll number search + result
│       ├── LiveUpdatesBanner.tsx# Persistent top banner
│       ├── TimetableGrid.tsx    # Weekly schedule grid
│       └── ExamCard.tsx         # Individual exam card
```

---

## 📄 License

This project is developed for academic purposes as part of a university DBMS lab course.