# 🏗️ Arquitectura del Sistema - AlunaInfinity

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Navegador  │  │   Móvil Web  │  │    Tablet    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   CDN / FRONTEND                             │
│                    (Vercel/Netlify)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React App + TypeScript                             │   │
│  │  - Páginas (Tienda, Admin, Perfil)                  │   │
│  │  - Componentes (shadcn/ui)                          │   │
│  │  - Estado (Zustand)                                 │   │
│  │  - Cache (React Query)                              │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API / HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   BACKEND API                                │
│                 (Railway/Render)                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Node.js + Express + TypeScript                     │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐                │   │
│  │  │ Controllers  │  │  Middleware  │                │   │
│  │  │  - Auth      │  │  - JWT       │                │   │
│  │  │  - Products  │  │  - CORS      │                │   │
│  │  │  - Orders    │  │  - Validator │                │   │
│  │  │  - Users     │  │  - Error     │                │   │
│  │  └──────────────┘  └──────────────┘                │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐                │   │
│  │  │  Services    │  │  Repositories│                │   │
│  │  │  - Business  │  │  - DB Access │                │   │
│  │  │    Logic     │  │  - Queries   │                │   │
│  │  └──────────────┘  └──────────────┘                │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────┬───────────────┬──────────────┬───────────────────┘
           │               │              │
           │               │              │
    ┌──────▼──────┐ ┌─────▼─────┐ ┌─────▼──────┐
    │  PostgreSQL │ │ Cloudinary│ │   Wompi    │
    │   Database  │ │  (Images) │ │  (Pagos)   │
    │  (Supabase) │ └───────────┘ └────────────┘
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │  Resend/    │
    │  SendGrid   │
    │  (Emails)   │
    └─────────────┘
```

---

## 🔄 Flujo de Datos

### 1. **Flujo de Autenticación**
```
Usuario → Frontend → POST /api/auth/login → Backend
                                              ↓
                                         Valida credenciales
                                              ↓
                                         Genera JWT
                                              ↓
Frontend ← Token JWT ← Backend
↓
Guarda en localStorage + Estado Global
```

### 2. **Flujo de Navegación de Productos**
```
Usuario navega tienda
    ↓
Frontend solicita: GET /api/products?page=1&category=pijamas
    ↓
Backend consulta PostgreSQL con filtros
    ↓
Backend retorna productos + metadata (total, páginas)
    ↓
Frontend renderiza con React Query (cache)
```

### 3. **Flujo de Carrito de Compras**
```
Usuario agrega producto
    ↓
Frontend actualiza Zustand State
    ↓
Sincroniza con localStorage
    ↓
(Si usuario autenticado) → POST /api/cart → Backend → DB
                                                        ↓
                                                  Valida stock
```

### 4. **Flujo de Checkout y Pago**
```
Usuario finaliza compra
    ↓
Frontend: Formulario de datos de envío
    ↓
POST /api/orders/create
    ↓
Backend crea orden (status: pending)
    ↓
Backend genera referencia de pago Wompi
    ↓
Frontend redirige a Wompi
    ↓
Usuario paga en Wompi
    ↓
Wompi envía webhook → Backend /api/webhooks/wompi
    ↓
Backend actualiza estado orden (paid)
    ↓
Backend reduce stock
    ↓
Backend envía email confirmación
    ↓
Frontend muestra página de éxito
```

### 5. **Flujo Admin - Gestión de Productos**
```
Admin autenticado (role: admin)
    ↓
Dashboard → Nueva Producto
    ↓
Formulario con imágenes
    ↓
Frontend sube imágenes → Cloudinary
    ↓
Cloudinary retorna URLs
    ↓
POST /api/admin/products (con URLs)
    ↓
Backend valida permisos (middleware)
    ↓
Backend guarda en PostgreSQL
    ↓
Frontend actualiza lista (React Query invalida cache)
```

---

## 🔐 Seguridad

### Medidas Implementadas

1. **Autenticación**
   - JWT con expiración (7 días)
   - Refresh tokens
   - Passwords hasheados con bcrypt (salt rounds: 10)

2. **Autorización**
   - Middleware de roles (admin/customer)
   - Validación en cada endpoint protegido

3. **Protección de Endpoints**
   ```typescript
   // Solo admin
   router.post('/admin/products', authMiddleware, adminMiddleware, createProduct);
   
   // Usuario autenticado
   router.get('/orders/my-orders', authMiddleware, getMyOrders);
   ```

4. **Validación de Datos**
   - Zod schemas en backend
   - Validación en frontend (React Hook Form + Zod)
   - Sanitización de inputs

5. **Rate Limiting**
   - Express rate limit
   - 100 requests / 15 minutos por IP

6. **Headers de Seguridad**
   - Helmet.js
   - CORS configurado
   - HTTPS only (producción)

7. **SQL Injection**
   - ORM (Prisma) previene inyección
   - Prepared statements

8. **XSS Protection**
   - React escapa por defecto
   - Content Security Policy

---

## 📊 Modelo de Datos (Relacional)

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    users    │──────<│   addresses  │       │ categories  │
│             │       │              │       │             │
│ * id        │       │ * id         │       │ * id        │
│ * email     │       │ * user_id    │       │ * name      │
│ * password  │       │ * address    │       │ * slug      │
│ * role      │       │ * city       │       │ * parent_id │
└──────┬──────┘       └──────────────┘       └──────┬──────┘
       │                                             │
       │                                             │
       │              ┌──────────────┐               │
       │              │   products   │◄──────────────┘
       │              │              │
       │              │ * id         │
       │              │ * name       │
       │              │ * price      │
       │              │ * category_id│
       │              │ * images[]   │
       │              └──────┬───────┘
       │                     │
       │                     │
       │              ┌──────▼───────────┐
       │              │ product_variants │
       │              │                  │
       │              │ * id             │
       │              │ * product_id     │
       │              │ * sku            │
       │              │ * stock          │
       │              └──────┬───────────┘
       │                     │
       │                     │
       ▼                     │
┌──────────────┐             │
│    orders    │             │
│              │             │
│ * id         │             │
│ * user_id    │             │
│ * total      │             │
│ * status     │             │
└──────┬───────┘             │
       │                     │
       │                     │
       ▼                     │
┌──────────────┐             │
│ order_items  │◄────────────┘
│              │
│ * id         │
│ * order_id   │
│ * product_id │
│ * variant_id │
│ * quantity   │
└──────────────┘
```

---

## 🚀 Tecnologías por Capa

### **Capa de Presentación (Frontend)**
```typescript
{
  "framework": "React 18",
  "language": "TypeScript",
  "bundler": "Vite",
  "styling": ["Tailwind CSS", "shadcn/ui"],
  "routing": "React Router v6",
  "state_management": "Zustand",
  "server_state": "TanStack Query (React Query)",
  "forms": "React Hook Form + Zod",
  "http": "Axios",
  "date": "date-fns",
  "icons": "Lucide React"
}
```

### **Capa de Aplicación (Backend)**
```typescript
{
  "runtime": "Node.js 20+",
  "framework": "Express.js",
  "language": "TypeScript",
  "orm": "Prisma",
  "validation": "Zod",
  "authentication": "jsonwebtoken + bcrypt",
  "file_upload": "Multer",
  "email": "Resend / @sendgrid/mail",
  "payments": "Wompi SDK",
  "security": "Helmet + express-rate-limit + cors"
}
```

### **Capa de Datos**
```typescript
{
  "database": "PostgreSQL 15+",
  "hosting": "Supabase / Neon / Railway",
  "orm": "Prisma",
  "migrations": "Prisma Migrate",
  "seeding": "Prisma Seed"
}
```

### **Servicios Externos**
```typescript
{
  "image_storage": "Cloudinary",
  "email_service": "Resend / SendGrid",
  "payment_gateway": "Wompi",
  "monitoring": "Sentry",
  "analytics": "Google Analytics / Plausible"
}
```

---

## 📁 Estructura de Carpetas del Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts        # Configuración Prisma
│   │   ├── cloudinary.ts      # Cloudinary setup
│   │   └── environment.ts     # Variables de entorno
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── admin.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validator.middleware.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.dto.ts
│   │   │
│   │   ├── products/
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   ├── products.repository.ts
│   │   │   ├── products.routes.ts
│   │   │   └── products.dto.ts
│   │   │
│   │   ├── orders/
│   │   │   └── ...
│   │   │
│   │   ├── users/
│   │   │   └── ...
│   │   │
│   │   └── admin/
│   │       └── ...
│   │
│   ├── utils/
│   │   ├── response.ts        # Respuestas estandarizadas
│   │   ├── errors.ts          # Custom errors
│   │   └── helpers.ts
│   │
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   └── app.ts                 # Express app
│   └── server.ts              # Server entry point
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 Endpoints API Principales

### **Autenticación**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### **Productos (Público)**
```
GET    /api/products              # Lista con filtros
GET    /api/products/:id          # Detalle
GET    /api/products/featured     # Destacados
GET    /api/categories            # Lista categorías
GET    /api/products/search?q=    # Búsqueda
```

### **Carrito**
```
GET    /api/cart                  # Obtener carrito
POST   /api/cart/add              # Agregar item
PUT    /api/cart/update/:itemId   # Actualizar cantidad
DELETE /api/cart/remove/:itemId   # Remover item
DELETE /api/cart/clear             # Vaciar carrito
```

### **Órdenes**
```
POST   /api/orders/create         # Crear orden
GET    /api/orders/my-orders      # Órdenes del usuario
GET    /api/orders/:id            # Detalle de orden
POST   /api/orders/:id/cancel     # Cancelar orden
```

### **Usuario**
```
GET    /api/users/profile         # Perfil
PUT    /api/users/profile         # Actualizar perfil
PUT    /api/users/password        # Cambiar contraseña
GET    /api/users/addresses       # Direcciones
POST   /api/users/addresses       # Agregar dirección
```

### **Admin - Productos**
```
POST   /api/admin/products        # Crear producto
PUT    /api/admin/products/:id    # Actualizar
DELETE /api/admin/products/:id    # Eliminar
POST   /api/admin/products/:id/images  # Subir imágenes
```

### **Admin - Órdenes**
```
GET    /api/admin/orders          # Todas las órdenes
PUT    /api/admin/orders/:id/status    # Cambiar estado
GET    /api/admin/dashboard/stats      # Estadísticas
```

### **Webhooks**
```
POST   /api/webhooks/wompi        # Confirmación de pago
```

---

## 🌐 Variables de Entorno

### **Backend (.env)**
```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/alunainfinity

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Wompi
WOMPI_PUBLIC_KEY=pub_test_xxxxx
WOMPI_PRIVATE_KEY=prv_test_xxxxx
WOMPI_WEBHOOK_SECRET=webhook_secret
WOMPI_ENVIRONMENT=test

# Email
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@alunainfinity.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Security
CORS_ORIGIN=http://localhost:5173
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_WOMPI_PUBLIC_KEY=pub_test_xxxxx
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

---

## 🧪 Testing Strategy

### **Backend Tests**
```
src/__tests__/
├── unit/
│   ├── auth.service.test.ts
│   ├── products.service.test.ts
│   └── orders.service.test.ts
│
├── integration/
│   ├── auth.routes.test.ts
│   ├── products.routes.test.ts
│   └── orders.routes.test.ts
│
└── e2e/
    └── checkout.flow.test.ts
```

### **Frontend Tests**
```
src/__tests__/
├── components/
│   ├── ProductCard.test.tsx
│   └── CartDrawer.test.tsx
│
├── pages/
│   └── Shop.test.tsx
│
└── e2e/
    └── cypress/
        ├── checkout.cy.ts
        └── admin.cy.ts
```

---

## 📈 Escalabilidad

### **Fase 1: MVP (0-100 usuarios/día)**
- Single server backend
- Supabase free tier
- Cloudinary free tier

### **Fase 2: Crecimiento (100-1000 usuarios/día)**
- Backend en Railway/Render (escalado automático)
- Supabase Pro
- CDN para imágenes
- Redis para caché de sesiones

### **Fase 3: Escala (1000+ usuarios/día)**
- Load balancer
- Múltiples instancias de backend
- Database read replicas
- Queue system (Bull/BullMQ)
- Microservicios (opcional)

---

¿Listo para empezar a construir? 🚀

