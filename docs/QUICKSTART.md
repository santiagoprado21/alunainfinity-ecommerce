# 🚀 Guía Rápida de Inicio - AlunaInfinity

## 📖 Introducción

Esta guía te llevará paso a paso desde cero hasta tener el backend y la tienda completamente funcional.

---

## 🎯 Fase 1: Preparación del Entorno (Día 1)

### 1.1 Instalar Herramientas Necesarias

```bash
# Node.js (versión 20+)
# Descargar desde: https://nodejs.org/

# Verificar instalación
node --version  # debe ser v20+
npm --version

# Git
git --version

# Editor recomendado: VS Code
# https://code.visualstudio.com/
```

### 1.2 Extensiones de VS Code Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "Prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 1.3 Crear Cuentas Necesarias

- [ ] **GitHub**: Para repositorios
- [ ] **Supabase**: Base de datos PostgreSQL gratis
- [ ] **Cloudinary**: Almacenamiento de imágenes
- [ ] **Resend**: Envío de emails
- [ ] **Wompi**: Pasarela de pagos (sandbox gratis)

---

## 🏗️ Fase 2: Setup del Backend (Día 2-3)

### 2.1 Crear Proyecto Backend

```bash
# Crear carpeta del proyecto backend
mkdir alunainfinity-backend
cd alunainfinity-backend

# Inicializar proyecto
npm init -y

# Instalar dependencias principales
npm install express cors dotenv
npm install @prisma/client bcryptjs jsonwebtoken
npm install multer cloudinary zod
npm install express-rate-limit helmet

# Instalar dependencias de desarrollo
npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/bcryptjs @types/jsonwebtoken
npm install -D prisma tsx nodemon

# Inicializar TypeScript
npx tsc --init
```

### 2.2 Configurar TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2.3 Configurar package.json scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts"
  }
}
```

### 2.4 Estructura de Carpetas

```bash
mkdir -p src/{config,middleware,modules,utils,types}
mkdir -p src/modules/{auth,products,orders,users,admin}
mkdir -p prisma

touch src/app.ts src/server.ts
touch .env .env.example .gitignore
```

### 2.5 Crear .gitignore

```bash
# .gitignore
node_modules/
dist/
.env
*.log
.DS_Store
```

### 2.6 Inicializar Prisma

```bash
# Inicializar Prisma
npx prisma init

# Esto crea:
# - prisma/schema.prisma
# - .env con DATABASE_URL
```

### 2.7 Configurar Base de Datos

1. Ve a [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la "Connection String" (URI mode)
4. Pégala en `.env`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres"
```

### 2.8 Copiar Schema de Prisma

```bash
# Copia el contenido de docs/prisma-schema-example.prisma
# a prisma/schema.prisma
```

### 2.9 Crear Migración Inicial

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🎨 Fase 3: Setup del Frontend (Ya está listo!)

### 3.1 Instalar Dependencias Adicionales

```bash
cd alunainfinity  # Tu proyecto actual

# Instalar gestión de estado y API
npm install zustand
npm install @tanstack/react-query
npm install axios

# Instalar validación de formularios
npm install react-hook-form @hookform/resolvers zod
```

### 3.2 Crear Estructura para API

```bash
mkdir -p src/lib/api
mkdir -p src/stores
mkdir -p src/types
```

---

## 🔐 Fase 4: Implementar Autenticación (Día 4-5)

### 4.1 Backend - Auth Module

```bash
cd alunainfinity-backend

# Crear archivos del módulo auth
touch src/modules/auth/auth.controller.ts
touch src/modules/auth/auth.service.ts
touch src/modules/auth/auth.routes.ts
touch src/modules/auth/auth.dto.ts
```

### 4.2 Ejemplo: auth.service.ts

```typescript
// src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return { user, token };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return { user, token };
  }
}
```

### 4.3 Middleware de Autenticación

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 4.4 Frontend - API Client

```typescript
// src/lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📦 Fase 5: Implementar Productos (Día 6-8)

### 5.1 Backend - Products Module

```typescript
// src/modules/products/products.service.ts
import { prisma } from '../../config/database';

export class ProductsService {
  async getAll(filters: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (filters.category) {
      where.category = { slug: filters.category };
    }

    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          include: { user: true },
        },
      },
    });
  }
}
```

### 5.2 Frontend - React Query Setup

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 10, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});
```

### 5.3 Frontend - Products Hook

```typescript
// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export const useProducts = (filters?: {
  category?: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/products', { params: filters });
      return data;
    },
  });
};
```

---

## 🛒 Fase 6: Implementar Carrito (Día 9-10)

### 6.1 Frontend - Cart Store (Zustand)

```typescript
// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          });
        }
      },
      
      clear: () => set({ items: [] }),
      
      total: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

---

## 💳 Fase 7: Integrar Wompi (Día 11-13)

### 7.1 Configurar Wompi

1. Regístrate en [Wompi](https://wompi.com/)
2. Obtén tus claves de sandbox:
   - Public Key (empieza con `pub_test_`)
   - Private Key (empieza con `prv_test_`)

### 7.2 Backend - Wompi Service

```typescript
// src/modules/payments/wompi.service.ts
import axios from 'axios';

export class WompiService {
  private apiUrl = 'https://sandbox.wompi.co/v1';
  
  async createTransaction(data: {
    amountInCents: number;
    currency: string;
    reference: string;
    customerEmail: string;
  }) {
    const response = await axios.post(
      `${this.apiUrl}/transactions`,
      {
        ...data,
        publicKey: process.env.WOMPI_PUBLIC_KEY,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
        },
      }
    );
    
    return response.data;
  }
  
  async verifyTransaction(transactionId: string) {
    const response = await axios.get(
      `${this.apiUrl}/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
        },
      }
    );
    
    return response.data;
  }
}
```

---

## 👨‍💼 Fase 8: Panel Admin (Día 14-20)

### 8.1 Frontend - Rutas Protegidas

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({ 
  children,
  requireAdmin = false 
}: { 
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};
```

### 8.2 Crear Dashboard

```bash
mkdir -p src/pages/admin
touch src/pages/admin/Dashboard.tsx
touch src/pages/admin/Products.tsx
touch src/pages/admin/Orders.tsx
```

---

## 🚀 Fase 9: Deploy (Día 21-22)

### 9.1 Deploy Backend en Railway

1. Ve a [Railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Conecta tu repositorio backend
4. Railway detectará Node.js automáticamente
5. Agrega PostgreSQL desde "New" → "Database" → "PostgreSQL"
6. Configura variables de entorno
7. Deploy!

### 9.2 Deploy Frontend en Vercel

```bash
cd alunainfinity

# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Producción
vercel --prod
```

### 9.3 Variables de Entorno en Vercel

```env
VITE_API_URL=https://tu-backend.railway.app/api
VITE_WOMPI_PUBLIC_KEY=pub_prod_xxxxx
```

---

## ✅ Checklist Final

### Backend
- [ ] Autenticación funcionando
- [ ] CRUD de productos
- [ ] Sistema de órdenes
- [ ] Integración Wompi
- [ ] Webhooks configurados
- [ ] Variables de entorno en producción
- [ ] Migraciones aplicadas

### Frontend
- [ ] Catálogo conectado a API
- [ ] Carrito funcional
- [ ] Checkout completo
- [ ] Panel admin básico
- [ ] Variables de entorno configuradas

### Producción
- [ ] Dominio configurado
- [ ] SSL activo
- [ ] Emails funcionando
- [ ] Pagos en producción probados
- [ ] Backups configurados

---

## 📞 Soporte y Recursos

### Documentación
- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Wompi Docs](https://docs.wompi.co/)

### Comunidades
- [Stack Overflow](https://stackoverflow.com/)
- [Discord de Prisma](https://pris.ly/discord)
- [Reddit /r/node](https://reddit.com/r/node)

---

## 🎉 ¡Listo para Empezar!

Sigue esta guía paso a paso y en 3-4 semanas tendrás tu tienda completamente funcional.

**¡Mucho éxito con AlunaInfinity!** 🚀

