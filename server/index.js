import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDataDirectory, loadProjects, persistProjects, upsertProject } from './lib/storage.js';
import { buildOutline, generateVideosForProject, compileCourseVideo } from './lib/workflow.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/projects', async (_req, res) => {
  const projects = await loadProjects();
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const { topic, mode, apiKeySource, manualApiKey, branding } = req.body;

  if (!topic || typeof topic !== 'string') {
    return res.status(400).send('El tema es obligatorio');
  }

  if (!['interactive', 'fast'].includes(mode)) {
    return res.status(400).send('Modo inválido');
  }

  if (!['studio', 'manual'].includes(apiKeySource)) {
    return res.status(400).send('Fuente de API inválida');
  }

  const projects = await loadProjects();
  const project = await upsertProject(projects, {
    topic,
    mode,
    branding,
    apiKeySource,
    manualApiKey
  });

  res.status(201).json(project);
});

app.post('/api/projects/:id/outline', async (req, res) => {
  const { id } = req.params;
  const projects = await loadProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return res.status(404).send('Proyecto no encontrado');
  }

  const outline = buildOutline(project.topic);
  project.outline = outline;
  project.status = 'outlined';

  await persistProjects(projects);

  res.json(project);
});

app.post('/api/projects/:id/videos', async (req, res) => {
  const { id } = req.params;
  const { mode, topicIndex } = req.body ?? {};
  const projects = await loadProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return res.status(404).send('Proyecto no encontrado');
  }

  if (!project.outline) {
    return res.status(400).send('Genera la estructura antes de solicitar videos');
  }

  if (mode && !['all', 'topic'].includes(mode)) {
    return res.status(400).send('Modo de generación inválido');
  }

  if (mode === 'topic') {
    if (typeof topicIndex !== 'number' || topicIndex < 0 || topicIndex >= project.outline.topics.length) {
      return res.status(400).send('Índice de tema inválido');
    }
  }

  project.status = 'generating';

  generateVideosForProject(project, mode, topicIndex);

  await persistProjects(projects);

  res.json(project);
});

app.post('/api/projects/:id/compile', async (req, res) => {
  const { id } = req.params;
  const projects = await loadProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return res.status(404).send('Proyecto no encontrado');
  }

  if (!project.outline) {
    return res.status(400).send('Primero genera los videos');
  }

  compileCourseVideo(project);
  project.status = 'compiled';

  await persistProjects(projects);

  res.json(project);
});

ensureDataDirectory(path.join(__dirname, 'data'))
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor de generación escuchando en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('No fue posible iniciar el servidor', error);
    process.exit(1);
  });
