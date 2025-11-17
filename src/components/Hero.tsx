import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroProps {
  imageSrc: string;
}

const Hero = ({ imageSrc }: HeroProps) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={imageSrc}
            alt="AlunaInfinity Collection"
            className="w-full h-full object-cover image-parallax"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="animate-fade-in-up space-y-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
            Elegancia<br />& Confort
          </h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto font-light tracking-wide opacity-95">
            Descubre pijamas y accesorios diseñados para mujeres<br />que valoran el lujo en cada detalle
          </p>
          <Link to="/tienda">
            <Button size="lg" className="text-base px-12 py-7 rounded-none tracking-wider font-medium hover:scale-105 transition-transform mt-4">
              EXPLORAR COLECCIÓN
            </Button>
          </Link>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-white/40"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
