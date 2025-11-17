-- ============================================================================
-- ALUNAINFINITY E-COMMERCE - ESQUEMA DE BASE DE DATOS
-- PostgreSQL 15+
-- ============================================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda full-text

-- ============================================================================
-- TABLA: users
-- Usuarios del sistema (clientes y administradores)
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'customer', -- 'customer' | 'admin'
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- TABLA: addresses
-- Direcciones de envío de los usuarios
-- ============================================================================
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Colombia',
    phone VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- ============================================================================
-- TABLA: categories
-- Categorías de productos (con soporte para subcategorías)
-- ============================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- ============================================================================
-- TABLA: products
-- Productos principales
-- ============================================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Precios
    price DECIMAL(10, 2) NOT NULL,
    compare_price DECIMAL(10, 2), -- Precio tachado
    cost_price DECIMAL(10, 2),    -- Costo interno
    
    -- Categorización
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Identificadores
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    
    -- Imágenes (array de URLs)
    images JSONB DEFAULT '[]',
    
    -- Stock (si no usa variantes)
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    track_inventory BOOLEAN DEFAULT TRUE,
    
    -- Características
    weight DECIMAL(10, 2), -- en gramos
    dimensions JSONB, -- {length, width, height}
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Estado
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);

-- Índice para búsqueda full-text
CREATE INDEX idx_products_search ON products 
    USING gin(to_tsvector('spanish', name || ' ' || COALESCE(description, '')));

-- ============================================================================
-- TABLA: product_variants
-- Variantes de productos (tallas, colores, etc.)
-- ============================================================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- ej: "Talla M - Rosa"
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    
    -- Precio específico (opcional, si difiere del producto base)
    price DECIMAL(10, 2),
    compare_price DECIMAL(10, 2),
    
    -- Stock
    stock_quantity INTEGER DEFAULT 0,
    
    -- Atributos flexibles (JSON)
    attributes JSONB DEFAULT '{}', -- {size: "M", color: "Rosa"}
    
    -- Imagen específica
    image_url VARCHAR(500),
    
    -- Estado
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_attributes ON product_variants USING gin(attributes);

-- ============================================================================
-- TABLA: inventory_logs
-- Historial de cambios en el inventario
-- ============================================================================
CREATE TABLE inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL, -- 'sale', 'restock', 'adjustment', 'return'
    quantity_change INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    reason TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_inventory_logs_product_id ON inventory_logs(product_id);
CREATE INDEX idx_inventory_logs_variant_id ON inventory_logs(variant_id);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at);

-- ============================================================================
-- TABLA: orders
-- Órdenes de compra
-- ============================================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- ej: ORD-20241117-001
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Estado
    status VARCHAR(50) NOT NULL DEFAULT 'pending', 
    -- 'pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'
    
    -- Totales
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Pago
    payment_method VARCHAR(50), -- 'wompi', 'cash_on_delivery'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    payment_id VARCHAR(255), -- ID de transacción de Wompi
    paid_at TIMESTAMP,
    
    -- Dirección de envío (almacenada como JSON para histórico)
    shipping_address JSONB NOT NULL,
    
    -- Información de envío
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- Cupón aplicado
    coupon_code VARCHAR(50),
    
    -- Notas
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================================================
-- TABLA: order_items
-- Items de cada orden
-- ============================================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Datos del producto en el momento de la compra
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255),
    sku VARCHAR(100),
    
    -- Precios
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Imagen
    product_image VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- TABLA: carts
-- Carritos de compra persistentes
-- ============================================================================
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- Para usuarios no autenticados
    items JSONB DEFAULT '[]',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
CREATE INDEX idx_carts_expires_at ON carts(expires_at);

-- ============================================================================
-- TABLA: coupons
-- Cupones de descuento
-- ============================================================================
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Tipo de descuento
    discount_type VARCHAR(20) NOT NULL, -- 'percentage' | 'fixed'
    discount_value DECIMAL(10, 2) NOT NULL,
    
    -- Restricciones
    min_purchase DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    
    -- Uso
    max_uses INTEGER,
    times_used INTEGER DEFAULT 0,
    max_uses_per_user INTEGER DEFAULT 1,
    
    -- Productos aplicables (opcional)
    applicable_products JSONB, -- Array de product IDs
    applicable_categories JSONB, -- Array de category IDs
    
    -- Vigencia
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    
    -- Estado
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);
CREATE INDEX idx_coupons_valid_dates ON coupons(valid_from, valid_until);

-- ============================================================================
-- TABLA: coupon_usages
-- Registro de uso de cupones
-- ============================================================================
CREATE TABLE coupon_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_coupon_usages_coupon_id ON coupon_usages(coupon_id);
CREATE INDEX idx_coupon_usages_user_id ON coupon_usages(user_id);
CREATE INDEX idx_coupon_usages_order_id ON coupon_usages(order_id);

-- ============================================================================
-- TABLA: reviews
-- Reseñas de productos
-- ============================================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    
    -- Moderación
    is_approved BOOLEAN DEFAULT FALSE,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    
    -- Utilidad
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Un usuario solo puede hacer una reseña por producto
    UNIQUE(product_id, user_id)
);

-- Índices
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================================
-- TABLA: wishlists
-- Lista de deseos de usuarios
-- ============================================================================
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Un producto solo puede estar una vez en la wishlist de un usuario
    UNIQUE(user_id, product_id)
);

-- Índices
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);

-- ============================================================================
-- TABLA: notifications
-- Notificaciones del sistema
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'order_update', 'low_stock', 'new_review', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================================================
-- TABLA: settings
-- Configuración general de la tienda
-- ============================================================================
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuraciones iniciales
INSERT INTO settings (key, value, description) VALUES
    ('store_name', '"AlunaInfinity"', 'Nombre de la tienda'),
    ('store_email', '"contacto@alunainfinity.com"', 'Email de contacto'),
    ('store_phone', '"+57 300 123 4567"', 'Teléfono de contacto'),
    ('currency', '"COP"', 'Moneda'),
    ('tax_rate', '0', 'Tasa de impuesto (%)'),
    ('shipping_methods', '[]', 'Métodos de envío'),
    ('low_stock_threshold', '5', 'Umbral de stock bajo');

-- ============================================================================
-- TABLA: email_logs
-- Registro de emails enviados
-- ============================================================================
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template VARCHAR(100),
    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'failed', 'bounced'
    error_message TEXT,
    metadata JSONB,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);

-- ============================================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

-- Vista: Productos con stock total (incluyendo variantes)
CREATE OR REPLACE VIEW products_with_stock AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.price,
    p.is_active,
    CASE 
        WHEN COUNT(pv.id) > 0 THEN SUM(pv.stock_quantity)
        ELSE p.stock_quantity
    END as total_stock,
    COUNT(pv.id) as variants_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id AND pv.is_active = true
GROUP BY p.id;

-- Vista: Estadísticas de productos
CREATE OR REPLACE VIEW product_stats AS
SELECT 
    p.id,
    p.name,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(oi.quantity) as total_sold,
    AVG(r.rating) as avg_rating,
    COUNT(DISTINCT r.id) as review_count
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.payment_status = 'paid'
LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = true
GROUP BY p.id;

-- ============================================================================
-- DATOS DE EJEMPLO (SEED)
-- ============================================================================

-- Usuario administrador (password: Admin123!)
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified) VALUES
('admin@alunainfinity.com', '$2b$10$YourHashedPasswordHere', 'Admin', 'AlunaInfinity', 'admin', true);

-- Categorías
INSERT INTO categories (name, slug, description) VALUES
('Pijamas', 'pijamas', 'Pijamas elegantes y cómodas'),
('Accesorios', 'accesorios', 'Accesorios para complementar tu estilo'),
('Sets', 'sets', 'Sets completos coordinados'),
('Batas', 'batas', 'Batas de lujo');

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================

