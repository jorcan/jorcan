import { Clock, History, PlayCircle, ShieldCheck } from 'lucide-react';
import type { CourseProject } from '../types/course.ts';
import dayjs from 'dayjs';

interface ProjectHistoryProps {
  projects: CourseProject[];
  selectedId: string | null;
  onSelect: (projectId: string) => void;
}

const statusCopy: Record<CourseProject['status'], string> = {
  draft: 'Borrador',
  outlined: 'Estructurado',
  generating: 'Generando',
  compiled: 'Completado'
};

export function ProjectHistory({ projects, selectedId, onSelect }: ProjectHistoryProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/60">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-secondary/10 p-2 text-secondary">
          <History className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Proyectos recientes</h2>
          <p className="text-sm text-slate-400">Accede a tus cursos y retoma el progreso donde lo dejaste.</p>
        </div>
      </div>

      <div className="space-y-3">
        {projects.length === 0 && <p className="text-sm text-slate-500">Todavía no has generado ningún curso.</p>}
        {projects.map((project) => {
          const isSelected = project.id === selectedId;
          const icon = project.status === 'compiled' ? <ShieldCheck className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />;

          return (
            <button
              key={project.id}
              onClick={() => onSelect(project.id)}
              className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                isSelected
                  ? 'border-secondary bg-secondary/10 text-slate-100'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-100">{project.topic}</span>
                <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                  {icon}
                  {statusCopy[project.status]}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Modo: {project.mode === 'fast' ? 'Diseño rápido' : 'Diseño interactivo'}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {dayjs(project.createdAt).format('DD MMM YYYY · HH:mm')}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
