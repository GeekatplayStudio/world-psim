import { NextResponse } from "next/server";

import { actorIndex } from "@/features/simulation/simulation-data";
import type { BriefingSource } from "@/features/simulation/simulation-types";

export const revalidate = 900;

type BriefingFeedResponse = {
  items: BriefingSource[];
  mode: "live" | "seed";
};

type FeedConnector =
  | {
      type: "rss";
      url: string;
      sourceLabel: string;
    }
  | {
      type: "search";
      query: string;
    };

const actorConnectors: Partial<Record<string, FeedConnector[]>> = {
  "united-nations": [
    {
      type: "rss",
      url: "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
      sourceLabel: "UN News"
    }
  ],
  "european-union": [
    {
      type: "rss",
      url: "https://ec.europa.eu/commission/presscorner/api/rss?language=en",
      sourceLabel: "EU Press Corner"
    }
  ],
  "united-states": [
    {
      type: "search",
      query:
        '(site:whitehouse.gov OR site:state.gov OR site:defense.gov) "United States" geopolitics'
    }
  ],
  "united-kingdom": [
    {
      type: "search",
      query: 'site:gov.uk "United Kingdom" diplomacy OR security'
    }
  ],
  ukraine: [
    {
      type: "search",
      query: '(site:president.gov.ua OR site:mfa.gov.ua) Ukraine diplomacy OR security'
    }
  ],
  israel: [
    {
      type: "search",
      query: 'site:gov.il Israel security OR diplomacy'
    }
  ]
};

function decodeXmlText(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
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

function buildSearchFeedUrl(query: string) {
  const encodedQuery = encodeURIComponent(query);

  return `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;
}

function parseFeed(xml: string, actorId: string, defaultSourceLabel?: string): BriefingSource[] {
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
    const sourceLabel = defaultSourceLabel ?? getSourceLabel(block);

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

async function fetchFeedXml(url: string) {
  const response = await fetch(url, {
    next: { revalidate },
    headers: {
      "User-Agent": "BalanceSphere/0.1 (+https://balancesphere.local)"
    }
  });

  if (!response.ok) {
    return null;
  }

  return response.text();
}

async function fetchConnectorItems(actorId: string, connector: FeedConnector) {
  if (connector.type === "rss") {
    const xml = await fetchFeedXml(connector.url);

    return xml ? parseFeed(xml, actorId, connector.sourceLabel) : [];
  }

  const xml = await fetchFeedXml(buildSearchFeedUrl(connector.query));

  return xml ? parseFeed(xml, actorId) : [];
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
    const connectors = actorConnectors[actor.id] ?? [];

    for (const connector of connectors) {
      const items = await fetchConnectorItems(actor.id, connector);

      if (items.length > 0) {
        return NextResponse.json({ items, mode: "live" });
      }
    }

    const xml = await fetchFeedXml(buildSearchFeedUrl(buildSearchQuery(actor.label, actor.zone)));

    if (!xml) {
      return NextResponse.json(fallback);
    }

    const items = parseFeed(xml, actor.id);

    if (items.length === 0) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ items, mode: "live" });
  } catch {
    return NextResponse.json(fallback);
  }
}