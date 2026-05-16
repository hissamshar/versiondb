'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/timetable', icon: 'calendar_view_week', label: 'Schedule' },
    { href: '/exams', icon: 'assignment', label: 'Exams' },
    { href: '/calendar', icon: 'event', label: 'Calendar' },
    { href: '/updates', icon: 'notifications', label: 'Updates' },
  ];

  return (
    <nav className="bg-surface-container text-primary font-label-md text-[12px] h-screen left-0 w-64 hidden md:flex flex-col border-r border-outline-variant/20 py-[32px] sticky top-0 z-40">
      <div className="px-[16px] mb-8">
        <h1 className="font-headline-md text-[24px] leading-[32px] font-black text-primary">EasyTimetable</h1>
        <p className="text-on-surface-variant font-label-md mt-1">Academic Portal</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 px-[16px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/timetable');
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`font-medium flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10 border-r-4 border-primary font-bold hover:bg-surface-variant translate-x-1' 
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined mr-3" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="px-[16px] mt-auto pt-4 space-y-4">
        <button className="w-full bg-primary-container text-on-primary-container font-label-md py-3 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
          <span className="material-symbols-outlined mr-2 text-[18px]">smart_toy</span>
          Ask Groq AI
        </button>
        <div className="flex items-center gap-3 px-2 pt-4 border-t border-outline-variant/20">
          <div className="w-8 h-8 rounded-full border border-outline-variant/30 bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-[12px]">
            AC
          </div>
          <div>
            <p className="font-label-md font-bold text-on-surface">Alex Chen</p>
            <p className="font-label-sm text-[10px] text-on-surface-variant">CS - Yr 3</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function TopAppBar() {
  return (
    <header className="bg-surface text-primary top-0 sticky border-b border-outline-variant/30 flex justify-between items-center w-full px-[16px] md:px-[32px] py-[8px] z-30">
      <div className="flex items-center md:hidden">
        <h1 className="font-headline-md text-[20px] font-bold text-primary">EasyTimetable</h1>
      </div>
      
      {/* AI Search Bar (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-xl mx-auto items-center">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline group-focus-within:text-tertiary-container transition-colors">search</span>
          </div>
          <input 
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full py-2 pl-10 pr-4 font-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-tertiary-container focus:ring-1 focus:ring-tertiary-container/50 transition-all shadow-[0_0_15px_rgba(128,131,255,0.05)] focus:shadow-[0_0_20px_rgba(128,131,255,0.15)]" 
            placeholder="Ask Groq: 'When is my next DB exam?'" 
            type="text" 
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <span className="bg-surface-variant text-on-surface-variant font-label-sm px-2 py-0.5 rounded border border-outline-variant/30">⌘K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <Link href="/updates" className="p-2 text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200 rounded-full relative">
          <span className="material-symbols-outlined">notifications_active</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface"></span>
        </Link>
        <button className="p-2 text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200 rounded-full md:hidden">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200 rounded-full hidden md:block">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/timetable', icon: 'calendar_view_week', label: 'Schedule' },
    { href: '/exams', icon: 'assignment', label: 'Exams' },
    { href: '/calendar', icon: 'event', label: 'Calendar' },
    { href: '/updates', icon: 'notifications', label: 'Updates' },
  ];

  return (
    <nav className="bg-surface-container-high/90 backdrop-blur-md text-primary font-label-sm md:hidden border-t border-outline-variant/30 shadow-lg fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname === '/' && item.href === '/timetable');
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center justify-center transition-transform ${
              isActive 
                ? 'bg-primary-container/20 text-primary rounded-xl px-4 py-1 scale-95' 
                : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
            <span className="mt-1 text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
