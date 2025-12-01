import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-12 pb-6 border-t-4 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Marca */}
          <div>
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Rincón Perfumes</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Descubre la esencia de la elegancia. Ofrecemos las fragancias más exclusivas
              para resaltar tu personalidad con notas inolvidables.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold text-[#FDFBF7] mb-4">Explora</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-[#D4AF37] transition-colors">Inicio</Link></li>
              <li><Link to="/catalogo" className="hover:text-[#D4AF37] transition-colors">Catálogo Completo</Link></li>
              <li><Link to="/login" className="hover:text-[#D4AF37] transition-colors">Iniciar Sesión</Link></li>
              <li><Link to="/registro" className="hover:text-[#D4AF37] transition-colors">Crear Cuenta</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold text-[#FDFBF7] mb-4">Contáctanos</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Av. Providencia 1234, Santiago</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>contacto@rinconperfumes.cl</span>
              </li>
            </ul>
            
            {/* Redes Sociales */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Instagram /></a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Facebook /></a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Twitter /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Rincón Perfumes. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}