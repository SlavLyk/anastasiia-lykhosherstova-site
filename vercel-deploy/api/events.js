// api/events.js — Vercel serverless function
// Proxies Notion API so the token stays server-side, never exposed in the browser.

const NOTION_DB_ID = 'b308748a71d04b57b244452fdfbedc16';

export default async function handler(req, res) {
  // Allow the site to call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'NOTION_TOKEN not configured' });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Visible on Site',
          checkbox: { equals: true }
        },
        sorts: [{ property: 'Date', direction: 'ascending' }],
      }),
    });

    const data = await response.json();

    // Shape the data cleanly for the frontend
    const events = data.results.map(page => {
      const p = page.properties;
      return {
        name:  p['Event Name'].title[0]?.plain_text ?? '',
        date:  p['Date'].date?.start ?? '',
        loc:   p['Location'].rich_text[0]?.plain_text ?? '',
        type:  p['Type'].select?.name ?? '',
      };
    });

    // Cache for 5 minutes on Vercel's edge
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(events);

  } catch (err) {
    console.error('Notion fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}
