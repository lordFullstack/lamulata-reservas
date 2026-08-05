import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" hace que los assets se referencien de forma relativa,
// para que funcione en GitHub Pages sin importar el nombre del repositorio.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
