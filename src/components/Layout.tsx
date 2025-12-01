import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <NavigationBar />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};