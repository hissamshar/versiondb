-- Create base tables

CREATE TABLE IF NOT EXISTS public.departments (
    department_id SERIAL PRIMARY KEY,
    department_code VARCHAR(50) NOT NULL,
    department_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.faculty (
    faculty_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    department_id INTEGER REFERENCES public.departments(department_id),
    email VARCHAR(255),
    phone VARCHAR(50),
    photo_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS public.rooms (
    room_id SERIAL PRIMARY KEY,
    room_code VARCHAR(50) NOT NULL,
    room_name VARCHAR(255) NOT NULL,
    room_type VARCHAR(50),
    capacity INTEGER,
    building VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS public.academic_calendar (
    event_id SERIAL PRIMARY KEY,
    week VARCHAR(50),
    description VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_day VARCHAR(50),
    event_type VARCHAR(50),
    semester VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS public.courses (
    course_id SERIAL PRIMARY KEY,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credit_hours INTEGER,
    course_type VARCHAR(50),
    department_id INTEGER REFERENCES public.departments(department_id)
);

CREATE TABLE IF NOT EXISTS public.students (
    student_id SERIAL PRIMARY KEY,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    program VARCHAR(100),
    batch_year INTEGER,
    section VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS public.course_enrollment (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES public.students(student_id),
    course_id INTEGER REFERENCES public.courses(course_id),
    section VARCHAR(50),
    semester VARCHAR(50),
    status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS public.class_schedule (
    schedule_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES public.courses(course_id),
    faculty_id VARCHAR(50) REFERENCES public.faculty(faculty_id),
    room_id INTEGER REFERENCES public.rooms(room_id),
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    section VARCHAR(50),
    semester VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS public.exam_schedule (
    exam_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES public.courses(course_id),
    exam_type VARCHAR(50),
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    room_id INTEGER REFERENCES public.rooms(room_id),
    section VARCHAR(50),
    semester VARCHAR(50)
);
