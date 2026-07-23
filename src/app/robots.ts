import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://quick-doodle.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/game/"], // Prevents search engines from indexing live dynamic room routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
