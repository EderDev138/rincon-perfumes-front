import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavigationBar from './NavigationBar';

export const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />
      
      <main className="flex-grow-1">
        <Outlet /> {/* Aquí se renderiza la página seleccionada */}
      </main>

      {/* <Footer /> */}
      <footer className="bg-dark text-light py-4 mt-auto text-center">
        <Container>
          <small>© {new Date().getFullYear()} Rincón Perfumes</small>
        </Container>
      </footer>
    </div>
  );
};