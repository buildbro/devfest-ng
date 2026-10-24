import fs from "node:fs";
import path from "node:path";
import { getEvent } from "@/lib/events";

// Cache the raw logo SVG template in memory
let cachedTemplate: string | null = null;

function getLogoTemplate(): string {
  if (!cachedTemplate) {
    const blankPath = path.join(process.cwd(), "public", "img", "logo-blank.svg");
    const fallbackPath = path.join(process.cwd(), "public", "img", "logo.svg");
    const logoPath = fs.existsSync(blankPath) ? blankPath : fallbackPath;
    cachedTemplate = fs.readFileSync(logoPath, "utf8");
  }
  return cachedTemplate;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const cleanSlug = slug.replace(/\.svg$/, "");
  const event = await getEvent(cleanSlug);

  const city = event?.city ?? "Nigeria";

  const rawSvg = getLogoTemplate();

  // Replace the hardcoded "NG" vector path if present (from logo.svg), or insert into logo-blank.svg
  const ngPathRegex = /<path fill="#1e1e1e" d="m1762\.9226 955\.42413[^"]*"\/>/;

  // Adjust font size dynamically if city name is long to prevent text overflowing the logo area
  const baseFontSize = 140;
  const fontSize =
    city.length > 15
      ? Math.max(80, Math.floor(baseFontSize * (15 / city.length)))
      : baseFontSize;

  const cityTextElement = `<text x="1900" y="955" text-anchor="middle" font-family="'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="${fontSize}" fill="#1e1e1e" letter-spacing="4">${escapeXml(
    city.toUpperCase(),
  )}</text>`;

  let dynamicSvg: string;

  if (ngPathRegex.test(rawSvg)) {
    dynamicSvg = rawSvg.replace(ngPathRegex, cityTextElement);
  } else {
    // For logo-blank.svg: insert the dynamic city text element before closing </g></svg>
    dynamicSvg = rawSvg.replace("</g></svg>", `${cityTextElement}</g></svg>`);
  }

  // Ensure there is a clean white background for high contrast on all cards and dark mode
  if (!dynamicSvg.includes('<rect width="3800" height="1096" fill="#ffffff"')) {
    dynamicSvg = dynamicSvg.replace(
      '<g clip-path="url(#p.0)">',
      '<g clip-path="url(#p.0)"><rect width="3800" height="1096" fill="#ffffff"/>',
    );
  }

  return new Response(dynamicSvg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

