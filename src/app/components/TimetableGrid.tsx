import React from 'react';

type TimetableGridProps = {
  schedule: any[];
};

export const TimetableGrid = ({ schedule }: TimetableGridProps) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startHour = 8;
  const endHour = 17;
  
  // Create an array of 30-min slots from startHour to endHour
  const timeSlots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00:00`);
    timeSlots.push(`${h.toString().padStart(2, '0')}:30:00`);
  }

  // Very simple hash function to assign colors based on course code
  const getCourseColor = (courseCode: string) => {
    const colors = [
      'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'bg-purple-500/20 border-purple-500/30 text-purple-300',
      'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      'bg-rose-500/20 border-rose-500/30 text-rose-300',
      'bg-amber-500/20 border-amber-500/30 text-amber-300',
      'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
    ];
    let hash = 0;
    for (let i = 0; i < courseCode.length; i++) {
      hash = courseCode.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getSlotForDayTime = (day: string, time: string) => {
    return schedule.find(s => 
      s.day_of_week.toLowerCase().startsWith(day.substring(0, 3).toLowerCase()) && 
      s.start_time === time
    );
  };

  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div className="w-full overflow-x-auto pb-4 rounded-xl border border-white/10 glass">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th scope="col" className="p-3 sticky left-0 z-20 bg-surface-2 border-r border-white/10 w-24">Time</th>
            {days.map(day => (
              <th scope="col" key={day} className="p-3 font-semibold text-white text-center w-[18%] border-r border-white/5 last:border-0">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {timeSlots.map(time => {
            const hasAnyClasses = days.some(day => getSlotForDayTime(day, time));
            
            return (
              <tr key={time} className="hover:bg-white/2 transition-colors">
                <th scope="row" className="p-3 sticky left-0 z-10 bg-surface-1 border-r border-white/10 font-mono text-xs text-zinc-400 whitespace-nowrap">
                  {formatTime(time)}
                </th>
                {days.map(day => {
                  const slot = getSlotForDayTime(day, time);
                  return (
                    <td key={`${day}-${time}`} className="p-2 border-r border-white/5 last:border-0 text-center relative h-16">
                      {slot && (
                        <div className={`absolute inset-1 p-2 rounded-lg border flex flex-col justify-center items-center text-xs overflow-hidden ${getCourseColor(slot.course_code)}`}>
                          <span className="font-bold truncate w-full">{slot.course_code}</span>
                          <span className="opacity-70 mt-0.5">{slot.room_code || 'TBA'}</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
