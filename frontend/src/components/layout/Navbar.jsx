// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';

export const Navbar = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <nav className="w-full h-16 px-6 flex items-center justify-between border-b transition-colors duration-300
      bg-white text-slate-800 border-slate-200
      dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-500/20">
          W
        </div>
        <span className="font-bold text-xl tracking-tight">
          WhatsApp<span className="text-emerald-500">AI</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg border transition-all duration-200 hover:scale-105
            bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100
            dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.197 5.197l1.591 1.591M17.203 17.203l1.591 1.591M3 12h2.25m13.5 0H21M5.197 19.803l1.591-1.591M17.203 6.341l1.591-1.591M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>

        <hr className="w-px h-6 bg-slate-200 dark:bg-slate-800 border-none" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-semibold">Mauricio Campo</span>
            <span className="text-xs text-slate-400">Administrador</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm border border-emerald-500">
            MC
          </div>
        </div>
      </div>
    </nav>
  );
};