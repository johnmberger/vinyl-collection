export default function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg">
        <h1 className="font-display text-4xl text-cream">Vinyl Collection</h1>
        <p className="mt-4 text-muted">
          Add your Discogs credentials to load the collection.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-cream/90">
          <li>
            Copy <code className="text-accent">.env.example</code> to{" "}
            <code className="text-accent">.env.local</code>
          </li>
          <li>
            Set <code className="text-accent">DISCOGS_USER_TOKEN</code> and{" "}
            <code className="text-accent">DISCOGS_USERNAME</code>
          </li>
          <li>Restart the dev server</li>
        </ol>
        <p className="mt-6 text-sm text-muted">
          Get a personal access token at{" "}
          <a
            href="https://www.discogs.com/settings/developers"
            className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            target="_blank"
            rel="noreferrer"
          >
            discogs.com/settings/developers
          </a>
          .
        </p>
      </div>
    </div>
  );
}
