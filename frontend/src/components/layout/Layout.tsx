import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-snow text-ink font-sans antialiased">
      <Navbar />
      <main className="w-full pt-[72px] min-h-[calc(100vh-72px)]">
        <div key={location.pathname} className="animate-fade-in w-full h-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
