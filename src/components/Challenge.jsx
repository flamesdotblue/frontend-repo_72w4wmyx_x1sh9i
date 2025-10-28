import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, Terminal } from 'lucide-react';

function runUserFunction(code, exportName) {
  try {
    const fnFactory = new Function(
      `${code}\n; return (typeof ${exportName} !== 'undefined') ? ${exportName} : null;`
    );
    return { fn: fnFactory(), error: null };
  } catch (e) {
    return { fn: null, error: String(e) };
  }
}

export default function Challenge({ challenge, onComplete }) {
  const [code, setCode] = useState(challenge.starterCode.trim());
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const hasPassed = result?.passed;
  const textareaRef = useRef(null);

  useEffect(() => {
    setCode(challenge.starterCode.trim());
    setResult(null);
  }, [challenge]);

  const tests = useMemo(() => challenge.tests, [challenge]);

  const runTests = async () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      const { fn, error } = runUserFunction(code, challenge.exportName);
      if (error) {
        setResult({ passed: false, details: [{ name: 'Compilation', passed: false, message: error }] });
        setRunning(false);
        return;
      }
      if (typeof fn !== 'function') {
        setResult({ passed: false, details: [{ name: 'Export', passed: false, message: `Function ${challenge.exportName} not found.` }] });
        setRunning(false);
        return;
      }
      const details = [];
      let allPass = true;
      for (const t of tests) {
        try {
          const out = fn(...t.input);
          const ok = deepEqual(out, t.expect);
          details.push({ name: t.name, passed: ok, message: ok ? 'OK' : `Expected ${stringify(t.expect)}, got ${stringify(out)}` });
          if (!ok) allPass = false;
        } catch (e) {
          allPass = false;
          details.push({ name: t.name, passed: false, message: String(e) });
        }
      }
      setResult({ passed: allPass, details });
      setRunning(false);
    }, 10);
  };

  const resetCode = () => {
    setCode(challenge.starterCode.trim());
    setResult(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  useEffect(() => {
    if (hasPassed) onComplete(challenge.xp);
  }, [hasPassed, onComplete, challenge]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-2">{challenge.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{challenge.description}</p>
          <div className="mt-3 text-xs text-slate-500">
            <span className="px-2 py-1 bg-slate-100 rounded">Export function: {challenge.exportName}(...)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2"><Terminal size={18} /> Tests</h4>
          <ul className="space-y-2">
            {tests.map((t) => (
              <li key={t.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{t.name}</span>
                <span className="font-mono text-slate-500">{t.input.map(stringify).join(', ')} → {stringify(t.expect)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b">
            <span className="text-xs font-medium text-slate-600">editor.js</span>
            <div className="flex items-center gap-2">
              <button onClick={resetCode} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border bg-white hover:bg-slate-50">
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={runTests} disabled={running} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
                <Play size={14} /> {running ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 font-mono text-sm p-3 outline-none resize-none bg-white"
          />
        </div>

        {result && (
          <div className={`p-4 rounded-xl border shadow-sm ${result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              {result.passed ? (
                <CheckCircle2 className="text-emerald-600" />
              ) : (
                <XCircle className="text-rose-600" />
              )}
              <p className="font-medium text-slate-800">{result.passed ? 'All tests passed!' : 'Some tests failed'}</p>
            </div>
            <ul className="space-y-1 text-sm">
              {result.details.map((d) => (
                <li key={d.name} className="flex items-center justify-between">
                  <span className="text-slate-600">{d.name}</span>
                  <span className={`font-mono ${d.passed ? 'text-emerald-700' : 'text-rose-700'}`}>{d.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function stringify(v) {
  try {
    if (typeof v === 'string') return JSON.stringify(v);
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function deepEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return a === b;
  }
}
