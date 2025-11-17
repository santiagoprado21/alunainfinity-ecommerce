import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

const About = () => {
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
        {/* Hero Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Sobre AlunaInfinity
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up">
              Donde el confort se encuentra con la elegancia
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestra Historia</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                AlunaInfinity nació del deseo de crear algo especial para las mujeres que 
                valoran tanto el confort como la elegancia. Creemos firmemente que los momentos 
                de descanso merecen ser vividos con la misma sofisticación y cuidado que cualquier 
                otro aspecto de tu vida.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cada prenda en nuestra colección es cuidadosamente seleccionada pensando en ti. 
                Trabajamos con los mejores materiales y diseños para ofrecerte piezas que no solo 
                lucen hermosas, sino que también te hacen sentir increíble.
              </p>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestra Misión</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                En AlunaInfinity, nuestra misión es simple pero profunda: queremos que cada mujer 
                se sienta especial, cómoda y elegante en sus momentos de descanso. Creemos que la 
                calidad no debe ser un lujo, sino una experiencia accesible para todas las mujeres 
                que valoran su bienestar y estilo personal.
              </p>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestros Valores</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-lg bg-muted/30 hover-lift">
                  <h3 className="text-xl font-semibold mb-3">Calidad</h3>
                  <p className="text-muted-foreground">
                    Solo trabajamos con los mejores materiales y proveedores
                  </p>
                </div>
                <div className="text-center p-6 rounded-lg bg-muted/30 hover-lift">
                  <h3 className="text-xl font-semibold mb-3">Elegancia</h3>
                  <p className="text-muted-foreground">
                    Cada diseño está pensado para resaltar tu estilo único
                  </p>
                </div>
                <div className="text-center p-6 rounded-lg bg-muted/30 hover-lift">
                  <h3 className="text-xl font-semibold mb-3">Confort</h3>
                  <p className="text-muted-foreground">
                    Tu comodidad es nuestra máxima prioridad
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Lo Que Dicen Nuestras Clientas
              </h2>
              <p className="text-muted-foreground text-lg">
                La satisfacción de nuestras clientas es nuestra mayor recompensa
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

export default About;
