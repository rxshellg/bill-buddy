import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

type Item = { name: string; price: number; quantity: number };

const Review = () => {
  const ocrText = useLocation().state?.ocrText || "";
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const lines = ocrText
      .split("\n")
      .map((line: string) => line.trim())
      .filter(Boolean);

    const combined = lines.flatMap((line, i) => {
      const priceMatch = line.match(/^\$?\d{1,3}[.,]\d{2}$/);
      return priceMatch && i > 0 ? [`${lines[i - 1]} ${line}`] : [];
    });

    const bannedWords = ["total", "subtotal", "admin", "tax", "change", "instagram"];

    const parsed = combined
  .map(line => {
    const match = line.match(/^(.+?)\s+\$?(\d{1,3}[.,]\d{2})$/);
    if (!match) return null;

    let rawName = match[1];
    const priceStr = match[2];

    let quantity = 1;
    const qtyMatch = rawName.match(/^(\d+)\s+(.*)$/);
    if (qtyMatch) {
      quantity = parseInt(qtyMatch[1]);
      rawName = qtyMatch[2];
    }

    const name = rawName.trim();
    const price = parseFloat(priceStr.replace(",", "."));

    if (!name || isNaN(price) || bannedWords.some(word => name.toLowerCase().includes(word))) {
      return null;
    }

    return { name, price, quantity };
  })
  .filter(Boolean) as Item[];

    setItems(parsed);
  }, [ocrText]);

  const handleChange = (index: number, field: keyof Item, value: string) => {
    setItems(prev => {
      const updated = [...prev];
      if (field === "price") {
        updated[index].price = parseFloat(value.replace(/[^\d.]/g, "")) || 0;
      } else if (field === "quantity") {
        updated[index].quantity = parseInt(value) || 1;
      } else {
        updated[index].name = value;
      }
      return updated;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Review and Edit Items</h2>
      {items.length === 0 && <p>No items found. You can go back and try again.</p>}

      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={e => handleChange(index, "quantity", e.target.value)}
            style={{ width: "60px" }}
          />
          <input
            type="text"
            value={item.name}
            onChange={e => handleChange(index, "name", e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            type="text"
            value={`$${item.price.toFixed(2)}`}
            onChange={e => handleChange(index, "price", e.target.value)}
            style={{ width: "100px" }}
          />
        </div>
      ))}
    </div>
  );
};

export default Review;