import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

type ExamCardProps = {
  courseName: string;
  courseCode: string;
  date: string;
  time: string;
  room: string;
  duration: string;
  type: 'midterm' | 'final' | string;
};

export const ExamCard = ({ courseName, courseCode, date, time, room, duration, type }: ExamCardProps) => {
  const isMidterm = type.toLowerCase().includes('mid') || type.toLowerCase().includes('sessional');
  const borderColor = isMidterm ? 'border-l-purple-500' : 'border-l-error';
  const badgeVariant = isMidterm ? 'lecture' : 'exam';

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card 
      glow 
      className={`border-l-[3px] ${borderColor} hover:-translate-y-0.5 transition-transform duration-250`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 leading-tight">{courseName}</h3>
          <p className="text-zinc-400 font-mono text-sm">{courseCode}</p>
        </div>
        <Badge variant={badgeVariant} className="capitalize ml-2 shrink-0">{type}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mt-4">
        <div className="flex items-center text-zinc-300">
          <span className="mr-2 opacity-60">📅</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-zinc-300">
          <span className="mr-2 opacity-60">⏰</span>
          <span className="font-mono">{time}</span>
        </div>
        <div className="flex items-center text-zinc-300">
          <span className="mr-2 opacity-60">📍</span>
          <span>{room || 'TBA'}</span>
        </div>
        <div className="flex items-center text-zinc-300">
          <span className="mr-2 opacity-60">⏳</span>
          <span>{duration}</span>
        </div>
      </div>
    </Card>
  );
};
