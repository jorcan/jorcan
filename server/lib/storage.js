import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const projectsFile = path.join(dataDir, 'projects.json');

export async function ensureDataDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
  try {
    await fs.access(projectsFile);
  } catch {
    await fs.writeFile(projectsFile, '[]', 'utf-8');
  }
}

export async function loadProjects() {
  try {
    const raw = await fs.readFile(projectsFile, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('No se pudieron cargar los proyectos', error);
    return [];
  }
}

export async function persistProjects(projects) {
  await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2), 'utf-8');
  return projects;
}

export async function upsertProject(projects, payload) {
  const now = new Date().toISOString();
  const project = {
    id: nanoid(),
    topic: payload.topic,
    mode: payload.mode,
    createdAt: now,
    status: 'draft',
    outline: null,
    branding: payload.branding ?? {},
    apiKeySource: payload.apiKeySource,
    manualApiKey: payload.manualApiKey ?? null,
    combinedVideoUrl: null
  };

  const updated = [project, ...projects];
  await persistProjects(updated);
  return project;
}
