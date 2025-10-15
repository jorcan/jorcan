# Conversor PDF a Base64

Aplicación web sencilla que convierte archivos PDF a texto codificado en Base64 directamente en tu navegador. No es necesario instalar dependencias ni ejecutar un servidor: basta con abrir el archivo `index.html` en tu navegador favorito.

## Características

- Validación básica para asegurarse de que el archivo seleccionado es un PDF.
- Conversión realizada completamente en el navegador mediante la API `FileReader`.
- Botones para copiar el resultado al portapapeles o descargarlo como un archivo `.base64.txt`.
- Interfaz en español y diseño responsive.

## Uso

1. Abre `index.html` en tu navegador.
2. Pulsa el botón **Seleccionar archivo PDF** y elige el documento que quieras convertir.
3. Haz clic en **Convertir a Base64**.
4. Copia el resultado o descárgalo usando los botones disponibles.

> ⚠️ El tiempo de conversión dependerá del tamaño del PDF y de la potencia de tu dispositivo.

## Desarrollo

Si prefieres servir la aplicación desde un servidor local (por ejemplo, para evitar problemas de permisos en algunos navegadores), puedes usar Python:

```bash
python -m http.server 8000
```

Luego visita `http://localhost:8000` en tu navegador.
