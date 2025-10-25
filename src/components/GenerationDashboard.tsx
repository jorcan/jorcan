import {
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  Film,
  FilmSlate,
  LayoutList,
  Loader2,
  PanelsTopLeft,
  Play,
  Sparkles,
  Video
} from 'lucide-react';
import type { CourseOutline, CourseProject } from '../types/course.ts';
import { Fragment } from 'react';

type GenerateVideosHandler = (mode: 'topic' | 'all', topicIndex?: number) => void;

interface GenerationDashboardProps {
  project: CourseProject | null;
  outline: CourseOutline | null;
  isLoading: boolean;
  onGenerateOutline: () => void;
  onGenerateVideos: GenerateVideosHandler;
  onCompileCourse: () => void;
}

const statusStyles: Record<CourseProject['status'], string> = {
  draft: 'bg-slate-900 text-slate-300 border border-slate-800',
  outlined: 'bg-primary/10 text-primary border border-primary/40',
  generating: 'bg-secondary/10 text-secondary border border-secondary/40',
  compiled: 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/40'
};

export function GenerationDashboard({
  project,
  outline,
  isLoading,
  onGenerateOutline,
  onGenerateVideos,
  onCompileCourse
}: GenerationDashboardProps) {
  if (!project) {
    return (
      <section className="flex min-h-[480px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center">
        <PanelsTopLeft className="h-10 w-10 text-slate-600" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-200">Comienza creando tu primer curso</h2>
          <p className="text-sm text-slate-400">
            Configura el tema, sube tu branding y elige la modalidad. Desde aquí podrás monitorear en tiempo real cada etapa del proceso.
          </p>
        </div>
      </section>
    );
  }

  const readyTopics = project.outline?.topics.filter((topic) => topic.status === 'ready').length ?? 0;
  const totalTopics = project.outline?.topics.length ?? 0;
  const allTopicsReady = totalTopics > 0 && readyTopics === totalTopics;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl shadow-slate-950/50">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3 text-lg font-semibold text-slate-100">
            <FilmSlate className="h-5 w-5 text-accent" /> {project.topic}
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Modo {project.mode === 'fast' ? 'Diseño rápido' : 'Diseño interactivo'}. Genera 50 clips cortos distribuidos en 10 temas y combínalos en un video final.
          </p>
        </div>
        <span className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium ${statusStyles[project.status]}`}>
          {project.status === 'compiled' ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
          {project.status === 'draft'
            ? 'Esperando estructura'
            : project.status === 'outlined'
              ? 'Listo para compilar'
              : project.status === 'generating'
                ? 'Generando videos'
                : 'Curso compilado'}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <button
          onClick={onGenerateOutline}
          disabled={isLoading}
          className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-left transition hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
            <LayoutList className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Estructura inteligente</h3>
            <p className="mt-1 text-xs text-slate-400">Genera automáticamente los 10 temas con guiones optimizados por Gemini.</p>
          </div>
        </button>

        <button
          onClick={() => onGenerateVideos('all')}
          disabled={isLoading || !outline}
          className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-left transition hover:border-secondary/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="mt-1 rounded-full bg-secondary/10 p-2 text-secondary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Generación masiva</h3>
            <p className="mt-1 text-xs text-slate-400">Producir los 50 videos en lote con branding y narración en español.</p>
          </div>
        </button>

        <button
          onClick={onCompileCourse}
          disabled={isLoading || !allTopicsReady}
          className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-left transition hover:border-emerald-500/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="mt-1 rounded-full bg-emerald-500/10 p-2 text-emerald-400">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Video final</h3>
            <p className="mt-1 text-xs text-slate-400">Crea la cortinilla, fusiona fragmentos por tema y descarga el curso completo.</p>
          </div>
        </button>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">Estructura del curso</h3>
          {outline && <span className="text-xs text-slate-400">{readyTopics}/{totalTopics} temas completados</span>}
        </div>

        {!outline && (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/30 p-6 text-center text-sm text-slate-400">
            Genera la estructura para visualizar los temas y fragmentos que producirá VEO.
          </div>
        )}

        {outline && (
          <div className="space-y-4">
            {outline.topics.map((topic, index) => {
              const generating = topic.status === 'generating';
              const readyFragments = topic.fragments.filter((fragment) => fragment.status === 'ready').length;
              const allFragmentsReady = readyFragments === topic.fragments.length;

              return (
                <div key={topic.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                        <span className="rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-400">Tema {index + 1}</span>
                        {topic.title}
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{topic.summary}</p>
                    </div>
                    <button
                      onClick={() => onGenerateVideos('topic', index)}
                      disabled={isLoading || generating}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-secondary/60 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />} Generar tema
                    </button>
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    {topic.fragments.map((fragment) => (
                      <Fragment key={fragment.id}>
                        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs">
                          <div>
                            <p className="font-medium text-slate-200">{fragment.title}</p>
                            <p className="text-[11px] text-slate-500">{fragment.duration.toFixed(0)} s · Narración en español</p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${
                              fragment.status === 'ready'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : fragment.status === 'generating'
                                  ? 'bg-secondary/10 text-secondary'
                                  : fragment.status === 'failed'
                                    ? 'bg-red-500/10 text-red-400'
                                    : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            {fragment.status === 'ready' && <CheckCircle2 className="h-3 w-3" />}
                            {fragment.status === 'generating' && <Loader2 className="h-3 w-3 animate-spin" />}
                            {fragment.status === 'failed' && <Clock3 className="h-3 w-3" />}
                            {fragment.status === 'pending' && <Video className="h-3 w-3" />}
                            {fragment.status === 'ready'
                              ? 'Listo'
                              : fragment.status === 'generating'
                                ? 'Generando'
                                : fragment.status === 'failed'
                                  ? 'Error'
                                  : 'Pendiente'}
                          </span>
                        </div>
                        {fragment.downloadUrl && (
                          <a
                            href={fragment.downloadUrl}
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary/80"
                          >
                            <Download className="h-3 w-3" /> Descargar
                          </a>
                        )}
                      </Fragment>
                    ))}
                  </div>
                  <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-400">
                    <p className="font-semibold text-slate-300">Objetivo de aprendizaje</p>
                    <p className="mt-1 leading-relaxed">{topic.objective}</p>
                    <p className="mt-2 text-slate-500">
                      Fragmentos listos: {readyFragments}/{topic.fragments.length}
                    </p>
                    {allFragmentsReady && <p className="mt-1 text-emerald-400">Tema listo para compilar.</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {project.combinedVideoUrl && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Curso completo listo para descargar.
          </div>
          <a
            href={project.combinedVideoUrl}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-100 hover:bg-emerald-500/30"
          >
            <ExternalLink className="h-4 w-4" /> Descargar curso
          </a>
        </div>
      )}
    </section>
  );
}
