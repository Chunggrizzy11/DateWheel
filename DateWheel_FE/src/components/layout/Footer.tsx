import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
          Made with <Heart size={16} className="text-red-500 fill-current animate-pulse" /> by <span className="font-semibold text-foreground">Chung & Trang</span>
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Decision Wheel &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
