'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/timetable', label: 'Timetable', icon: '📅' },
  { href: '/exams', label: 'Exams', icon: '📝' },
  { href: '/calendar', label: 'Calendar', icon: '🗓️' },
  { href: '/updates', label: 'Updates', icon: '📢' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="navbar-logo">⏱️</span>
          <span className="navbar-title">EasyTimetable</span>
        </Link>
        <div className="navbar-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-link ${pathname === item.href ? 'navbar-link-active' : ''}`}
              id={`nav-${item.label.toLowerCase()}`}
            >
              <span className="navbar-link-icon">{item.icon}</span>
              <span className="navbar-link-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
