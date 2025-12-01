export type Item = { name: string; price: number; quantity: number };

const PRICE_END = /\$?\s*(\d{1,4}[.,]\d{2})\s*$/i;
const PRICE_LINE = /(.+?)\s+\$?\s*(\d{1,4}[.,]\d{2})\s*$/;
const BANNED = ["total", "subtotal", "admin", "tax", "change", "instagram"];

export function parseItems(ocrText: string): Item[] {
  const lines = ocrText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const candidates: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i];
    const prev = lines[i - 1];

    // Case A: item and price are on the SAME line → keep as-is
    if (PRICE_END.test(cur)) {
      candidates.push(cur);
      continue;
    }

    // Case B: price-only line (e.g., "$7.00") → stitch with previous line
    const isJustPrice = /^\$?\d{1,4}[.,]\d{2}$/.test(cur);
    if (isJustPrice && prev) candidates.push(`${prev} ${cur}`);
  }

  const parsed = candidates
    .map(line => {
      const m = line.match(PRICE_LINE)
      if (!m) return null;

      let rawName = m[1];
      const priceStr = m[2];

      let quantity = 1;
      const q = rawName.match(/^(\d+)\s+(.*)$/);
      if (q) {
        quantity = parseInt(q[1], 10) || 1;
        rawName = q[2];
      }

      const name = rawName.trim();
      const price = parseFloat(priceStr.replace(",", "."));

      if (
        !name ||
        Number.isNaN(price) ||
        BANNED.some(w => name.toLowerCase().includes(w))
      ) {
        return null;
      }

      return { name, price, quantity } as Item;
    })
    .filter(Boolean) as Item[];

  return parsed;
}
