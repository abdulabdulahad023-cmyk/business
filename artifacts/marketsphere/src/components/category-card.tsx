import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

interface CategoryCardProps {
  id: string;
  name: string;
  itemCount: number;
  imageUrl: string;
  delay?: number;
}

export function CategoryCard({ id, name, itemCount, imageUrl, delay = 0 }: CategoryCardProps) {
  return (
    <Link href={`/category/${id}`}>
      <motion.div 
        className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay }}
      >
        <div className="absolute inset-0 bg-muted">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
        
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
            <h3 className="font-display font-bold text-2xl text-white mb-1">
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm font-medium">
                {itemCount} items
              </span>
              <span className="w-0 overflow-hidden group-hover:w-5 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
