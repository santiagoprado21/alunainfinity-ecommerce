import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  image: string;
  text: string;
  rating: number;
}

const TestimonialCard = ({ name, image, text, rating }: TestimonialCardProps) => {
  return (
    <div className="bg-card border border-border/50 p-8 hover-lift group">
      <div className="mb-6">
        <div className="flex gap-1 mb-6">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
          ))}
        </div>
        <p className="text-foreground text-base leading-relaxed italic mb-6">
          "{text}"
        </p>
      </div>
      <div className="flex items-center gap-4 pt-4 border-t border-border/50">
        <img
          src={image}
          alt={name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-secondary/20"
        />
        <div>
          <h4 className="font-semibold text-base tracking-wide">{name}</h4>
          <p className="text-sm text-muted-foreground">Cliente verificada</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
