'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '../components/layout/PageHeader';
import { RollLookup } from '../components/RollLookup';
import { ExamCard } from '../components/ExamCard';
import { Card } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';

function ExamsContent() {
  const searchParams = useSearchParams();
  const roll = searchParams.get('roll');
  const [student, setStudent] = React.useState<any>(null);
  const [exams, setExams] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(!!roll);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!roll) return;
    setLoading(true);
    fetch(`/api/exams?roll=${encodeURIComponent(roll)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else {
          setStudent(data.student);
          setExams(data.exams || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch exam schedule');
        setLoading(false);
      });
  }, [roll]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingExams = exams.filter(e => new Date(e.exam_date) >= today);
  const pastExams = exams.filter(e => new Date(e.exam_date) < today);

  return (
    <>
      <div className="mb-10 max-w-md">
        <RollLookup targetPage="exams" />
      </div>

      {loading && (
        <div aria-busy="true" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {error && (
        <div role="alert" className="bg-error-container/10 border border-error/20 text-error p-4 rounded-lg font-body-md">
          {error}
        </div>
      )}

      {!roll && !loading && !error && (
        <Card className="text-center py-12 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4">assignment</span>
          <p className="text-on-surface-variant font-body-md text-lg">Enter your roll number above to view your exams.</p>
        </Card>
      )}

      {student && !loading && (
        <div className="animate-fade-in-up">
          <Card className="mb-8 flex flex-row items-center gap-6">
            <div className="hidden sm:flex h-16 w-16 bg-surface-variant rounded-full items-center justify-center text-primary">
               <span className="material-symbols-outlined text-[32px]">person</span>
            </div>
            <div>
              <h2 className="font-headline-md text-on-surface">{student.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 font-label-md text-on-surface-variant">
                <span><strong className="text-on-surface">Roll:</strong> {student.roll_number}</span>
                <span><strong className="text-on-surface">Total Exams:</strong> {exams.length}</span>
              </div>
            </div>
          </Card>

          {exams.length > 0 ? (
            <div className="space-y-12">
              {upcomingExams.length > 0 && (
                <div>
                  <h3 className="font-headline-md text-[20px] text-on-surface mb-4 border-b border-outline-variant/20 pb-2">Upcoming Exams</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingExams.map(exam => (
                      <ExamCard
                        key={exam.exam_id}
                        courseName={exam.course_name}
                        courseCode={exam.course_code}
                        date={exam.exam_date}
                        time={exam.start_time}
                        room={exam.room_code}
                        duration={`${(new Date(`1970-01-01T${exam.end_time}`).getTime() - new Date(`1970-01-01T${exam.start_time}`).getTime()) / 60000} min`}
                        type={exam.exam_type}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {pastExams.length > 0 && (
                <div>
                  <h3 className="font-headline-md text-[20px] text-outline mb-4 border-b border-outline-variant/20 pb-2">Past Exams</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                    {pastExams.map(exam => (
                      <ExamCard
                        key={exam.exam_id}
                        courseName={exam.course_name}
                        courseCode={exam.course_code}
                        date={exam.exam_date}
                        time={exam.start_time}
                        room={exam.room_code}
                        duration={`${(new Date(`1970-01-01T${exam.end_time}`).getTime() - new Date(`1970-01-01T${exam.start_time}`).getTime()) / 60000} min`}
                        type={exam.exam_type}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card className="text-center py-12">
              <p className="text-on-surface-variant font-body-md">No exams scheduled for this student.</p>
            </Card>
          )}
        </div>
      )}
    </>
  );
}

export default function ExamsPage() {
  return (
    <>
      <PageHeader 
        title="Exam Schedule" 
        subtitle="View your personalized datesheet and seating plan." 
      />
      <Suspense fallback={<div aria-busy="true"><SkeletonCard /></div>}>
        <ExamsContent />
      </Suspense>
    </>
  );
}
