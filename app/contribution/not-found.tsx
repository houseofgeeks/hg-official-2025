import Link from 'next/link';

export default function Notfound(){
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6">Page Not Found</h2>
      <p className="mb-8 text-gray-400 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="rounded-full bg-white px-8 py-3 text-black font-medium transition-colors hover:bg-gray-200"
      >
        Return Home
      </Link>
    </div>
  );
}