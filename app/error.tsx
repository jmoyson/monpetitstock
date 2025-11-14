"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Quelque chose s'est mal passé. Veuillez réessayer.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Réessayer
      </button>
      <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          Si le problème persiste, contactez-moi à{" "}
          <a
            href="mailto:jeremy@monpetitstock.fr"
            className="text-purple-600 hover:underline"
          >
            jeremy@monpetitstock.fr
          </a>
        </p>
        <Link
          href="/"
          className="inline-block mt-3 text-purple-600 hover:underline"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
