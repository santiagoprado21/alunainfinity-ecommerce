import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 mt-28">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-widest">ALUNAINFINITY</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Pijamas y accesorios para mujeres que aman el confort y la elegancia.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-5 tracking-wide text-base">Comprar</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/tienda" className="text-muted-foreground hover:text-secondary transition-colors">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="text-muted-foreground hover:text-secondary transition-colors">
                  Pijamas
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="text-muted-foreground hover:text-secondary transition-colors">
                  Accesorios
                </Link>
              </li>
              <li>
                <Link to="/colecciones" className="text-muted-foreground hover:text-secondary transition-colors">
                  Ediciones Limitadas
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-5 tracking-wide text-base">Información</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/nosotros" className="text-muted-foreground hover:text-secondary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-muted-foreground hover:text-secondary transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                  Envíos y Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-5 tracking-wide text-base">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-muted hover:bg-secondary hover:text-white transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-muted hover:bg-secondary hover:text-white transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-muted hover:bg-secondary hover:text-white transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 AlunaInfinity. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
