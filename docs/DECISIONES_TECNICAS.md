# 🎯 Decisiones Técnicas - AlunaInfinity

## Resumen de Decisiones Clave

| Aspecto | Decisión | Alternativas Consideradas | Justificación |
|---------|----------|--------------------------|---------------|
| **Frontend Framework** | React 18 + TypeScript | Vue, Svelte, Next.js | Ya implementado, gran ecosistema |
| **Backend Framework** | Node.js + Express | NestJS, FastAPI | Más ligero, mejor para MVP |
| **Base de Datos** | PostgreSQL | MongoDB, MySQL | Relacional, ACID, escalable |
| **ORM** | Prisma | TypeORM, Sequelize | Type-safe, migraciones, DX excelente |
| **Estado Global** | Zustand | Redux, Context API | Simple, menos boilerplate |
| **Server State** | React Query | SWR, Apollo | Caché automático, sincronización |
| **Validación** | Zod | Yup, Joi | Type-safe, composable |
| **Autenticación** | JWT | Sessions, OAuth | Stateless, escalable |
| **Pagos** | Wompi | PayU, Mercado Pago | Colombiano, sin cuota mensual |
| **Almacenamiento** | Cloudinary | AWS S3, Firebase | Tier gratuito generoso, transformaciones |
| **Emails** | Resend | SendGrid, Mailgun | Moderno, fácil, DX |
| **Hosting Frontend** | Vercel | Netlify, Railway | Gratis, CI/CD, excelente DX |
| **Hosting Backend** | Railway | Render, DigitalOcean | Fácil, PostgreSQL incluido |

---

## 🏗️ Arquitectura

### ¿Por qué Arquitectura Monolítica Modular?

**Decisión:** Iniciar con un monolito modular bien estructurado.

**Alternativas:**
- Microservicios desde el inicio
- Arquitectura serverless (AWS Lambda)

**Justificación:**
1. ✅ **Simplicidad inicial**: Más fácil de desarrollar y debuggear
2. ✅ **Menor complejidad operacional**: Un solo deploy
3. ✅ **Desarrollo más rápido**: No hay overhead de comunicación entre servicios
4. ✅ **Económico**: Un solo servidor
5. ✅ **Evolutivo**: Modular permite extraer microservicios después

**Cuándo migrar a microservicios:**
- Más de 100,000 usuarios activos
- Equipo de más de 10 desarrolladores
- Necesidad de escalar partes específicas independientemente

---

## 🗄️ Base de Datos

### ¿Por qué PostgreSQL?

**Decisión:** PostgreSQL como base de datos principal.

**Alternativas:**
- MongoDB (NoSQL)
- MySQL
- Firebase Firestore

**Justificación:**
1. ✅ **Relaciones complejas**: Productos, órdenes, usuarios están relacionados
2. ✅ **ACID**: Transacciones críticas (pagos, stock)
3. ✅ **JSON support**: Flexibilidad donde se necesita (atributos de variantes)
4. ✅ **Full-text search**: Búsqueda de productos
5. ✅ **Maduro y probado**: 30+ años de desarrollo
6. ✅ **Gratuito y open source**
7. ✅ **Hosting gratuito**: Supabase, Neon ofrecen tier gratuito

**Cuándo considerar MongoDB:**
- Si los productos tienen esquemas muy variables
- Si necesitas escala horizontal masiva (millones de documentos)

---

## 🔧 Backend

### ¿Por qué Node.js + Express?

**Decisión:** Node.js con Express y TypeScript.

**Alternativas:**
- **NestJS**: Framework más robusto y opinionado
- **FastAPI** (Python): Muy rápido, excelente tipado
- **Django** (Python): Framework completo

**Justificación:**
1. ✅ **Mismo lenguaje**: JavaScript/TypeScript en frontend y backend
2. ✅ **Flexibilidad**: No tan opinionado como NestJS
3. ✅ **Ecosistema enorme**: Paquetes para todo
4. ✅ **Performance**: Suficiente para nuestro caso de uso
5. ✅ **Equipo pequeño**: Menos curva de aprendizaje

**Consideraciones:**
- Si el equipo crece, migrar a NestJS sería beneficioso
- Para operaciones de CPU intensivo, considerar workers o servicios en Go/Rust

### ¿Por qué Prisma?

**Decisión:** Prisma como ORM.

**Alternativas:**
- TypeORM
- Sequelize
- Knex.js (query builder)

**Justificación:**
1. ✅ **Type-safety completo**: Autocomplete perfecto
2. ✅ **Migraciones automáticas**: Prisma Migrate
3. ✅ **Prisma Studio**: GUI para la base de datos
4. ✅ **Performance**: Query optimizado
5. ✅ **Developer Experience**: El mejor del mercado
6. ✅ **Documentación**: Excelente

---

## ⚛️ Frontend

### ¿Por qué Zustand sobre Redux?

**Decisión:** Zustand para estado global.

**Alternativas:**
- Redux Toolkit
- React Context API
- Jotai, Recoil

**Justificación:**
1. ✅ **Simplicidad**: 10x menos código que Redux
2. ✅ **No boilerplate**: Sin actions, reducers, dispatch
3. ✅ **Hooks nativos**: API moderna
4. ✅ **Pequeño**: 1KB minified
5. ✅ **DevTools**: Soporte para Redux DevTools
6. ✅ **Middleware**: persist, immer incluidos

**Ejemplo comparativo:**

```typescript
// Redux Toolkit (mucho código)
const slice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload)
    }
  }
})

// Zustand (simple y directo)
const useCart = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  }))
}))
```

### ¿Por qué React Query?

**Decisión:** TanStack Query (React Query) para server state.

**Alternativas:**
- SWR
- Apollo Client (para GraphQL)
- Fetch nativo

**Justificación:**
1. ✅ **Caché automático**: Menos requests al servidor
2. ✅ **Sincronización**: Refetch automático en foco
3. ✅ **Loading/Error states**: Manejados automáticamente
4. ✅ **Optimistic updates**: UX mejorada
5. ✅ **Paginación y infinite scroll**: Built-in
6. ✅ **DevTools**: Debugging visual

---

## 🔐 Autenticación

### ¿Por qué JWT?

**Decisión:** JSON Web Tokens para autenticación.

**Alternativas:**
- Sessions (cookies del lado del servidor)
- OAuth 2.0 / Auth0
- NextAuth

**Justificación:**
1. ✅ **Stateless**: No state en servidor
2. ✅ **Escalable**: No requiere sincronización entre servidores
3. ✅ **Mobile-friendly**: Fácil de usar en apps móviles
4. ✅ **Estándar**: Ampliamente adoptado
5. ✅ **CORS friendly**: Funciona bien con diferentes dominios

**Consideraciones de seguridad:**
- ✅ Tokens en memoria (no localStorage para token principal)
- ✅ Refresh tokens en httpOnly cookies
- ✅ Expiración corta (15min token, 7 días refresh)
- ✅ Rotación de tokens

---

## 💳 Pagos

### ¿Por qué Wompi?

**Decisión:** Wompi como pasarela de pagos principal.

**Alternativas:**
- PayU Latam
- Mercado Pago
- ePayco

**Justificación:**
1. ✅ **Sin cuota mensual**: Solo comisión por transacción (~3.5%)
2. ✅ **Colombiano**: Soporte local, pesos colombianos nativos
3. ✅ **Documentación**: Excelente documentación
4. ✅ **Múltiples métodos**: PSE, tarjetas, Nequi, Bancolombia
5. ✅ **Webhooks**: Confirmación automática
6. ✅ **Dashboard**: Panel de administración

**Tasas comparativas:**
- Wompi: ~3.5% + IVA
- PayU: ~3.49% + $900 COP + IVA
- Mercado Pago: ~3.99% + IVA

---

## 📁 Almacenamiento de Imágenes

### ¿Por qué Cloudinary?

**Decisión:** Cloudinary para almacenamiento y transformación de imágenes.

**Alternativas:**
- AWS S3 + CloudFront
- Firebase Storage
- Vercel Blob

**Justificación:**
1. ✅ **Tier gratuito generoso**: 25GB storage, 25GB bandwidth
2. ✅ **Transformaciones on-the-fly**: Resize, crop, optimize
3. ✅ **CDN incluido**: Entrega rápida global
4. ✅ **Formato automático**: WebP, AVIF automático
5. ✅ **Upload widget**: UI lista para usar
6. ✅ **SDKs excelentes**: Node, React

**Ejemplo de uso:**
```typescript
// URL original
https://res.cloudinary.com/demo/image/upload/sample.jpg

// Optimizado automáticamente
https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/sample.jpg

// Thumbnail 200x200
https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg
```

---

## 📧 Emails

### ¿Por qué Resend?

**Decisión:** Resend para emails transaccionales.

**Alternativas:**
- SendGrid
- Mailgun
- AWS SES

**Justificación:**
1. ✅ **Moderno y simple**: API excelente
2. ✅ **Tier gratuito**: 3,000 emails/mes
3. ✅ **React Email**: Crear templates en React
4. ✅ **Deliverability**: Excelentes tasas de entrega
5. ✅ **Analytics**: Dashboard con métricas
6. ✅ **Sin verificación compleja**: Setup rápido

**Alternativa económica:**
Si necesitas más de 3,000 emails/mes:
- **Brevo** (ex-Sendinblue): 300 emails/día gratis forever

---

## 🚀 Hosting y Deploy

### Frontend: ¿Por qué Vercel?

**Decisión:** Vercel para hosting del frontend.

**Alternativas:**
- Netlify
- GitHub Pages
- Railway

**Justificación:**
1. ✅ **Tier gratuito**: Generoso para proyectos pequeños
2. ✅ **CI/CD automático**: Push to deploy
3. ✅ **Edge network**: CDN global
4. ✅ **Analytics**: Web vitals incluido
5. ✅ **Dominios custom**: SSL automático
6. ✅ **Preview deployments**: Por cada PR

### Backend: ¿Por qué Railway?

**Decisión:** Railway para hosting del backend.

**Alternativas:**
- Render
- Fly.io
- DigitalOcean App Platform

**Justificación:**
1. ✅ **PostgreSQL incluido**: No necesitas servicio separado
2. ✅ **$5 crédito/mes**: Suficiente para desarrollo
3. ✅ **Deploy desde GitHub**: CI/CD automático
4. ✅ **Variables de entorno**: Manejo fácil
5. ✅ **Logs y métricas**: Built-in
6. ✅ **Escalado fácil**: Cuando lo necesites

**Costos estimados:**
- Desarrollo: $0-5/mes (crédito gratis)
- Producción pequeña: $15-25/mes
- Producción media: $50-100/mes

---

## 🔒 Seguridad

### Medidas Implementadas

1. **Autenticación**
   - ✅ Bcrypt con salt rounds 10
   - ✅ JWT con expiración
   - ✅ Refresh token rotation

2. **Validación**
   - ✅ Zod schemas en frontend y backend
   - ✅ Sanitización de inputs
   - ✅ Validación de tipos TypeScript

3. **Rate Limiting**
   - ✅ Express rate limit
   - ✅ 100 requests / 15 min

4. **Headers de Seguridad**
   ```typescript
   import helmet from 'helmet';
   app.use(helmet());
   ```

5. **CORS**
   ```typescript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

6. **SQL Injection**
   - ✅ Prisma usa prepared statements
   - ✅ Nunca concatenar queries

7. **XSS**
   - ✅ React escapa por defecto
   - ✅ CSP headers con Helmet

---

## 📊 Monitoreo y Analytics

### ¿Qué herramientas usar?

1. **Error Tracking**: Sentry
   - Gratis hasta 5,000 errores/mes
   - Source maps para debugging

2. **Analytics**: Plausible o Google Analytics
   - Plausible: Privacy-friendly
   - GA4: Gratis, completo

3. **Uptime Monitoring**: UptimeRobot
   - Gratis hasta 50 monitores
   - Alertas por email

4. **APM**: Railway Logs + custom logs
   - Winston o Pino para logs estructurados

---

## 🧪 Testing

### Estrategia de Testing

**MVP (Fase inicial):**
- Manual testing
- Tests críticos en backend (auth, payments)

**Post-MVP:**
1. **Unit Tests**: Jest + Testing Library
2. **Integration Tests**: Supertest (backend)
3. **E2E Tests**: Playwright (crítico: checkout flow)

**Decisión:** No testear todo desde el inicio para validar el mercado más rápido.

---

## 🌍 Internacionalización

### ¿Necesitamos i18n?

**Decisión inicial:** NO. Español únicamente.

**Justificación:**
- Mercado inicial: Colombia
- Acelerar desarrollo
- Agregar después si se expande

**Cuándo implementar:**
- Expansión a otros países
- Usar `react-i18next`

---

## 📱 Mobile

### ¿App nativa o web?

**Decisión:** Web responsive primero.

**Alternativas:**
- React Native
- Flutter
- PWA

**Justificación:**
1. ✅ Un solo codebase
2. ✅ Más rápido de desarrollar
3. ✅ No requiere app stores
4. ✅ Updates instantáneos

**Futuro:**
- PWA para experiencia app-like
- React Native si el negocio lo justifica

---

## 💰 Costo Total Estimado

### Fase MVP (Mes 1-3)
| Servicio | Costo |
|----------|-------|
| Frontend (Vercel) | $0 |
| Backend (Railway) | $0-10 |
| Database (Supabase) | $0 |
| Cloudinary | $0 |
| Resend | $0 |
| Dominio | ~$12/año |
| **TOTAL** | **$0-15/mes** |

### Producción (>100 usuarios/día)
| Servicio | Costo |
|----------|-------|
| Frontend (Vercel) | $0 |
| Backend (Railway) | $20-40 |
| Database (Supabase Pro) | $25 |
| Cloudinary | $0-89 |
| Resend | $0-20 |
| Sentry | $0 |
| **TOTAL** | **$45-175/mes** |

### Escala (>1000 usuarios/día)
| Servicio | Costo |
|----------|-------|
| Backend | $100-200 |
| Database | $100+ |
| CDN/Storage | $100+ |
| Emails | $50+ |
| **TOTAL** | **$350+/mes** |

---

## 🚦 Próximos Pasos

1. ✅ Documentación completa ← HECHO
2. ⏳ Setup del backend (Fase 1)
3. ⏳ Diseño de API
4. ⏳ Implementación de autenticación
5. ⏳ Integración con productos reales

---

## 📚 Referencias

- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Query Essentials](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [Wompi Documentation](https://docs.wompi.co/)
- [Cloudinary Transformation Reference](https://cloudinary.com/documentation/transformation_reference)

---

**Última actualización:** Noviembre 2024
**Versión:** 1.0

