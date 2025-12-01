import { describe, it, expect } from 'vitest';
import { cn } from '../../lib/utils';

describe('Utilidad: cn (Classname Merger)', () => {
  
  it('debe combinar clases simples', () => {
    const resultado = cn('flex', 'justify-center');
    expect(resultado).toBe('flex justify-center');
  });

  it('debe resolver conflictos de Tailwind (merge)', () => {
    // Si pasamos p-4 después de p-2, p-4 debe ganar
    const resultado = cn('p-2', 'p-4', 'bg-red-500'); 
    expect(resultado).toContain('p-4');
    expect(resultado).not.toContain('p-2');
  });

  it('debe manejar condiciones booleanas correctamente', () => {
    const esActivo = true;
    const esDeshabilitado = false;
    
    const resultado = cn(
      'base-class',
      esActivo && 'active-class',
      esDeshabilitado && 'disabled-class'
    );
    
    expect(resultado).toBe('base-class active-class');
  });

  it('debe ignorar valores nulos o undefined', () => {
    const resultado = cn('clase1', null, undefined, 'clase2');
    expect(resultado).toBe('clase1 clase2');
  });
});