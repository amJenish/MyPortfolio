import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

/**
 * At build time, set og:image / twitter:image when `client/public/opengraph.{png,jpg,jpeg}` exists.
 * Base URL from `SITE_URL` / `VITE_SITE_URL`, else `homepage` in package.json.
 */
export function metaImagesPlugin(): Plugin {
  return {
    name: "vite-plugin-meta-images",
    transformIndexHtml(html) {
      const baseUrl = getSiteBaseUrl();
      if (!baseUrl) {
        return html;
      }

      const publicDir = path.resolve(process.cwd(), "client", "public");
      const opengraphPngPath = path.join(publicDir, "opengraph.png");
      const opengraphJpgPath = path.join(publicDir, "opengraph.jpg");
      const opengraphJpegPath = path.join(publicDir, "opengraph.jpeg");

      let imageExt: string | null = null;
      if (fs.existsSync(opengraphPngPath)) {
        imageExt = "png";
      } else if (fs.existsSync(opengraphJpgPath)) {
        imageExt = "jpg";
      } else if (fs.existsSync(opengraphJpegPath)) {
        imageExt = "jpeg";
      }

      if (!imageExt) {
        return html;
      }

      const imageUrl = `${baseUrl}/opengraph.${imageExt}`;

      if (/<meta\s+property="og:image"/i.test(html)) {
        html = html.replace(
          /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/gi,
          `<meta property="og:image" content="${imageUrl}" />`,
        );
      } else {
        html = html.replace(
          /<\/head>/i,
          `    <meta property="og:image" content="${imageUrl}" />\n  </head>`,
        );
      }

      if (/<meta\s+name="twitter:image"/i.test(html)) {
        html = html.replace(
          /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/gi,
          `<meta name="twitter:image" content="${imageUrl}" />`,
        );
      } else {
        const twitterBlock =
          `    <meta name="twitter:card" content="summary_large_image" />\n` +
          `    <meta name="twitter:image" content="${imageUrl}" />\n`;
        html = html.replace(/<\/head>/i, `${twitterBlock}  </head>`);
      }

      return html;
    },
  };
}

function getSiteBaseUrl(): string | null {
  const fromEnv = process.env.SITE_URL || process.env.VITE_SITE_URL;
  if (fromEnv?.trim()) {
    return fromEnv.replace(/\/$/, "");
  }

  try {
    const raw = fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8");
    const pkg = JSON.parse(raw) as { homepage?: string };
    if (pkg.homepage?.trim()) {
      return pkg.homepage.replace(/\/$/, "");
    }
  } catch {
    /* ignore */
  }

  return null;
}
