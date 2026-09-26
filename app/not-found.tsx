import Link from "next/link";
import { getSiteTitle } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div
          className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[#0c0b09] shadow-[0_0_0_3px_#d4a574]"
          aria-hidden
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#3f3a34]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#3f3a34]">
              <div className="h-5 w-5 rounded-full bg-accent" />
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm tracking-[0.2em] text-accent uppercase">
          404
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-cream sm:text-5xl">
          Record not found
        </h1>
        <p className="mt-4 text-muted">
          This disc isn&apos;t in {getSiteTitle()}. Either it was never pressed, or
          the needle skipped.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Back to collection
        </Link>
      </div>
    </div>
  );
}
