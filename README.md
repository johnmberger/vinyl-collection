# John's Vinyl Collection

A simple Next.js site that displays a Discogs vinyl collection. Built to deploy on Vercel.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment variables:

```bash
cp .env.example .env.local
```

Then fill in:

```env
DISCOGS_USER_TOKEN=your-discogs-token
DISCOGS_USERNAME=your-discogs-username
```

You can reuse the same Discogs token and username from the visual vinyl scrobbler app. Get a personal access token at [discogs.com/settings/developers](https://www.discogs.com/settings/developers).

3. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add these environment variables in the Vercel project settings:
   - `DISCOGS_USER_TOKEN`
   - `DISCOGS_USERNAME`
   - `SITE_TITLE` (optional)
4. Deploy

Keep the Discogs token server-only. Do not prefix it with `NEXT_PUBLIC_`.

The site is excluded from search indexing and AI scrapers that honor robots rules (`noindex`, `robots.txt`, and `X-Robots-Tag`). There is no sitemap.

The collection is fetched from Discogs on the server and cached for one hour, so browsing the site does not hit the Discogs API on every page load.
