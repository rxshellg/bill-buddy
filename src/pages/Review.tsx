import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { parseItems, type Item } from "../utils/parseReceipt";

const Review = () => {
  const ocrText = useLocation().state?.ocrText || "";
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems(parseItems(ocrText));
  }, [ocrText]);

  const handleChange = (index: number, field: keyof Item, value: string) => {
    setItems(prev => {
      const next = [...prev];
      if (field === "price") {
        next[index].price = parseFloat(value.replace(/[^\d.]/g, "")) || 0;
      } else if (field === "quantity") {
        next[index].quantity = parseInt(value, 10) || 1;
      } else {
        next[index].name = value;
      }
      return next;
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