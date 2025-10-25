import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Wand2, Workflow } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, type ChangeEvent } from 'react';
import { z } from 'zod';
import type { CreateProjectPayload } from '../lib/api.ts';
import type { SessionSettings } from '../types/course.ts';

const formSchema = z.object({
  topic: z.string().min(4, 'Describe el tema del curso').max(120, 'Tema demasiado largo'),
  mode: z.enum(['interactive', 'fast']).default('interactive'),
  apiKeySource: z.enum(['studio', 'manual']).default('studio'),
  manualApiKey: z.string().optional(),
  watermarkText: z.string().optional(),
  watermarkOpacity: z.coerce.number().min(0).max(1).optional(),
  logoBase64: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  onCreate: (payload: CreateProjectPayload) => Promise<void> | void;
  isLoading: boolean;
  sessionSettings: SessionSettings;
  onSessionSettingsChange: (updater: (settings: SessionSettings) => SessionSettings) => void;
}

export function CourseForm({ onCreate, isLoading, sessionSettings, onSessionSettingsChange }: CourseFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      mode: 'interactive',
      apiKeySource: sessionSettings.apiKeySource,
      manualApiKey: sessionSettings.manualApiKey ?? '',
      watermarkOpacity: 0.6
    }
  });

  const apiKeySource = watch('apiKeySource');

  useEffect(() => {
    setValue('apiKeySource', sessionSettings.apiKeySource);
    setValue('manualApiKey', sessionSettings.manualApiKey ?? '');
  }, [sessionSettings, setValue]);

  const onSubmit = async (values: FormValues) => {
    const payload: CreateProjectPayload = {
      topic: values.topic,
      mode: values.mode,
      apiKeySource: values.apiKeySource,
      manualApiKey: values.apiKeySource === 'manual' ? values.manualApiKey?.trim() || undefined : undefined,
      branding: {
        logoBase64: values.logoBase64,
        watermarkText: values.watermarkText?.trim() || undefined,
        watermarkOpacity: values.watermarkOpacity ?? 0.6
      }
    };

    onSessionSettingsChange((prev) => ({
      ...prev,
      apiKeySource: values.apiKeySource,
      manualApiKey: payload.manualApiKey
    }));

    await onCreate(payload);
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>, onChange: (value: string | undefined) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const base64 = loadEvent.target?.result;
      if (typeof base64 === 'string') {
        onChange(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/60">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Wand2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Nuevo curso</h2>
          <p className="text-sm text-slate-400">Define el tema, la modalidad y tu configuración de branding.</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="topic">
            Tema del curso
          </label>
          <Controller
            name="topic"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="topic"
                placeholder="Ej. Historia del Imperio Romano"
                className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            )}
          />
          {errors.topic && <p className="text-xs text-red-400">{errors.topic.message}</p>}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-200">Modo de generación</p>
          <Controller
            name="mode"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => field.onChange('interactive')}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    field.value === 'interactive'
                      ? 'border-primary bg-primary/10 text-slate-100'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold text-slate-100">Diseño interactivo</span>
                  <p className="mt-1 text-xs text-slate-400">Aprueba cada video y ajusta el guion manualmente.</p>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange('fast')}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    field.value === 'fast'
                      ? 'border-secondary bg-secondary/10 text-slate-100'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold text-slate-100">Diseño rápido</span>
                  <p className="mt-1 text-xs text-slate-400">Genera los 50 videos automáticamente en un clic.</p>
                </button>
              </div>
            )}
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-200">Fuente de la API Key</p>
          <Controller
            name="apiKeySource"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => field.onChange('studio')}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    field.value === 'studio'
                      ? 'border-accent bg-accent/10 text-slate-100'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold text-slate-100">AI Studio</span>
                  <p className="mt-1 text-xs text-slate-400">Selecciona una API Key previamente guardada.</p>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange('manual')}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    field.value === 'manual'
                      ? 'border-primary bg-primary/10 text-slate-100'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold text-slate-100">Entrada manual</span>
                  <p className="mt-1 text-xs text-slate-400">Pega tu API Key (se guardará en esta sesión).</p>
                </button>
              </div>
            )}
          />

          {apiKeySource === 'manual' && (
            <Controller
              name="manualApiKey"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  placeholder="Gemini API Key"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              )}
            />
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-200">Branding</p>
          <div className="grid gap-3">
            <Controller
              name="watermarkText"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Marca de agua (opcional)"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              )}
            />
            <Controller
              name="watermarkOpacity"
              control={control}
              render={({ field }) => (
                <label className="flex flex-col gap-2 text-xs text-slate-400">
                  Opacidad de marca de agua: <span className="text-slate-200">{(field.value ?? 0.6).toFixed(2)}</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={field.value ?? 0.6}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                </label>
              )}
            />
            <Controller
              name="logoBase64"
              control={control}
              render={({ field: { value, onChange } }) => (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-center text-xs text-slate-400 hover:border-slate-600">
                  <Upload className="h-5 w-5" />
                  {value ? (
                    <span className="text-slate-300">Logo cargado correctamente</span>
                  ) : (
                    <span>Sube tu logo en PNG (se colocará en la esquina inferior izquierda)</span>
                  )}
                  <input type="file" accept="image/png" className="hidden" onChange={(event) => handleLogoUpload(event, onChange)} />
                </label>
              )}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Workflow className="h-4 w-4" />
          Crear proyecto
        </button>
      </form>
    </section>
  );
}
