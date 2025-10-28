import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import ProgressBar from './components/ProgressBar';
import LevelMap from './components/LevelMap';
import Challenge from './components/Challenge';
import { Star } from 'lucide-react';

const CHALLENGES = [
  {
    id: 'lvl1',
    title: 'Add Two Numbers',
    xp: 50,
    exportName: 'add',
    description: 'Write a function add(a, b) that returns the sum of a and b.',
    starterCode: `// Define a function named add that returns the sum of two numbers
function add(a, b) {
  // your code here
}
`,
    tests: [
      { name: 'adds small numbers', input: [2, 3], expect: 5 },
      { name: 'adds with zero', input: [0, 7], expect: 7 },
      { name: 'adds negatives', input: [-2, 5], expect: 3 },
    ],
  },
  {
    id: 'lvl2',
    title: 'Reverse a String',
    xp: 70,
    exportName: 'reverseString',
    description: 'Create reverseString(s) that returns the reversed string.',
    starterCode: `// Return a reversed version of the string s
function reverseString(s) {
  // your code here
}
`,
    tests: [
      { name: 'basic', input: ['code'], expect: 'edoc' },
      { name: 'with space', input: ['hi there'], expect: 'ereht ih' },
    ],
  },
  {
    id: 'lvl3',
    title: 'Is Even',
    xp: 80,
    exportName: 'isEven',
    description: 'Implement isEven(n) that returns true if n is an even integer, false otherwise.',
    starterCode: `// Return true if n is even, false otherwise
function isEven(n) {
  // your code here
}
`,
    tests: [
      { name: 'even', input: [8], expect: true },
      { name: 'odd', input: [3], expect: false },
      { name: 'zero', input: [0], expect: true },
    ],
  },
  {
    id: 'lvl4',
    title: 'FizzBuzz (1..n)',
    xp: 100,
    exportName: 'fizzBuzz',
    description:
      'Return an array from 1..n where multiples of 3 are "Fizz", multiples of 5 are "Buzz", and multiples of both are "FizzBuzz".',
    starterCode: `// Return an array of values from 1..n with Fizz/Buzz rules
function fizzBuzz(n) {
  // your code here
}
`,
    tests: [
      { name: 'n=5', input: [5], expect: [1, 2, 'Fizz', 4, 'Buzz'] },
      { name: 'n=15 last', input: [15], expect: [1,2,'Fizz',4,'Buzz','Fizz',7,8,'Fizz','Buzz',11,'Fizz',13,14,'FizzBuzz'] },
    ],
  },
];

export default function App() {
  const [selected, setSelected] = useState(CHALLENGES[0]);
  const [completedIds, setCompletedIds] = useState(() => {
    const raw = localStorage.getItem('codequest_completed');
    return raw ? JSON.parse(raw) : [];
  });
  const totalXP = useMemo(
    () => CHALLENGES.filter(c => completedIds.includes(c.id)).reduce((s, c) => s + c.xp, 0),
    [completedIds]
  );

  useEffect(() => {
    localStorage.setItem('codequest_completed', JSON.stringify(completedIds));
  }, [completedIds]);

  const unlockedCount = Math.max(1, completedIds.length + 1);

  const handleSelectLevel = (lvl) => setSelected(lvl);
  const handleComplete = (earnedXP) => {
    if (!completedIds.includes(selected.id)) {
      setCompletedIds((prev) => [...prev, selected.id]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Navbar xp={totalXP} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
                Learn to code by playing
              </h1>
              <p className="text-slate-600 mt-2 max-w-prose">
                Unlock levels, solve bite-sized challenges, and earn XP. Built for mobile first — tap a level to begin.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                <Star size={16} /> Beginner friendly
              </div>
            </div>
            <div className="w-full sm:w-80">
              <ProgressBar current={Math.min(unlockedCount - 1, CHALLENGES.length)} total={CHALLENGES.length} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">World Map</h2>
          <LevelMap levels={CHALLENGES} unlockedCount={unlockedCount} onSelect={handleSelectLevel} />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Current Challenge</h2>
          <Challenge key={selected.id} challenge={selected} onComplete={handleComplete} />
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-slate-500 text-sm">
        Built with love for learners. Your progress is saved on this device.
      </footer>
    </div>
  );
}
