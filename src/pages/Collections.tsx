import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product4 from "@/assets/product-4.jpg";

const Collections = () => {
  const collections = [
    {
      title: "Colección Primavera",
      description: "Piezas frescas y delicadas para la nueva temporada",
      products: [
        { id: "1", name: "Pijama Silk Rosa", price: 89000, image: product1 },
        { id: "2", name: "Conjunto Satín Crema", price: 95000, image: product2 },
      ]
    },
    {
      title: "Edición Limitada Luxury",
      description: "Exclusivas piezas de alta gama",
      products: [
        { id: "4", name: "Bata Elegante Champagne", price: 120000, image: product4 },
        { id: "6", name: "Conjunto Premium", price: 110000, image: product2 },
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              Colecciones Especiales
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up">
              Descubre nuestras colecciones exclusivas y ediciones limitadas
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-20 space-y-20">
          {collections.map((collection, index) => (
            <section key={index} className="animate-fade-in-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {collection.title}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {collection.description}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {collection.products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
