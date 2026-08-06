# HOTELFLOW MVP - GUÍA DE INICIO RÁPIDO

## 📦 Instalación Inicial

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env.local

# 3. Iniciar servidor de desarrollo
npm run dev
```

## 🌐 Acceso

- **URL Local:** http://localhost:3000
- **Email:** admin@hotelflow.local
- **Contraseña:** admin123

## 📖 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor en hot-reload

# Producción
npm run build            # Construir para producción
npm run start            # Ejecutar build de producción

# Validación
npm run type-check       # Verificar tipos TypeScript
npm run lint             # Ejecutar ESLint
npm run format           # Formatear código con Prettier

# Limpieza
rm -rf .next            # Limpiar caché de Next.js
rm -rf node_modules     # Eliminar módulos
```

## 🗂️ Estructura de Archivos Importantes

```
src/
├── app/                    # Páginas y rutas
│   ├── (auth)/login       # Login
│   └── (dashboard)/       # Dashboard protegido
├── components/            # Componentes React
├── lib/
│   ├── db/               # Base de datos
│   ├── services/         # Lógica de negocio
│   └── hooks/            # Custom hooks
├── types/                # TypeScript types
└── services/             # Servicios de negocio
```

## 🔐 Credenciales Demo

```
Email: admin@hotelflow.local
Contraseña: admin123
```

## 🚀 Funcionalidades Principales

### Dashboard
- Vista de estadísticas en tiempo real
- Ocupación actual
- Ingresos del día
- Acciones rápidas

### Habitaciones
- Listado por piso
- Estados: Disponible, Reservada, Ocupada
- Vista general del inventario

### Calendario
- Vista mensual
- Disponibilidad por habitación
- Navegación entre meses
- Código de colores

### Reservas
- Crear nuevas reservas
- Validación de fechas
- Anticipo registrable
- Estado de reserva

### Pasadías
- Precio fijo: $75.000 COP
- Registro de personas
- Cálculo automático de total
- Tracking de almuerzos

### Informes
- Estadísticas por fecha
- Exportación a Excel
- Resumen de ingresos
- Ocupación

## 🔧 Configuración de Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-32-character-secret-key
DATABASE_TYPE=mock
```

## 📱 Características Técnicas

- ✅ TypeScript Strict Mode
- ✅ React 19 + Next.js 15
- ✅ Clean Architecture
- ✅ Patrón Repository
- ✅ TanStack Query
- ✅ React Hook Form
- ✅ Zod Validation
- ✅ Tailwind CSS
- ✅ JWT Authentication

## 🎯 Próximos Pasos

1. **Revisar Código Base**
   - Explorar estructura en `/src`
   - Entender patrón de repositorios
   - Revisar servicios

2. **Customización**
   - Cambiar credenciales en `AuthService.ts`
   - Ajustar precios en `enums.ts`
   - Modificar inventory según necesidad

3. **Integración con Supabase**
   - Crear proyecto en Supabase
   - Configurar variables de entorno
   - Implementar repositorios para Supabase

4. **Deployment**
   - Conectar a Vercel
   - Configurar variables de producción
   - Activar CI/CD

## 🐛 Troubleshooting

**Error: "PORT 3000 is already in use"**
```bash
npm run dev -- -p 3001
```

**Error: "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "Type errors"**
```bash
npm run type-check
```

## 📊 Base de Datos

Actualmente: **En Memoria (Mock)**
- Persiste durante ejecución
- Se reinicia al recargar servidor
- Perfecto para desarrollo

Próximas: **Supabase + PostgreSQL**

## 🎨 Personalización de UI

- **Colors:** `tailwind.config.ts`
- **Fuentes:** `src/app/globals.css`
- **Componentes:** `src/components/ui/`

## 📈 Monitoreo

- Estadísticas actualizadas cada 30 segundos
- Logs en consola del navegador
- Network tab para ver requests

## 🆘 Soporte

Si encuentras problemas:
1. Revisar logs en consola (F12)
2. Verificar variables de entorno
3. Revisar README.md principal
4. Contactar al equipo

---

**¡Listo para comenzar!**
