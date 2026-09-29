import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { PageTransition } from '../ui/PageTransition';

export default function Layout() {

  return (
    <div className="min-h-screen flex flex-col bg-snow text-ink font-sans antialiased">
      <Navbar />
      <main className="w-full pt-[64px] lg:pt-[72px] min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)] flex flex-col flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
