# HotelFlow MVP - Sistema de Gestión Hotelera

PMV (Producto Mínimo Viable) de un sistema de gestión hotelera moderno, escalable y listo para producción.

## 🎯 Características

### ✅ Implementado en MVP
- 🔐 **Autenticación segura** con JWT
- 📊 **Dashboard** con estadísticas en tiempo real
- 🛏️ **Gestión de habitaciones** por piso y tipo
- 📅 **Calendario** de disponibilidad y reservas
- 📝 **Reservas** con validación de fechas
- ☀️ **Pasadías** a precio fijo ($75.000 COP)
- 📈 **Informes** con exportación a Excel
- 📱 **Responsive** y Mobile-friendly
- 🎨 **Interfaz moderna** con Tailwind CSS

### 🔮 Próximas Fases
- 🍽️ Restaurante
- 📦 Inventario
- 💳 Facturación y Contabilidad
- 🔧 Mantenimiento
- 💰 Pagos Online
- 👥 CRM
- 🔍 Auditoría

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# 1. Clonar o descargar el proyecto
cd hotelflow

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env.local
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Credenciales Demo
```
Email: admin@hotelflow.local
Contraseña: admin123
```

## 📋 Estructura del Proyecto

```
hotelflow/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── (dashboard)/       # Rutas protegidas
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Layout raíz
│   ├── components/            # Componentes React reutilizables
│   │   ├── layout/           # Header, Sidebar
│   │   ├── dashboard/        # Componentes del dashboard
│   │   ├── ui/               # Componentes de UI base
│   │   └── common/           # Componentes comunes
│   ├── lib/
│   │   ├── db/               # Base de datos en memoria
│   │   │   └── repositories/ # Patrón Repository
│   │   ├── utils/            # Utilidades
│   │   ├── hooks/            # React hooks personalizados
│   │   └── auth/             # Servicios de autenticación
│   ├── services/             # Lógica de negocio
│   ├── types/                # TypeScript types
│   └── middleware.ts         # Middleware de autenticación
├── public/                   # Archivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🏗️ Arquitectura

### Patrón Clean Architecture

```
User Interface (Next.js Pages/Components)
        ↓
API Routes (Controllers)
        ↓
Services (Business Logic)
        ↓
Repositories (Data Access)
        ↓
Database (In-Memory / Supabase)
```

### Stack Tecnológico

**Frontend**
- Next.js 15 (React 19)
- TypeScript 5
- Tailwind CSS 3
- React Hook Form
- TanStack Query
- Zod (validación)

**Backend**
- Next.js API Routes
- Arquitectura agnóstica de BD
- En-memory para desarrollo
- Preparado para Supabase/PostgreSQL

**Herramientas**
- JWT para autenticación
- XLSX para exportación
- date-fns para fechas
- Lucide React para iconos

## 📝 API Endpoints

### Autenticación
```
POST   /api/auth/login        - Login
POST   /api/auth/logout       - Logout
GET    /api/auth/me           - Usuario actual
```

### Habitaciones
```
GET    /api/rooms             - Listar habitaciones
GET    /api/rooms/[id]        - Detalle habitación
POST   /api/rooms             - Crear habitación
```

### Reservas
```
GET    /api/reservations      - Listar reservas
GET    /api/reservations/[id] - Detalle reserva
POST   /api/reservations      - Crear reserva
PATCH  /api/reservations/[id] - Actualizar estado
DELETE /api/reservations/[id] - Eliminar reserva
```

### Pasadías
```
GET    /api/day-passes        - Listar pasadías
GET    /api/day-passes/[id]   - Detalle pasadía
POST   /api/day-passes        - Crear pasadía
DELETE /api/day-passes/[id]   - Eliminar pasadía
```

### Reportes
```
GET    /api/reports/dashboard - Estadísticas dashboard
GET    /api/reports/export/reservations - Exportar reservas
GET    /api/reports/export/day-passes   - Exportar pasadías
```

## 🔒 Seguridad

- ✅ Autenticación con JWT
- ✅ HTTP-only cookies
- ✅ CORS configurado
- ✅ Validación de entrada con Zod
- ✅ TypeScript strict mode
- ✅ Middleware de protección de rutas

## 🎨 Inventario de Habitaciones

### Piso 1 (20 habitaciones)
- 9 Dobles
- 7 Triples
- 3 Quíntiples
- 1 Séxtuple

### Piso 2 (13 habitaciones)
- 3 Triples
- 8 Cuádruples
- 1 Séxtuple
- 1 Para 7 personas

### Piso 3 (13 habitaciones)
- 3 Triples
- 8 Cuádruples
- 1 Séxtuple
- 1 Para 7 personas

### Cabañas (2)
- Cabaña A: 16 personas
- Cabaña B: 9 personas

**Total: 48 unidades de alojamiento**

## 💾 Base de Datos

Actualmente usa **almacenamiento en memoria** que persiste durante la ejecución.

### Migración a Supabase (cuando esté listo)

1. Crear proyecto en Supabase
2. Configurar variables de entorno
3. Actualizar repositorios para usar Supabase SDK
4. Implementar RLS (Row Level Security)
5. Ejecutar migraciones

## 🚀 Deployment en Vercel

```bash
# 1. Push a GitHub
git push origin main

# 2. Conectar repositorio en Vercel
# 3. Configurar variables de entorno
# 4. Deploy automático
```

## 📊 Información de Pasadías

- **Precio por persona:** $75.000 COP
- **Incluye:** Almuerzo + Acceso a instalaciones
- **Registro de almuerzos:** Automático en dashboard

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formato
npm run format
```

## 📝 Notas de Desarrollo

### Datos Seeding
- Administrador automático: `admin@hotelflow.local` / `admin123`
- Habitaciones seeding automático al iniciar
- Datos en memoria se pierden al reiniciar

### Validaciones
- Nombres mínimo 3 caracteres
- Documentos mínimo 8 caracteres
- Teléfonos mínimo 10 dígitos
- No permite fechas de checkout antes de checkin
- No permite reservas que se superpongan

## 🐛 Troubleshooting

**Puerto 3000 ocupado:**
```bash
npm run dev -- -p 3001
```

**Limpiar cache de Next.js:**
```bash
rm -rf .next
npm run dev
```

**Reinstalar dependencias:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Recursos Útiles

- [Next.js 15 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [Zod Docs](https://zod.dev)

## 📄 Licencia

Privada - Solo para uso interno del hotel

## 🤝 Soporte

Para reportar bugs o sugerencias, contactar al equipo de desarrollo.

---

**Versión:** 0.1.0 (MVP)
**Última actualización:** Agosto 2026
