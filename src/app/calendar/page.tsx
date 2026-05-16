import React from 'react';
import pool from '@/lib/db';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

async function getCalendarEvents() {
  try {
    const res = await pool.query('SELECT * FROM academic_calendar ORDER BY event_date ASC');
    return res.rows;
  } catch (err) {
    return [];
  }
}

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  const grouped: Record<string, any[]> = {};
  events.forEach(evt => {
    const date = new Date(evt.event_date);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(evt);
  });

  const getBadgeVariant = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('exam')) return 'exam';
    if (t.includes('holiday')) return 'cancelled';
    if (t.includes('class') || t.includes('lecture')) return 'default';
    return 'event';
  };

  return (
    <>
      <PageHeader 
        title="Academic Calendar" 
        subtitle="Key dates, deadlines, and holidays for the semester." 
      />

      {events.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-on-surface-variant font-body-md">No events found in the calendar.</p>
        </Card>
      ) : (
        <div className="space-y-12 animate-fade-in-up">
          {Object.keys(grouped).map(month => (
            <section key={month}>
              <h2 className="font-headline-md text-[20px] text-on-surface mb-6 border-b border-outline-variant/20 pb-2">{month}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[month].map(evt => {
                  const date = new Date(evt.event_date);
                  return (
                    <Card key={evt.event_id} className="flex flex-row items-center gap-6 p-4 hover:-translate-y-0.5 transition-transform cursor-default">
                      <div className="flex flex-col items-center justify-center min-w-[60px] bg-surface-variant rounded-lg py-2">
                        <span className="font-label-sm text-outline uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
                        <span className="font-headline-md text-[24px] text-on-surface leading-none">{date.getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-headline-md text-[16px] text-on-surface">{evt.description}</h3>
                        <p className="font-label-md text-on-surface-variant mt-1">{evt.event_day} • Week {evt.week}</p>
                      </div>
                      <Badge variant={getBadgeVariant(evt.event_type)} className="hidden sm:flex shrink-0">
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
    </>
  );
}
