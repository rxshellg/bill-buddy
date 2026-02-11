import type { Item } from '../types';

const BANNED = ["total", "subtotal", "admin", "tax", "change", "instagram"];

export function parseItems(ocrText: string): Item[] {
  const lines = ocrText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const combined = lines.flatMap((line, i) => {
    const priceMatch = line.match(/^\$?\d{1,4}[.,]\d{2}$/);
    return priceMatch && i > 0 ? [`${lines[i - 1]} ${line}`] : [];
  });

  const parsed = combined
    .map(line => {
      const match = line.match(/^(.+?)\s+\$?(\d{1,4}[.,]\d{2})$/);
      if (!match) return null;

      let rawName = match[1];
      const priceStr = match[2];

      let quantity = 1;
      const q = rawName.match(/^(\d+)\s+(.*)$/);
      if (q) {
        quantity = parseInt(q[1]) || 1;
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

      return {
        id: crypto.randomUUID(),
        name,
        price,
        quantity,
        assignedTo: [],
        splitType: 'equal' as const
      } as Item;
    })
    .filter(Boolean) as Item[];

  return parsed;
}
