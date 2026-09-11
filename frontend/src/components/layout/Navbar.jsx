import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, History, Code2, BookOpen, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-0.5 shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight text-white">
              <span>LLD</span>
              <span className="text-sky-400">Coach</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-sky-500/10 text-sky-400 rounded-full border border-sky-500/20">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-1 hidden sm:block">Object-Oriented Design Mastery</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/') && !location.pathname.startsWith('/history')
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Problems</span>
          </Link>

          <Link
            to="/history"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/history')
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Attempt History</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI + Deterministic Evaluator</span>
          </div>
          <Link
            to="/problems/parking-lot"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Quick Practice</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
