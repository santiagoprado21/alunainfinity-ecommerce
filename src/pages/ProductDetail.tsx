import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  // Mock product data
  const product = {
    id: id || "1",
    name: "Pijama Silk Rosa",
    price: 89000,
    images: [product1, product1, product1],
    description: "Sumérgete en el lujo con nuestra pijama de seda rosa. Confeccionada con seda 100% natural de la más alta calidad, esta prenda te envuelve en una suavidad incomparable. El diseño elegante y atemporal la convierte en la compañera perfecta para tus momentos de descanso.",
    features: [
      "Material: Seda 100% natural",
      "Diseño elegante y femenino",
      "Suavidad incomparable",
      "Fácil cuidado y lavado",
      "Disponible en múltiples tallas"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  };

  const relatedProducts = [
    { id: "2", name: "Conjunto Satín Crema", price: 95000, image: product2 },
    { id: "3", name: "Set de Accesorios", price: 45000, image: product3 },
    { id: "4", name: "Bata Elegante", price: 120000, image: product4 },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-card">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover hover-scale"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.slice(1).map((img, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-card cursor-pointer hover-scale">
                    <img
                      src={img}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-3xl font-semibold text-secondary">
                  ${product.price.toLocaleString()}
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <div>
                <h3 className="font-semibold mb-3">Características:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-secondary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Talla:</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="w-12 h-12"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Cantidad:</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Añadir al Carrito
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-20">
            <h2 className="text-3xl font-bold mb-8 text-center">
              También Te Puede Gustar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
