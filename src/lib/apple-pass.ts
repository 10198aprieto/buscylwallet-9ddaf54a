/** Convierte el .pkpass en base64 y dispara la descarga en el navegador. */
export function descargarApplePass(base64: string, nombre = "buscyl.pkpass") {
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);

  const blob = new Blob([bytes], { type: "application/vnd.apple.pkpass" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
