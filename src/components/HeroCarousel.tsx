import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1920&auto=format&fit=crop",
    title: "Elegancia Atemporal",
    subtitle: "Descubre fragancias que perduran en la memoria.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1595425970339-274aff3de396?q=80&w=1920&auto=format&fit=crop",
    title: "Notas Exclusivas",
    subtitle: "Perfumes importados de las mejores casas europeas.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1920&auto=format&fit=crop",
    title: "Tu Sello Personal",
    subtitle: "Encuentra el aroma que define tu estilo.",
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Imagen con overlay oscuro */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Contenido Texto */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider animate-fadeIn">
              {slide.title}
            </h2>
            <p className="text-lg md:text-2xl text-[#F5F0E6] mb-8 max-w-2xl">
              {slide.subtitle}
            </p>
            <Link 
              to="/catalogo"
              className="px-8 py-3 bg-[#D4AF37] hover:bg-[#AA8C2C] text-white font-semibold rounded-none uppercase tracking-widest transition-colors duration-300"
            >
              Comprar Ahora
            </Link>
          </div>
        </div>
      ))}

      {/* Flechas de Navegación */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-[#D4AF37] text-white rounded-full transition-colors"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-[#D4AF37] text-white rounded-full transition-colors"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicadores (Puntos) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === current ? 'bg-[#D4AF37]' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}