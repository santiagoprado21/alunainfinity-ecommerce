import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import TestimonialCard from "@/components/TestimonialCard";
import heroImage from "@/assets/hero-image.jpg";
import categoryPajamas from "@/assets/category-pajamas.jpg";
import categoryAccessories from "@/assets/category-accessories.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

const Index = () => {
  const categories = [
    { title: "Pijamas", image: categoryPajamas, link: "/categorias" },
    { title: "Accesorios", image: categoryAccessories, link: "/categorias" },
    { title: "Sets Completos", image: product2, link: "/colecciones" },
    { title: "Ediciones Limitadas", image: product4, link: "/colecciones" },
  ];

  const featuredProducts = [
    { id: "1", name: "Pijama Silk Rosa", price: 89000, image: product1 },
    { id: "2", name: "Conjunto Satín Crema", price: 95000, image: product2 },
    { id: "3", name: "Set de Accesorios", price: 45000, image: product3 },
    { id: "4", name: "Bata Elegante", price: 120000, image: product4 },
  ];

  const testimonials = [
    {
      name: "María González",
      image: testimonial1,
      text: "La mejor compra que he hecho. La calidad es excepcional y el confort incomparable.",
      rating: 5,
    },
    {
      name: "Laura Martínez",
      image: testimonial2,
      text: "Me encanta la elegancia y suavidad de cada prenda. Definitivamente volveré a comprar.",
      rating: 5,
    },
    {
      name: "Ana Rodríguez",
      image: testimonial3,
      text: "AlunaInfinity ha transformado mis noches. Son piezas hermosas y muy cómodas.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <Hero imageSrc={heroImage} />

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-28">
          <div className="text-center mb-16 animate-fade-in-up max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Explora Nuestras Colecciones
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-light tracking-wide">
              Cada pieza está diseñada pensando en tu comodidad y estilo
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {categories.map((category, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CategoryCard {...category} />
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-muted/20 py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                Productos Destacados
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl font-light tracking-wide">
                Descubre nuestras piezas más populares
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-7xl mx-auto">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="container mx-auto px-4 py-28">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
              Sobre AlunaInfinity
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
              En AlunaInfinity creemos que cada mujer merece sentirse especial, 
              incluso en los momentos más íntimos. Nuestra misión es ofrecer 
              pijamas y accesorios que combinen elegancia, confort y calidad excepcional. 
              Cada prenda es cuidadosamente seleccionada para brindarte la mejor experiencia.
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted/20 py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                Lo Que Dicen Nuestras Clientas
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl font-light tracking-wide">
                La satisfacción de nuestras clientas es nuestra mayor recompensa
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
