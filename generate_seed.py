import json
import re
import os

from datetime import datetime, timedelta

JSON_DIR = "/home/hisam/timetable/exam_scheduler_pro/api"
OUT_FILE = "seed.sql"

def parse_time(time_str):
    time_str = time_str.strip()
    if not time_str: return None
    parts = time_str.split(':')
    h = int(parts[0])
    m = int(parts[1])
    # 1 to 7 are definitely PM (13:00 to 19:00)
    if 1 <= h <= 7:
        h += 12
    return datetime(2026, 1, 1, h, m)

def escape(s):
    if s is None:
        return "NULL"
    if isinstance(s, str):
        s = s.replace("'", "''")
        return f"'{s}'"
    return str(s)

def run():
    print(f"Reading JSON files from {JSON_DIR}...")
    
    with open(f"{JSON_DIR}/faculty_data.json") as f:
        faculty_data = json.load(f)
        
    with open(f"{JSON_DIR}/metadata.json") as f:
        metadata = json.load(f)
        
    with open(f"{JSON_DIR}/academic_plan.json") as f:
        academic_plan = json.load(f)
        
    with open(f"{JSON_DIR}/schedules_index.json") as f:
        schedules_index = json.load(f)

    with open(OUT_FILE, "w", encoding="utf-8") as out:
        out.write("-- Supabase Seed File\n")
        out.write("BEGIN;\n\n")
        
        # 1. Truncate tables
        out.write("TRUNCATE TABLE public.exam_schedule, public.class_schedule, public.course_enrollment, public.courses, public.students, public.rooms, public.faculty, public.departments, public.academic_calendar CASCADE;\n\n")

        # 2. Departments
        out.write("INSERT INTO public.departments (department_id, department_code, department_name) VALUES \n")
        out.write("(1, 'CS', 'Computing'),\n")
        out.write("(2, 'EE', 'Electrical Engineering'),\n")
        out.write("(3, 'SH', 'Sciences and Humanities'),\n")
        out.write("(4, 'ME', 'Mechanical Engineering'),\n")
        out.write("(5, 'CE', 'Civil Engineering');\n\n")

        # 3. Faculty
        out.write("INSERT INTO public.faculty (faculty_id, name, designation, department_id, email, phone, photo_url) VALUES \n")
        faculty_lines = []
        faculty_name_to_id = {}
        for fac in faculty_data:
            fid = fac.get("id", "")
            if not fid: continue
            name = fac.get("name", "")
            # Remove "Dr. " prefix for matching later
            clean_name = re.sub(r'^Dr\.\s*', '', name).strip()
            faculty_name_to_id[clean_name] = fid
            faculty_name_to_id[name] = fid
            
            desig = fac.get("designation") or None
            email = fac.get("email") or None
            phone = fac.get("phone") or None
            photo = fac.get("photo_url") or None
            
            # Map dept
            dept = fac.get("department", "")
            dept_id = 1 # Default CS
            if "Electrical" in dept: dept_id = 2
            elif "Sciences" in dept: dept_id = 3
            elif "Mechanical" in dept: dept_id = 4
            elif "Civil" in dept: dept_id = 5
            
            val = f"({escape(fid)}, {escape(name)}, {escape(desig)}, {dept_id}, {escape(email)}, {escape(phone)}, {escape(photo)})"
            faculty_lines.append(val)
            
        out.write(",\n".join(faculty_lines) + ";\n\n")
        
        # 4. Rooms
        out.write("INSERT INTO public.rooms (room_id, room_code, room_name, room_type, capacity, building) VALUES \n")
        room_lines = []
        room_name_to_id = {}
        venues = metadata.get("venues", [])
        for i, room in enumerate(venues, start=1):
            room_name_to_id[room] = i
            r_type = 'Lab' if 'Lab' in room else ('Auditorium' if 'Hall' in room else 'Classroom')
            val = f"({i}, {escape(room[:20])}, {escape(room)}, {escape(r_type)}, 50, 'Main')"
            room_lines.append(val)
        out.write(",\n".join(room_lines) + ";\n\n")
        
        # 5. Academic Calendar
        out.write("INSERT INTO public.academic_calendar (event_id, week, description, event_date, event_day, event_type, semester) VALUES \n")
        cal_lines = []
        for i, ev in enumerate(academic_plan, start=1):
            week = str(ev.get("week", ""))
            desc = ev.get("description", "")
            
            # Parse date "Jan 9, 2026" or "Jan 13-17, 2026"
            date_str = ev.get("date", "")
            # Just take the first valid date part for SQL DATE format if possible, otherwise NULL and we handle manually.
            # Realistically, Supabase DATE needs YYYY-MM-DD. 
            # We will just insert them as best effort or NULL for now since it requires complex parsing.
            # To keep it simple, we'll try to parse the first date
            m = re.search(r'([A-Z][a-z]{2})\s+(\d+).*?(\d{4})', date_str)
            if m:
                months = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"}
                month = months.get(m.group(1), "01")
                day = m.group(2).zfill(2)
                year = m.group(3)
                db_date = f"'{year}-{month}-{day}'"
            else:
                db_date = "'2026-01-01'" # Fallback for NOT NULL constraint
            
            day_str = ev.get("day") or None
            if day_str and day_str not in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']:
                day_str = day_str[:3] if day_str[:3] in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] else "Mon"
                
            e_type = ev.get("type", "event")
            if e_type not in ["event", "deadline", "holiday", "exam"]:
                e_type = "event"
                
            val = f"({i}, {escape(week)}, {escape(desc)}, {db_date}, {escape(day_str)}, {escape(e_type)}, 'Spring 2026')"
            cal_lines.append(val)
        out.write(",\n".join(cal_lines) + ";\n\n")

        # Parse Schedules for Students, Courses, Enrollments, Classes, Exams
        courses_dict = {} # course_code -> {id, name}
        students_dict = {} # roll -> id
        course_enrollments = {} # (student_id, course_id) -> section
        
        # Deduplication sets
        class_schedules = {} # (course_id, section, day, start_time) -> {fac_id, room_id, end_time}
        exam_schedules = set() # (course_id, type, date, start, end, room_id, section)

        student_schedules = schedules_index.get("schedules", {})
        
        for roll, sched in student_schedules.items():
            # Add student
            student_id = len(students_dict) + 1
            students_dict[roll] = student_id
            
            # For each weekly class
            for w in sched.get("weekly_schedule", []):
                subj = w.get("subject", "")
                
                # Extract course code, section, name
                cm = re.match(r'([A-Z]{2,4}\d{3,4}),([A-Z0-9\-]+):\s*(.*)', subj)
                if cm:
                    c_code = cm.group(1)
                    c_sec = cm.group(2)
                    c_name = cm.group(3)
                else:
                    c_code = "UNKNOWN"
                    c_sec = "Unknown"
                    c_name = subj
                    # Try to extract code anyway
                    m2 = re.match(r'^([A-Z]{2,4}\d{3,4})\s*-\s*(.*)', subj)
                    if m2:
                        c_code = m2.group(1)
                        c_name = m2.group(2)
                
                if c_code not in courses_dict:
                    courses_dict[c_code] = {"id": len(courses_dict) + 1, "name": c_name}
                c_id = courses_dict[c_code]["id"]
                
                if (student_id, c_id) not in course_enrollments:
                    course_enrollments[(student_id, c_id)] = c_sec
                
                # Class schedule entry
                t_name = w.get("teacher", "").strip()
                f_id = faculty_name_to_id.get(t_name, faculty_name_to_id.get(t_name.replace("Dr. ", ""), None))
                
                r_name = w.get("room", "").strip()
                r_id = room_name_to_id.get(r_name, None)
                
                day = w.get("day", "Mon")
                st_str = w.get("start_time", "08:00")
                et_str = w.get("end_time", "09:30")
                
                dt_st = parse_time(st_str)
                if 'Lab' in c_name or 'LAB' in c_name or 'Lab' in subj:
                    dt_et = dt_st + timedelta(hours=3)
                else:
                    dt_et = parse_time(et_str)
                
                st = dt_st.strftime("%H:%M:%S")
                et = dt_et.strftime("%H:%M:%S")
                
                c_slot = (c_id, c_sec, day, st)
                if c_slot not in class_schedules:
                    class_schedules[c_slot] = {"fac_id": f_id, "room_id": r_id, "end_time": et}
                
            # For each exam
            for e in sched.get("exam_schedule", []):
                subj = e.get("subject", "")
                c_code = e.get("course_code", "")
                if not c_code:
                    m2 = re.match(r'^([A-Z]{2,4}\d{3,4})', subj)
                    if m2: c_code = m2.group(1)
                    else: c_code = "UNKNOWN"
                    
                # Find course ID
                if c_code not in courses_dict:
                    courses_dict[c_code] = {"id": len(courses_dict) + 1, "name": subj}
                c_id = courses_dict[c_code]["id"]
                
                if (student_id, c_id) not in course_enrollments:
                    course_enrollments[(student_id, c_id)] = c_sec
                
                e_type = "Final" if "Final" in schedules_index.get("exam_type", "") else "Midterm"
                e_date_str = e.get("date", "")
                
                # Parse date format: "Thu,14,May,26"
                dm = re.match(r'[A-Za-z]+,(\d+),([A-Za-z]+),(\d+)', e_date_str)
                db_date = "'2026-05-01'" # Default fallback
                if dm:
                    d = dm.group(1).zfill(2)
                    months = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"}
                    m = months.get(dm.group(2)[:3], "05")
                    y = "20" + dm.group(3)
                    db_date = f"'{y}-{m}-{d}'"
                
                # Get exam-specific times
                st_str = e.get("start_time", "09:00")
                et_str = e.get("end_time", "12:00")
                
                dt_st = parse_time(st_str)
                dt_et = parse_time(et_str)
                
                # Fix impossible time ranges
                if dt_et <= dt_st:
                    dt_et = dt_st + timedelta(hours=3)
                
                st = dt_st.strftime("%H:%M:%S")
                et = dt_et.strftime("%H:%M:%S")
                c_sec = e.get("section", "Unknown")
                r_id = None
                
                exam_schedules.add((c_id, e_type, db_date, st, et, r_id, c_sec))

        # 6. Courses
        out.write("INSERT INTO public.courses (course_id, course_code, course_name, credit_hours, course_type, department_id) VALUES \n")
        course_lines = []
        for code, info in courses_dict.items():
            cid = info["id"]
            name = info["name"]
            ctype = 'LAB' if 'Lab' in name or 'LAB' in name else 'THEORY'
            val = f"({cid}, {escape(code)}, {escape(name[:100])}, 3, '{ctype}', 1)"
            course_lines.append(val)
        out.write(",\n".join(course_lines) + ";\n\n")
        
        # 7. Students
        out.write("INSERT INTO public.students (student_id, roll_number, name, program, batch_year, section) VALUES \n")
        student_lines = []
        for roll, sid in students_dict.items():
            pm = re.match(r'^(\d+)([A-Z]+)', roll)
            batch = 2000 + int(pm.group(1)) if pm else 2024
            prog = pm.group(2) if pm else "Unknown"
            sec = "Unknown"
            val = f"({sid}, {escape(roll)}, 'Student {roll}', {escape(prog)}, {batch}, {escape(sec)})"
            student_lines.append(val)
        # Process in chunks of 500 to avoid giant single inserts
        chunk_size = 500
        for i in range(0, len(student_lines), chunk_size):
            chunk = student_lines[i:i+chunk_size]
            if i > 0:
                out.write("INSERT INTO public.students (student_id, roll_number, name, program, batch_year, section) VALUES \n")
            out.write(",\n".join(chunk) + ";\n")
        out.write("\n")

        # 8. Enrollments
        out.write("INSERT INTO public.course_enrollment (student_id, course_id, section, semester, status) VALUES \n")
        enroll_lines = []
        for (sid, cid), csec in course_enrollments.items():
            val = f"({sid}, {cid}, {escape(csec)}, 'Spring 2026', 'ENROLLED')"
            enroll_lines.append(val)
        for i in range(0, len(enroll_lines), chunk_size):
            chunk = enroll_lines[i:i+chunk_size]
            if i > 0:
                out.write("INSERT INTO public.course_enrollment (student_id, course_id, section, semester, status) VALUES \n")
            out.write(",\n".join(chunk) + ";\n")
        out.write("\n")
        
        # 9. Class Schedules
        out.write("INSERT INTO public.class_schedule (course_id, faculty_id, room_id, day_of_week, start_time, end_time, section, semester) VALUES \n")
        class_lines = []
        for slot, info in class_schedules.items():
            c_id, sec, day, st = slot
            fid_val = escape(info["fac_id"]) if info["fac_id"] else "NULL"
            rid_val = info["room_id"] if info["room_id"] else "NULL"
            et = info["end_time"]
            val = f"({c_id}, {fid_val}, {rid_val}, {escape(day)}, '{st}', '{et}', {escape(sec)}, 'Spring 2026')"
            class_lines.append(val)
        for i in range(0, len(class_lines), chunk_size):
            chunk = class_lines[i:i+chunk_size]
            if i > 0:
                out.write("INSERT INTO public.class_schedule (course_id, faculty_id, room_id, day_of_week, start_time, end_time, section, semester) VALUES \n")
            out.write(",\n".join(chunk) + ";\n")
        out.write("\n")
        
        # 10. Exam Schedules
        out.write("INSERT INTO public.exam_schedule (course_id, exam_type, exam_date, start_time, end_time, room_id, section, semester) VALUES \n")
        exam_lines = []
        for es in exam_schedules:
            cid, etype, date, st, et, rid, sec = es
            rid_val = rid if rid else "NULL"
            val = f"({cid}, {escape(etype)}, {date}, '{st}', '{et}', {rid_val}, {escape(sec)}, 'Spring 2026')"
            exam_lines.append(val)
        for i in range(0, len(exam_lines), chunk_size):
            chunk = exam_lines[i:i+chunk_size]
            if i > 0:
                out.write("INSERT INTO public.exam_schedule (course_id, exam_type, exam_date, start_time, end_time, room_id, section, semester) VALUES \n")
            out.write(",\n".join(chunk) + ";\n")
        out.write("\n")
        
        # Reset sequences
        resets = [
            ("public.departments", "department_id", "departments_department_id_seq"),
            ("public.rooms", "room_id", "rooms_room_id_seq"),
            ("public.courses", "course_id", "courses_course_id_seq"),
            ("public.students", "student_id", "students_student_id_seq"),
            ("public.course_enrollment", "enrollment_id", "course_enrollment_enrollment_id_seq"),
            ("public.class_schedule", "schedule_id", "class_schedule_schedule_id_seq"),
            ("public.exam_schedule", "exam_id", "exam_schedule_exam_id_seq"),
            ("public.academic_calendar", "event_id", "academic_calendar_event_id_seq")
        ]
        for table, col, seq in resets:
             out.write(f"SELECT setval('{seq}', (SELECT MAX({col}) FROM {table}));\n")
        
        out.write("COMMIT;\n")

if __name__ == '__main__':
    run()
