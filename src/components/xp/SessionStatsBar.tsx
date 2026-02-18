/* ─── SessionStatsBar — Live Sanctum Session Stats ─────────────
 * Shows messages sent, code generated, deploys, session duration.
 * Subtle secondary display below the XP ribbon.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Code2, Rocket, Clock } from 'lucide-react';

interface SessionStatsBarProps {
  messagesCount: number;
  codeGenerations: number;
  deploysCount: number;
  sessionStartTime: number | null;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export function SessionStatsBar({
  messagesCount,
  codeGenerations,
  deploysCount,
  sessionStartTime,
}: SessionStatsBarProps) {
  const [elapsed, setElapsed] = useState(0);

  // Tick every second
  useEffect(() => {
    if (!sessionStartTime) return;
    const update = () => setElapsed(Date.now() - sessionStartTime);
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [sessionStartTime]);

  const stats = [
    { icon: MessageSquare, label: 'Msgs', value: messagesCount, color: '#a855f7' },
    { icon: Code2,         label: 'Code', value: codeGenerations, color: '#22d3ee' },
    { icon: Rocket,        label: 'Deploy', value: deploysCount, color: '#00EC97' },
  ];

  return (
    <div className="flex items-center gap-3 px-3 py-1.5">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="flex items-center gap-1.5">
          <Icon className="w-3 h-3 flex-shrink-0" style={{ color }} />
          <span className="text-[10px] font-mono text-white/60">
            <span className="text-white/80 font-semibold">{value}</span>{' '}
            <span className="text-white/35">{label}</span>
          </span>
        </div>
      ))}

      {sessionStartTime !== null && elapsed > 0 && (
        <div className="flex items-center gap-1.5 ml-auto">
          <Clock className="w-3 h-3 text-white/30" />
          <span className="text-[10px] font-mono text-white/35">
            {formatDuration(elapsed)}
          </span>
        </div>
      )}
    </div>
  );
}
