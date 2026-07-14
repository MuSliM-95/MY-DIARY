import Link from "next/link";
import { Home, ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <SearchX className="h-20 w-20 text-amber-400" />
        </div>

        <h1 className="mb-2 text-6xl font-extrabold text-white">404</h1>

        <h2 className="mb-3 text-2xl font-semibold text-zinc-100">
          Страница не найдена
        </h2>

        <p className="mb-8 text-zinc-400">
          Похоже, такой страницы не существует или она была перемещена.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-medium text-black transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30"
          >
            <Home size={18} />
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
