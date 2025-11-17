# AlunaInfinity - Pijamas y Accesorios Elegantes

Una tienda e-commerce moderna especializada en pijamas de lujo y accesorios elegantes para damas que valoran el confort y el estilo.

## 🌟 Características

- **Diseño Elegante**: Interfaz moderna y sofisticada construida con React y Tailwind CSS
- **Experiencia de Usuario**: Navegación intuitiva con animaciones suaves
- **Catálogo de Productos**: Sistema de filtrado y ordenamiento de productos
- **Responsive**: Totalmente adaptable a todos los dispositivos
- **Categorías**: Organización clara en Pijamas, Accesorios, Sets y Colecciones

## 🛠️ Tecnologías

Este proyecto está construido con:

- **Vite** - Build tool y dev server ultrarrápido
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - JavaScript con tipado estático
- **Tailwind CSS** - Framework de utilidades CSS
- **shadcn/ui** - Componentes de UI accesibles y personalizables
- **React Router** - Enrutamiento del lado del cliente
- **Lucide React** - Iconos modernos

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── ui/          # Componentes de shadcn/ui
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ...
├── pages/           # Páginas de la aplicación
│   ├── Index.tsx    # Página principal
│   ├── Shop.tsx     # Catálogo de productos
│   ├── ProductDetail.tsx
│   └── ...
├── assets/          # Imágenes y recursos estáticos
├── lib/            # Utilidades y helpers
└── hooks/          # Custom React hooks
```

## 📄 Páginas

- **Inicio** (`/`) - Landing page con hero, categorías destacadas, productos y testimonios
- **Tienda** (`/tienda`) - Catálogo completo con filtros y ordenamiento
- **Producto** (`/producto/:id`) - Detalle de producto individual
- **Categorías** (`/categorias`) - Vista de categorías
- **Colecciones** (`/colecciones`) - Colecciones especiales
- **Nosotros** (`/nosotros`) - Información de la marca
- **Contacto** (`/contacto`) - Formulario de contacto

## 🎨 Personalización

El proyecto utiliza Tailwind CSS para estilos. Puedes personalizar:
- Colores en `tailwind.config.ts`
- Componentes UI en `src/components/ui/`
- Estilos globales en `src/index.css`

## 📝 Licencia

Este proyecto es privado y pertenece a AlunaInfinity.
