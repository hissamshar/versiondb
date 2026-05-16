'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '../components/layout/Container';
import { PageHeader } from '../components/layout/PageHeader';
import { RollLookup } from '../components/RollLookup';
import { TimetableGrid } from '../components/TimetableGrid';
import { Card } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';

function TimetableContent() {
  const searchParams = useSearchParams();
  const roll = searchParams.get('roll');
  const [student, setStudent] = React.useState<any>(null);
  const [schedule, setSchedule] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(!!roll);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!roll) return;
    setLoading(true);
    fetch(`/api/students?roll=${encodeURIComponent(roll)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setStudent(data.student);
          setSchedule(data.schedule || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch timetable');
        setLoading(false);
      });
  }, [roll]);

  return (
    <>
      <div className="mb-10 max-w-md">
        <RollLookup targetPage="timetable" />
      </div>

      {loading && (
        <div aria-busy="true">
          <SkeletonCard />
        </div>
      )}

      {error && (
        <div role="alert" className="bg-error/10 border border-error/20 text-error p-4 rounded-lg">
          {error}
        </div>
      )}

      {!roll && !loading && !error && (
        <Card className="text-center py-12">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-zinc-400 text-lg">Enter your roll number above to view your timetable.</p>
        </Card>
      )}

      {student && !loading && (
        <div className="animate-fade-in-up">
          <Card className="mb-8 flex items-center gap-6">
            <div className="hidden sm:flex h-16 w-16 bg-white/5 rounded-full items-center justify-center text-2xl">🎓</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{student.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-zinc-400">
                <span><strong className="text-zinc-300">Roll:</strong> {student.roll_number}</span>
                <span><strong className="text-zinc-300">Semester:</strong> {student.semester}</span>
                <span><strong className="text-zinc-300">Section:</strong> {student.section}</span>
                <span><strong className="text-zinc-300">Classes:</strong> {schedule.length} slots</span>
              </div>
            </div>
          </Card>

          {schedule.length > 0 ? (
            <TimetableGrid schedule={schedule} />
          ) : (
            <Card className="text-center py-12">
              <p className="text-zinc-400">No class schedule found for this student.</p>
            </Card>
          )}
        </div>
      )}
    </>
  );
}

export default function TimetablePage() {
  return (
    <Container className="py-16">
      <PageHeader 
        title="Class Timetable" 
        subtitle="Look up your weekly schedule, rooms, and faculty." 
      />
      <Suspense fallback={
        <div aria-busy="true"><SkeletonCard /></div>
      }>
        <TimetableContent />
      </Suspense>
    </Container>
  );
}
