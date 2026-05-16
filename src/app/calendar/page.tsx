import React from 'react';
import pool from '@/lib/db';
import { Container } from '../components/layout/Container';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

async function getCalendarEvents() {
  try {
    const res = await pool.query('SELECT * FROM academic_calendar ORDER BY event_date ASC');
    return res.rows;
  } catch (err) {
    console.error('Failed to fetch calendar', err);
    return [];
  }
}

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  // Group by month
  const grouped: Record<string, any[]> = {};
  events.forEach(evt => {
    const date = new Date(evt.event_date);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(evt);
  });

  const getBadgeVariant = (type: string) => {
    if (type.toLowerCase().includes('exam')) return 'exam';
    if (type.toLowerCase().includes('holiday')) return 'holiday';
    if (type.toLowerCase().includes('class')) return 'lecture';
    return 'lecture';
  };

  return (
    <Container className="py-16">
      <PageHeader 
        title="Academic Calendar" 
        subtitle="Key dates, deadlines, and holidays for the semester." 
      />

      {events.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-zinc-400">No events found in the calendar.</p>
        </Card>
      ) : (
        <div className="space-y-12 animate-fade-in-up">
          {Object.keys(grouped).map(month => (
            <section key={month}>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">{month}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[month].map(evt => {
                  const date = new Date(evt.event_date);
                  return (
                    <Card key={evt.event_id} className="flex items-center gap-6 p-4 hover:-translate-y-0.5 transition-transform">
                      <div className="flex flex-col items-center justify-center min-w-[60px] bg-white/5 rounded-lg py-2">
                        <span className="text-sm font-bold text-zinc-400 uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl font-bold text-white leading-none">{date.getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">{evt.description}</h3>
                        <p className="text-sm text-zinc-400 font-mono mt-1">{evt.event_day} • Week {evt.week}</p>
                      </div>
                      <Badge variant={getBadgeVariant(evt.event_type)} className="capitalize hidden sm:flex shrink-0">
                        {evt.event_type}
                      </Badge>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}
