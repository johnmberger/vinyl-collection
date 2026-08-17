"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-cream">
          Couldn&apos;t load the collection
        </h1>
        <p className="mt-3 text-muted">
          {error.message ||
            "The Discogs API request failed. Check your token and try again."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-accent px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
