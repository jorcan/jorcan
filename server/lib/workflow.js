import { nanoid } from 'nanoid';

const segmentTemplates = ['Introducción', 'Concepto clave', 'Ejemplo práctico', 'Actividad guiada', 'Cierre inspirador'];

export function buildOutline(topic) {
  const topics = Array.from({ length: 10 }).map((_, index) => {
    const topicTitle = `Tema ${index + 1}: ${generateTopicTitle(topic, index)}`;
    return {
      id: nanoid(),
      title: topicTitle,
      summary: createSummary(topic, index),
      objective: createObjective(topic, index),
      status: 'pending',
      fragments: segmentTemplates.map((label, fragmentIndex) => ({
        id: nanoid(),
        title: `${label} · ${topicTitle}`,
        duration: 10 + fragmentIndex * 2,
        status: 'pending'
      }))
    };
  });

  return {
    courseTitle: `Curso intensivo de ${topic}`,
    topics
  };
}

export function generateVideosForProject(project, mode = 'all', topicIndex) {
  if (!project.outline) return project;

  const targetTopics = mode === 'topic' && typeof topicIndex === 'number'
    ? project.outline.topics.filter((_, index) => index === topicIndex)
    : project.outline.topics;

  targetTopics.forEach((topic) => {
    topic.status = 'ready';
    topic.fragments = topic.fragments.map((fragment) => ({
      ...fragment,
      status: 'ready',
      downloadUrl: buildMockDownloadUrl(project.id, fragment.id)
    }));
  });

  project.status = 'generating';
  project.videoSummary = `Se generaron ${targetTopics.length * segmentTemplates.length} videos con narración en español y branding personalizado.`;

  const everyTopicReady = project.outline.topics.every((topic) => topic.status === 'ready');
  if (everyTopicReady) {
    project.status = 'outlined';
  }

  return project;
}

export function compileCourseVideo(project) {
  const allFragments = project.outline?.topics.flatMap((topic) => topic.fragments) ?? [];
  const completedFragments = allFragments.filter((fragment) => fragment.status === 'ready');

  project.combinedVideoUrl = `https://videos.local/${project.id}/curso-completo.mp4`;
  project.videoSummary = `Curso completo de ${project.topic} con ${completedFragments.length} clips unificados y cortinillas automáticas.`;
}

function generateTopicTitle(topic, index) {
  const patterns = [
    `Fundamentos esenciales de ${topic}`,
    `Contexto histórico y evolución de ${topic}`,
    `Componentes clave de ${topic}`,
    `Errores frecuentes sobre ${topic}`,
    `Aplicaciones reales de ${topic}`,
    `Tendencias actuales en ${topic}`,
    `Herramientas indispensables para ${topic}`,
    `Métricas para evaluar ${topic}`,
    `Casos de estudio destacados de ${topic}`,
    `Plan de acción para dominar ${topic}`
  ];

  return patterns[index % patterns.length];
}

function createSummary(topic, index) {
  return `Exploramos el módulo ${index + 1} del curso de ${topic}, abordando conceptos clave con ejemplos aplicados.`;
}

function createObjective(topic, index) {
  return `Al finalizar este tema, el estudiante podrá describir con claridad el aspecto ${index + 1} de ${topic} y aplicarlo en un contexto real.`;
}

function buildMockDownloadUrl(projectId, fragmentId) {
  return `https://storage.googleapis.com/genera-cursos/${projectId}/${fragmentId}.mp4`;
}
