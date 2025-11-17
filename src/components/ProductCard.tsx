import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

const ProductCard = ({ id, name, price, image }: ProductCardProps) => {
  return (
    <Link to={`/producto/${id}`} className="group block">
      <div className="bg-card overflow-hidden hover-lift">
        <div className="aspect-[3/4] overflow-hidden bg-muted/30 relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover image-parallax"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </div>
        <div className="p-6 text-center space-y-2">
          <h3 className="font-medium text-base tracking-wide group-hover:text-secondary transition-colors duration-300">
            {name}
          </h3>
          <p className="text-secondary font-semibold text-lg tracking-wide">
            ${price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
