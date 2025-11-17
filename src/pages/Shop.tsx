import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const Shop = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [filterCategory, setFilterCategory] = useState("all");

  const allProducts = [
    { id: "1", name: "Pijama Silk Rosa", price: 89000, image: product1, category: "pajamas" },
    { id: "2", name: "Conjunto Satín Crema", price: 95000, image: product2, category: "sets" },
    { id: "3", name: "Set de Accesorios", price: 45000, image: product3, category: "accessories" },
    { id: "4", name: "Bata Elegante Champagne", price: 120000, image: product4, category: "pajamas" },
    { id: "5", name: "Pijama Clásica Rosa", price: 85000, image: product1, category: "pajamas" },
    { id: "6", name: "Conjunto Premium", price: 110000, image: product2, category: "sets" },
    { id: "7", name: "Accesorios Deluxe", price: 55000, image: product3, category: "accessories" },
    { id: "8", name: "Bata de Lujo", price: 135000, image: product4, category: "pajamas" },
  ];

  const filteredProducts = filterCategory === "all" 
    ? allProducts 
    : allProducts.filter(p => p.category === filterCategory);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-muted/20 py-24">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up tracking-tight">
              Nuestra Tienda
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl animate-fade-in-up font-light tracking-wide">
              Descubre toda nuestra colección de pijamas y accesorios diseñados con elegancia
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 py-12 border-b border-border/50">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button
                variant={filterCategory === "all" ? "default" : "outline"}
                onClick={() => setFilterCategory("all")}
                className="px-6 rounded-none tracking-wide"
              >
                Todos
              </Button>
              <Button
                variant={filterCategory === "pajamas" ? "default" : "outline"}
                onClick={() => setFilterCategory("pajamas")}
                className="px-6 rounded-none tracking-wide"
              >
                Pijamas
              </Button>
              <Button
                variant={filterCategory === "accessories" ? "default" : "outline"}
                onClick={() => setFilterCategory("accessories")}
                className="px-6 rounded-none tracking-wide"
              >
                Accesorios
              </Button>
              <Button
                variant={filterCategory === "sets" ? "default" : "outline"}
                onClick={() => setFilterCategory("sets")}
                className="px-6 rounded-none tracking-wide"
              >
                Sets
              </Button>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[220px] rounded-none">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="newest">Más Recientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container mx-auto px-4 py-16 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 max-w-7xl mx-auto">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.08}s` }}>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
