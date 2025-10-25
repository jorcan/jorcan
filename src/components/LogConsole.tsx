import { TerminalSquare } from 'lucide-react';
import type { GenerationLog } from '../types/course.ts';
import dayjs from 'dayjs';

interface LogConsoleProps {
  logs: GenerationLog[];
}

const levelStyles: Record<GenerationLog['level'], string> = {
  info: 'text-slate-300',
  error: 'text-red-400',
  success: 'text-emerald-400'
};

export function LogConsole({ logs }: LogConsoleProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl shadow-slate-950/40">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-slate-800 p-2 text-slate-300">
          <TerminalSquare className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Logs en tiempo real</h2>
          <p className="text-xs text-slate-500">Monitorea las solicitudes al backend y los eventos de VEO en ejecución.</p>
        </div>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto pr-2 text-xs leading-relaxed text-slate-400 scrollbar-thin">
        {logs.length === 0 && <p className="text-slate-500">Aún no hay eventos registrados.</p>}
        {logs.map((log) => (
          <div key={`${log.timestamp}-${log.message}`} className="flex items-start gap-3">
            <span className="text-[10px] text-slate-500">{dayjs(log.timestamp).format('HH:mm:ss')}</span>
            <p className={levelStyles[log.level]}>{log.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
