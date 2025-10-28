import React from 'react';
import { Lock, Play } from 'lucide-react';

export default function LevelMap({ levels, unlockedCount, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {levels.map((lvl, idx) => {
        const unlocked = idx < unlockedCount;
        return (
          <button
            key={lvl.id}
            onClick={() => unlocked && onSelect(lvl)}
            className={`relative group rounded-xl p-4 text-left transition shadow-sm border ${
              unlocked
                ? 'bg-white hover:shadow-md border-slate-200'
                : 'bg-slate-50 border-slate-200/60 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg grid place-items-center text-white ${
                unlocked ? 'bg-gradient-to-br from-indigo-500 to-fuchsia-500' : 'bg-slate-300'
              }`}>
                <span className="font-bold">{idx + 1}</span>
              </div>
              {unlocked ? (
                <Play className="text-indigo-600" size={18} />
              ) : (
                <Lock className="text-slate-400" size={18} />
              )}
            </div>
            <p className="font-semibold text-slate-800 mb-1">{lvl.title}</p>
            <p className="text-xs text-slate-500">{lvl.xp} XP</p>
            {!unlocked && (
              <div className="absolute inset-0 rounded-xl ring-2 ring-slate-300/30 pointer-events-none" />
            )}
          </button>
        );
      })}
    </div>
  );
}
