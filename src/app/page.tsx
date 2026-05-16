import React from 'react';
import pool from '@/lib/db';
import { Card } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';

async function getUpdates() {
  try {
    const res = await pool.query('SELECT * FROM live_updates ORDER BY created_at DESC LIMIT 3');
    return res.rows;
  } catch {
    return [];
  }
}

export default async function Home() {
  const updates = await getUpdates();

  return (
    <>
      {/* Top Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
        {/* Current Class (Live) */}
        <Card className="lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-4 z-10">
            <div className="flex items-center gap-3">
              <Badge variant="live">LIVE NOW</Badge>
              <span className="font-label-md text-on-surface-variant">Until 11:30 AM</span>
            </div>
            <span className="font-label-md text-outline">CS301</span>
          </div>

          <div className="z-10">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface mb-2">Database Management Systems</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-on-surface-variant font-label-md">
                <span className="material-symbols-outlined mr-2 text-[18px]">location_on</span>
                Lecture Hall A
              </div>
              <div className="flex items-center text-on-surface-variant font-label-md">
                <span className="material-symbols-outlined mr-2 text-[18px]">person</span>
                Dr. E. Turing
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 z-10">
            <Button variant="primary">Join Virtual Lab</Button>
            <Button variant="ghost">View Materials</Button>
          </div>
        </Card>

        {/* AI Announcements Feed */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/20">
            <h3 className="font-headline-md text-[20px] text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary-container">auto_awesome</span>
              AI Briefing
            </h3>
            <span className="font-label-sm text-on-surface-variant">Real-time</span>
          </div>
          
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {updates.length === 0 ? (
              <div className="text-on-surface-variant text-center py-4 font-body-md">No recent updates</div>
            ) : updates.map(update => (
              <div key={update.update_id} className={`bg-surface-container-high/50 rounded-lg p-3 border-l-2 relative ${update.category === 'exam' ? 'border-tertiary' : update.category === 'academic' ? 'border-primary' : 'border-outline-variant'}`}>
                <p className="font-body-md text-on-surface mb-1">{update.title}</p>
                <p className="font-label-sm text-on-surface-variant">{update.category} • {new Date(update.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Links Section (replaces full timetable grid on home to keep it simple, since Timetable is a separate page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <Card hoverable className="flex flex-row items-center gap-4 cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">calendar_view_week</span>
          </div>
          <div>
            <h3 className="font-headline-md text-[18px] text-on-surface">View Full Timetable</h3>
            <p className="font-body-md text-on-surface-variant">Check your upcoming classes and venues</p>
          </div>
        </Card>
        <Card hoverable className="flex flex-row items-center gap-4 cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined">assignment</span>
          </div>
          <div>
            <h3 className="font-headline-md text-[18px] text-on-surface">Exam Datesheet</h3>
            <p className="font-body-md text-on-surface-variant">Prepare for your upcoming finals</p>
          </div>
        </Card>
      </div>
    </>
  );
}
