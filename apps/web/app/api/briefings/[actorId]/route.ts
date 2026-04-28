import { NextResponse } from "next/server";

import { actorIndex } from "@/features/simulation/simulation-data";
import type { BriefingSource } from "@/features/simulation/simulation-types";

export const revalidate = 900;

type BriefingFeedResponse = {
  items: BriefingSource[];
  mode: "live" | "seed";
};

function decodeXmlText(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .trim();
}

function stripHtml(value: string) {
  return decodeXmlText(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getTagValue(block: string, tagName: string) {
  const match = block.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, "i"));

  return match?.[1] ? decodeXmlText(match[1]) : "";
}

function getSourceLabel(block: string) {
  const match = block.match(/<source(?:\s+url="[^"]+")?>([\s\S]*?)<\/source>/i);

  return match?.[1] ? stripHtml(match[1]) : "Google News";
}

function buildFallback(items: BriefingSource[]): BriefingFeedResponse {
  return {
    items,
    mode: "seed"
  };
}

function buildSearchQuery(label: string, zone: string) {
  return [label, zone, "geopolitics"].join(" ");
}

function parseFeed(xml: string, actorId: string): BriefingSource[] {
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi));

  return items.slice(0, 6).flatMap((match, index) => {
    const block = match[1];

    if (!block) {
      return [];
    }

    const title = stripHtml(getTagValue(block, "title"));
    const description = stripHtml(getTagValue(block, "description"));
    const sourceUrl = decodeXmlText(getTagValue(block, "link"));
    const publishedAt = decodeXmlText(getTagValue(block, "pubDate"));
    const sourceLabel = getSourceLabel(block);

    if (!title || !sourceUrl) {
      return [];
    }

    return {
      id: `${actorId}-live-${index + 1}`,
      title,
      summary: description || title,
      sourceLabel,
      sourceUrl,
      publishedAt: publishedAt || new Date().toISOString()
    };
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ actorId: string }> }
) {
  const { actorId } = await params;
  const actor = actorIndex[actorId];

  if (!actor) {
    return NextResponse.json({ error: "Actor not found" }, { status: 404 });
  }

  const fallback = buildFallback(actor.briefingSources);

  try {
    const query = encodeURIComponent(buildSearchQuery(actor.label, actor.zone));
    const response = await fetch(
      `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`,
      {
        next: { revalidate },
        headers: {
          "User-Agent": "BalanceSphere/0.1 (+https://balancesphere.local)"
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json(fallback);
    }

    const xml = await response.text();
    const items = parseFeed(xml, actor.id);

    if (items.length === 0) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ items, mode: "live" });
  } catch {
    return NextResponse.json(fallback);
  }
}