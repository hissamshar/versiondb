import React from 'react';

type TimetableGridProps = {
  schedule: any[];
};

export function TimetableGrid({ schedule }: TimetableGridProps) {
  // Convert 08:00:00 to purely 08:00 for mapping
  const parseTime = (t: string) => t.substring(0, 5);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30'
  ];

  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden">
      <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high">
        <h3 className="font-headline-md text-[20px] text-on-surface">Weekly Schedule</h3>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px] p-4">
          
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-2 mb-2 font-label-md text-on-surface-variant text-center border-b border-outline-variant/20 pb-2">
            <div className="text-left pl-2">Time</div>
            {days.map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Time Rows */}
          {times.filter((t, idx) => idx % 2 === 0).map((time) => (
            <div key={time} className="grid grid-cols-6 gap-2 mb-2 relative">
              <div className="font-label-sm text-on-surface-variant text-left pl-2 pt-2">{time}</div>
              
              {days.map((day) => {
                // Find class that starts at this hour or half-hour block.
                // For simplicity in this non-CSS grid display, we'll just check if a class starts in this hour block.
                const slotClass = schedule.find(c => c.day_of_week.startsWith(day) && parseTime(c.start_time).startsWith(time.substring(0,2)));
                
                if (slotClass) {
                  const isLab = slotClass.course_name.toLowerCase().includes('lab');
                  const bgAccent = isLab ? 'border-primary-container bg-primary-container/10' : 'border-tertiary-container bg-surface-container-high';
                  return (
                    <div key={`${day}-${time}`} className={`p-2 rounded border-l-2 ${bgAccent}`}>
                      <div className="font-label-md text-on-surface leading-tight">{slotClass.course_name}</div>
                      <div className="font-label-sm text-on-surface-variant mt-1">{slotClass.room_name || 'TBD'}</div>
                      <div className="font-label-sm text-outline mt-0.5">{parseTime(slotClass.start_time)} - {parseTime(slotClass.end_time)}</div>
                    </div>
                  );
                }
                
                return (
                  <div key={`${day}-${time}`} className="bg-surface-container-highest p-2 rounded border-l-2 border-primary border-dashed opacity-50 relative group">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest/80 backdrop-blur-sm rounded">
                      <span className="font-label-sm text-on-surface">Free Slot</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
