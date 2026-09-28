import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body-md antialiased">
      <Navbar />
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
