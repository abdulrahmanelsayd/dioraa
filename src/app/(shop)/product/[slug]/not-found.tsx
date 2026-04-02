import Link from "next/link";
import { SearchX, Home, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-brand-offWhite flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-blush/30 flex items-center justify-center">
          <SearchX className="w-8 h-8 text-brand-rose" />
        </div>

        <h1 className="font-serif text-2xl text-brand-ink mb-3">
          Product Not Found
        </h1>
        
        <p className="font-sans text-brand-slate text-sm mb-8">
          We couldn&apos;t find the product you&apos;re looking for. 
          It may have been removed or the URL might be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="flex items-center gap-2 px-6 py-3 bg-brand-ink text-white rounded-full font-sans text-sm font-medium hover:bg-brand-ink/90 transition-colors"
          >
            <Home size={16} />
            Browse Shop
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 border border-brand-rose/30 text-brand-ink rounded-full font-sans text-sm font-medium hover:bg-brand-blush/30 transition-colors"
          >
            <ArrowLeft size={16} />
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
