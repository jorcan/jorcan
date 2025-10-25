import { useCallback, useState } from 'react';
import type { SessionSettings } from '../types/course.ts';

const STORAGE_KEY = 'genera-cursos-ia-session';

function loadSettings(): SessionSettings {
  try {
    if (typeof window === 'undefined') {
      return {
        apiKeySource: 'studio'
      };
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SessionSettings;
    }
  } catch (error) {
    console.warn('No se pudieron cargar los ajustes de sesión', error);
  }
  return {
    apiKeySource: 'studio'
  };
}

export function useSessionSettings(): [SessionSettings, (updater: (settings: SessionSettings) => SessionSettings) => void] {
  const [settings, setSettings] = useState<SessionSettings>(() => loadSettings());

  const updateSettings = useCallback((updater: (settings: SessionSettings) => SessionSettings) => {
    setSettings((prev) => {
      const next = updater(prev);
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch (error) {
        console.warn('No se pudieron guardar los ajustes de sesión', error);
      }
      return next;
    });
  }, []);

  return [settings, updateSettings];
}
