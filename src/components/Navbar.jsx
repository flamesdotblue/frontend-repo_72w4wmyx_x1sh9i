import React from 'react';
import { Gamepad2, Trophy, User } from 'lucide-react';

export default function Navbar({ xp }) {
  return (
    <header className="w-full sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <Gamepad2 size={20} />
          </div>
          <span className="font-semibold text-slate-800 tracking-tight">CodeQuest</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-indigo-700 font-medium">
            <Trophy size={18} />
            <span>{xp} XP</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 grid place-items-center text-white">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
