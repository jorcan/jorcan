<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎓 Generador de Cursos con IA

Una aplicación avanzada que **genera automáticamente cursos completos en video** sobre cualquier tema utilizando IA de Google (Gemini + VEO). Transforma ideas en contenido educativo profesional con branding personalizado.

[![Made with React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?logo=vite)](https://vitejs.dev/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini_&_VEO-4285f4?logo=google)](https://ai.google.dev/)

---

## ✨ Características

🎬 **Generación Automática de Videos con VEO 3.1**
- Genera videos en 720p (16:9) a partir de descripciones textuales
- Narración en español integrada
- Calidad profesional para contenido educativo

🧠 **Estructura Inteligente con Gemini 2.5 Pro**
- Diseño automático de cursos con 10 temas progresivos
- 5 fragmentos de ~10 segundos por tema (50 videos por curso)
- Guiones detallados optimizados para micro-aprendizaje

🎨 **Branding Personalizado**
- Logo personalizado (PNG) en esquina inferior izquierda
- Marca de agua transparente en el centro
- Aplicación automática a todos los videos

📂 **Gestión de Proyectos**
- Sistema multi-proyecto con persistencia local
- Historial de cursos generados
- Recuperación automática de sesiones

⚡ **Dos Modos de Generación**
- **Diseño Interactivo**: Control manual sobre cada video
- **Diseño Rápido**: Generación completa en 1-clic

🎞️ **Combinación de Videos**
- Cortinillas automáticas para cada tema
- Unificación de fragmentos por tema
- Video final completo del curso descargable

📊 **Monitoreo en Tiempo Real**
- Logs detallados de cada operación
- Estados de progreso visuales
- Manejo robusto de errores con reintentos automáticos

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** 18+
- **FFmpeg** (para conversión de videos a MP4)
- **API Key de Google AI** con acceso a:
  - Gemini 2.5 Pro
  - VEO 3.1 (requiere proyecto con facturación habilitada)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/jorcan/Genera_cursos_IA.git
   cd Genera_cursos_IA
   ```

2. **Instalar FFmpeg**

   **Linux/Ubuntu:**
   ```bash
   sudo apt update
   sudo apt install ffmpeg
   ```

   **macOS:**
   ```bash
   brew install ffmpeg
   ```

   **Windows:**
   Descarga desde [ffmpeg.org](https://ffmpeg.org/download.html) y añade al PATH

3. **Instalar dependencias del proyecto**
   ```bash
   npm install
   ```

4. **Instalar dependencias del servidor**
   ```bash
   cd server
   npm install
   cd ..
   ```

5. **Configurar API Key**

   Crear archivo `.env.local` en la raíz:
   ```env
   GEMINI_API_KEY=tu_api_key_aqui
   VITE_API_URL=http://localhost:3001
   ```

   Crear archivo `.env` en la carpeta `server`:
   ```env
   PORT=3001
   VIDEOS_DIR=./videos
   ```

   > 💡 **Obtener API Key**: [Google AI Studio](https://aistudio.google.com/app/apikey)
   > 
   > ⚠️ **Importante**: Para usar VEO necesitas un proyecto con [facturación habilitada](https://ai.google.dev/gemini-api/docs/billing)

6. **Ejecutar en desarrollo**

   En una terminal, iniciar el servidor:
   ```bash
   cd server
   npm run dev
   ```

   En otra terminal, iniciar el frontend:
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`
   El servidor API en `http://localhost:3001`

### Construcción para Producción

```bash
npm run build
npm run preview
```

---

## 📖 Uso

### 1️⃣ Configuración Inicial

- **Entorno AI Studio**: Selecciona tu API Key desde el selector
- **Entorno Local**: Ingresa manualmente tu API Key (se guarda en la sesión)

### 2️⃣ Crear un Nuevo Curso

1. Ingresa el tema del curso (ej: "La historia del Imperio Romano")
2. *(Opcional)* Sube un logo PNG
3. *(Opcional)* Configura una marca de agua
4. Selecciona el modo de generación:
   - **Diseño Interactivo**: Para revisar y generar videos manualmente
   - **Diseño Rápido**: Para generación automática completa

### 3️⃣ Flujo Interactivo

1. **Revisar Estructura**: Examina los 10 temas y sus guiones
2. **Generar Videos**: Crea videos individualmente o todos a la vez
3. **Combinar por Tema**: Unifica los 5 fragmentos de cada tema
4. **Video Final**: Genera el curso completo con cortinillas

### 4️⃣ Descargar

- Videos individuales por fragmento
- Videos por tema
- Video final del curso en MP4

---

## 🧩 Arquitectura

- **Frontend**: React + TypeScript + Vite con TailwindCSS y React Query
- **Backend**: Express + Node.js
- **Persistencia**: Archivos JSON locales y almacenamiento en LocalStorage para la sesión

La implementación incluida en este repositorio ofrece un **simulador offline** del flujo de trabajo con Gemini y VEO para que puedas integrar fácilmente tus credenciales y reemplazar la lógica de generación por llamadas reales a las APIs de Google.
