# Carta de Reservas — Hotel (boceto)

Boceto interactivo del sistema de reservas, hecho en React + Vite.

## Cómo publicarlo en GitHub Pages (paso a paso)

1. Crea un repositorio nuevo en GitHub (por ejemplo `hotel-reservas`).
2. Descomprime este zip y sube todo su contenido a ese repositorio
   (puedes arrastrar los archivos en la web de GitHub, o usar `git push`
   si prefieres la terminal).
3. En el repositorio, ve a **Settings → Pages**.
4. En "Build and deployment", selecciona **Source: GitHub Actions**.
5. Listo. Cada vez que subas cambios a la rama `main`, el workflow en
   `.github/workflows/deploy.yml` compila el proyecto automáticamente
   y lo publica. Puedes ver el progreso en la pestaña **Actions** del
   repositorio.
6. Cuando termine (ícono verde ✔), la URL pública aparecerá en
   **Settings → Pages**, normalmente:
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`

## Desarrollo local (opcional)

```
npm install
npm run dev
```

Esto es solo el boceto visual — todavía no está conectado a una base
de datos real (eso vendrá con Supabase en el siguiente paso).
