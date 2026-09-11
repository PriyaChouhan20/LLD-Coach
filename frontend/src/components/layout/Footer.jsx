import React from 'react';
import { ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-sky-500" />
          <span>LLD Coach — Engineering Assignment MVP</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Deterministic Rubrics
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            Pluggable AI Evaluator
          </span>
        </div>
      </div>
    </footer>
  );
};
