import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
}

const CategoryCard = ({ title, image, link }: CategoryCardProps) => {
  return (
    <Link to={link} className="group block">
      <div className="relative overflow-hidden aspect-[3/4] bg-card hover-lift">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover image-parallax"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wide">{title}</h3>
          <Button variant="secondary" size="sm" className="rounded-none tracking-wider font-medium group-hover:bg-white group-hover:text-foreground transition-colors">
            VER COLECCIÓN
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
