import type { MetadataRoute } from "next";

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Applebot-Extended",
  "Google-Extended",
  "Google-CloudVertexBot",
  "CCBot",
  "Bytespider",
  "PerplexityBot",
  "Amazonbot",
  "meta-externalagent",
  "FacebookBot",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
      {
        userAgent: AI_CRAWLERS,
        disallow: "/",
      },
    ],
  };
}
