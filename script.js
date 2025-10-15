const inputArchivo = document.getElementById("archivo");
const btnConvertir = document.getElementById("btnConvertir");
const btnCopiar = document.getElementById("btnCopiar");
const btnDescargar = document.getElementById("btnDescargar");
const nombreArchivo = document.getElementById("nombreArchivo");
const mensajeEstado = document.getElementById("mensajeEstado");
const resultado = document.getElementById("resultado");

let archivoSeleccionado = null;
let ultimaCadenaBase64 = "";

inputArchivo.addEventListener("change", (evento) => {
  const archivo = evento.target.files?.[0];

  if (!archivo) {
    archivoSeleccionado = null;
    nombreArchivo.textContent = "Ningún archivo seleccionado.";
    btnConvertir.disabled = true;
    limpiarResultado();
    return;
  }

  if (archivo.type !== "application/pdf") {
    mostrarEstado("El archivo debe ser un PDF.", true);
    inputArchivo.value = "";
    archivoSeleccionado = null;
    btnConvertir.disabled = true;
    limpiarResultado();
    return;
  }

  archivoSeleccionado = archivo;
  nombreArchivo.textContent = `Archivo: ${archivo.name}`;
  btnConvertir.disabled = false;
  mostrarEstado("Archivo listo para convertir.");
});

btnConvertir.addEventListener("click", () => {
  if (!archivoSeleccionado) {
    mostrarEstado("Selecciona un archivo PDF primero.", true);
    return;
  }

  mostrarEstado("Procesando archivo...");
  btnConvertir.disabled = true;

  const lector = new FileReader();
  lector.onload = () => {
    const resultadoLectura = lector.result;
    if (typeof resultadoLectura === "string") {
      const base64 = resultadoLectura.split(",")[1] ?? "";
      ultimaCadenaBase64 = base64;
      resultado.value = base64;
      btnCopiar.disabled = base64.length === 0;
      btnDescargar.disabled = base64.length === 0;
      mostrarEstado("Conversión completada.");
    } else {
      mostrarEstado("No se pudo leer el archivo.", true);
    }
    btnConvertir.disabled = false;
  };

  lector.onerror = () => {
    mostrarEstado("Ocurrió un error al leer el archivo.", true);
    btnConvertir.disabled = false;
  };

  lector.readAsDataURL(archivoSeleccionado);
});

btnCopiar.addEventListener("click", async () => {
  if (!ultimaCadenaBase64) return;
  try {
    await navigator.clipboard.writeText(ultimaCadenaBase64);
    mostrarEstado("Cadena copiada al portapapeles.");
  } catch (error) {
    mostrarEstado("No se pudo copiar. Copia manualmente desde el cuadro de texto.", true);
  }
});

btnDescargar.addEventListener("click", () => {
  if (!ultimaCadenaBase64) return;

  const blob = new Blob([ultimaCadenaBase64], { type: "text/plain" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = `${archivoSeleccionado?.name ?? "archivo"}.base64.txt`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
  mostrarEstado("Archivo Base64 descargado.");
});

function mostrarEstado(mensaje, esError = false) {
  mensajeEstado.textContent = mensaje;
  mensajeEstado.style.color = esError ? "#d14343" : "#2563eb";
}

function limpiarResultado() {
  ultimaCadenaBase64 = "";
  resultado.value = "";
  btnCopiar.disabled = true;
  btnDescargar.disabled = true;
  mensajeEstado.textContent = "";
}
