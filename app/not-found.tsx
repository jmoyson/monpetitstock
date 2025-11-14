import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-2xl">
          {/* Background gradient - similar to landing page */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-white to-white dark:from-purple-950/10 dark:via-zinc-950 dark:to-zinc-950 blur-3xl"></div>

          {/* Subtle gradient orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20"></div>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <Ghost className="h-12 w-12" />
              </div>
            </div>

            {/* Message */}
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
              Page introuvable
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-md mx-auto">
              Désolé, cette page n'existe pas ou a été déplacée.
            </p>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 text-base px-8 h-12"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer - minimal version */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="container max-w-7xl mx-auto py-6 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              &copy; {new Date().getFullYear()} Mon Petit Stock. Tous droits
              réservés.
            </p>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span>Fait avec</span>
              <span className="text-red-500">❤️</span>
              <span>en France</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
