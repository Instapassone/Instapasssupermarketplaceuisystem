import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl font-black text-[#E52324] mb-4">404</div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">
            Page Not Found
          </h1>
          <p className="text-white/40 text-sm mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been
            removed or the URL might be incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="w-5 h-5" />
                Go Home
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Search className="w-5 h-5" />
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
