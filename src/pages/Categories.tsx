import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import categoryPajamas from "@/assets/category-pajamas.jpg";
import categoryAccessories from "@/assets/category-accessories.jpg";
import product2 from "@/assets/product-2.jpg";
import product4 from "@/assets/product-4.jpg";

const Categories = () => {
  const categories = [
    { 
      title: "Pijamas", 
      image: categoryPajamas, 
      link: "/tienda",
      description: "Suaves, elegantes y cómodas"
    },
    { 
      title: "Accesorios", 
      image: categoryAccessories, 
      link: "/tienda",
      description: "Complementos perfectos para tu rutina"
    },
    { 
      title: "Sets Completos", 
      image: product2, 
      link: "/tienda",
      description: "Conjuntos coordinados con estilo"
    },
    { 
      title: "Ediciones Limitadas", 
      image: product4, 
      link: "/colecciones",
      description: "Piezas exclusivas y únicas"
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              Categorías
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up">
              Explora nuestras colecciones organizadas para ti
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CategoryCard {...category} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
