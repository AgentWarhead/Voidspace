'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white antialiased min-h-screen flex flex-col items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-6xl font-bold font-mono text-rose-400 mb-4">500</h1>
          <p className="text-xl text-gray-400 mb-2">Critical Error</p>
          <p className="text-sm text-gray-500 mb-8">
            Something went seriously wrong. Please refresh the page.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-lg text-sm font-semibold bg-white text-black hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
