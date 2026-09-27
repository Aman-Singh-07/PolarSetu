import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
