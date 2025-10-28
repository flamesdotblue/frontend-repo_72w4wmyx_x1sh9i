import React from 'react';

export default function ProgressBar({ current, total }) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-sm text-slate-500">Progress</p>
          <p className="text-slate-800 font-semibold">{current} / {total} Levels</p>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-medium">{pct}%</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
