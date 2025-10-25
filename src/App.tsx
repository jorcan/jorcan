import { useEffect, useMemo, useState } from 'react';
import { BrainCircuit, FileVideo, Layers, ListTodo, PlayCircle, Sparkles, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { CourseForm } from './components/CourseForm.tsx';
import { ProjectHistory } from './components/ProjectHistory.tsx';
import { GenerationDashboard } from './components/GenerationDashboard.tsx';
import { LogConsole } from './components/LogConsole.tsx';
import { type CourseOutline, type CourseProject, type GenerationLog } from './types/course.ts';
import { api } from './lib/api.ts';
import { useSessionSettings } from './hooks/useSessionSettings.ts';

function App() {
  const [projects, setProjects] = useState<CourseProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionSettings, setSessionSettings] = useSessionSettings();

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  useEffect(() => {
    async function loadProjects() {
      try {
        const fetched = await api.listProjects();
        setProjects(fetched);
        if (fetched.length > 0) {
          const lastId = sessionSettings.lastProjectId ?? fetched[0].id;
          setSelectedProjectId(lastId);
          const project = fetched.find((item) => item.id === lastId);
          if (project?.outline) {
            setOutline(project.outline);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error('No se pudieron cargar los proyectos existentes');
      }
    }

    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      setSessionSettings((prev) => ({ ...prev, lastProjectId: selectedProjectId }));
    }
  }, [selectedProjectId, setSessionSettings]);

  const appendLog = (entry: Omit<GenerationLog, 'timestamp'>) => {
    setLogs((prev) => [
      {
        ...entry,
        timestamp: dayjs().toISOString()
      },
      ...prev
    ]);
  };

  const handleCreateProject = async (payload: Parameters<typeof api.createProject>[0]) => {
    setIsLoading(true);
    try {
      const project = await api.createProject(payload);
      setProjects((prev) => [project, ...prev]);
      setSelectedProjectId(project.id);
      setOutline(null);
      appendLog({ level: 'info', message: `Proyecto «${project.topic}» creado correctamente.` });
      toast.success('Proyecto creado');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo crear el proyecto');
      appendLog({ level: 'error', message: 'Error al crear el proyecto. Revisa los logs del servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOutline = async () => {
    if (!selectedProject) return;
    setIsLoading(true);
    appendLog({ level: 'info', message: 'Generando estructura del curso con Gemini 2.5 Pro…' });
    try {
      const updated = await api.generateOutline(selectedProject.id);
      setProjects((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setOutline(updated.outline ?? null);
      appendLog({ level: 'success', message: 'Estructura del curso lista.' });
    } catch (error) {
      console.error(error);
      toast.error('No se pudo generar la estructura del curso');
      appendLog({ level: 'error', message: 'Fallo la generación de la estructura. Se reintentará automáticamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideos = async (mode: 'topic' | 'all', topicIndex?: number) => {
    if (!selectedProject) return;
    setIsLoading(true);
    const targetMessage = mode === 'all' ? 'Generando todos los videos…' : `Generando videos para el tema #${(topicIndex ?? 0) + 1}…`;
    appendLog({ level: 'info', message: targetMessage });

    try {
      const updated = await api.generateVideos(selectedProject.id, { mode, topicIndex });
      setProjects((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      appendLog({ level: 'success', message: 'Videos generados correctamente.' });
    } catch (error) {
      console.error(error);
      toast.error('No se pudieron generar los videos');
      appendLog({ level: 'error', message: 'Ocurrió un error generando los videos. Consulta los registros del servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompileCourse = async () => {
    if (!selectedProject) return;
    setIsLoading(true);
    appendLog({ level: 'info', message: 'Combinando fragmentos en el video final…' });
    try {
      const updated = await api.compileCourse(selectedProject.id);
      setProjects((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      appendLog({ level: 'success', message: 'Video final disponible para descarga.' });
    } catch (error) {
      console.error(error);
      toast.error('No se pudo compilar el curso');
      appendLog({ level: 'error', message: 'El servidor no pudo compilar el curso. Revisa los registros.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 text-2xl font-bold">
              <Sparkles className="h-7 w-7 text-accent" />
              Generador de Cursos con IA
            </div>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Diseña y produce cursos completos en video utilizando Gemini 2.5 Pro y VEO 3.1. Controla cada etapa del flujo, aplica branding personalizado y descarga el resultado final en minutos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-1">
              <BrainCircuit className="h-4 w-4 text-primary" /> Gemini 2.5 Pro
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-1">
              <FileVideo className="h-4 w-4 text-secondary" /> VEO 3.1
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-1">
              <Layers className="h-4 w-4 text-accent" /> Branding
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <CourseForm
            isLoading={isLoading}
            sessionSettings={sessionSettings}
            onSessionSettingsChange={setSessionSettings}
            onCreate={handleCreateProject}
          />
          <ProjectHistory
            projects={projects}
            selectedId={selectedProjectId}
            onSelect={setSelectedProjectId}
          />
        </div>

        <div className="space-y-6">
          <GenerationDashboard
            project={selectedProject}
            outline={outline}
            onGenerateOutline={handleGenerateOutline}
            onGenerateVideos={handleGenerateVideos}
            onCompileCourse={handleCompileCourse}
            isLoading={isLoading}
          />
          <LogConsole logs={logs} />
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            Construido con <Wand2 className="inline h-4 w-4 text-accent" /> React, TypeScript y Vite. Generación de videos automatizada con branding personalizado.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Diseño interactivo y rápido
            </span>
            <span className="inline-flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              Monitoreo en tiempo real
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
