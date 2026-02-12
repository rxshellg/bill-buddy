import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { parseItems } from "../utils/parseReceipt";
import type { Item } from "../types";

const Review = () => {
  const ocrText = useLocation().state?.ocrText || "";
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems(parseItems(ocrText));
  }, [ocrText]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const hasItems = items.length > 0;

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addNewItem = () => {
    const newItem: Item = {
      id: crypto.randomUUID(),
      name: "New Item",
      price: 0,
      quantity: 1,
      assignedTo: [],
      splitType: "equal",
    };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItemField = (index: number, field: keyof Item, value: string) => {
    setItems((prev) => {
      const updated = [...prev];

      if (field === "price") {
        // Strip non-numeric characters except decimal point
        const numericValue = parseFloat(value.replace(/[^\d.]/g, "")) || 0;
        updated[index].price = numericValue;
      } else if (field === "quantity") {
        const numericValue = parseInt(value, 10) || 1;
        updated[index].quantity = numericValue;
      } else if (field === "name") {
        updated[index].name = value;
      }
      return updated;
    });
  };

  const proceedToSplit = () => {
    // Only continue if there’s at least one item
    if (!hasItems) return;
    navigate("/Split", { state: { items } });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Review and Edit Items</h2>

      {/* Empty state */}
      {!hasItems && <p>No items found. You can go back and try again.</p>}

      {/* Items list */}
      {items.map((item, index) => (
        <div
          key={item.id}
          style={{
            marginBottom: "1rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {/* Quantity */}
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateItemField(index, "quantity", e.target.value)}
            style={{ width: "60px" }}
            aria-label={`Quantity for ${item.name}`}
          />

          {/* Item name */}
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateItemField(index, "name", e.target.value)}
            style={{ flex: 1 }}
            aria-label="Item name"
          />

          {/* Price */}
          <input
            type="text"
            value={`$${item.price.toFixed(2)}`}
            onChange={(e) => updateItemField(index, "price", e.target.value)}
            style={{ width: "100px" }}
            aria-label={`Price for ${item.name}`}
          />

          {/* Delete button */}
          <button
            onClick={() => deleteItem(item.id)}
            aria-label={`Delete ${item.name}`}
          >
            🗑️
          </button>
        </div>
      ))}

      {/* Summary section */}
      <div>Subtotal: ${subtotal.toFixed(2)}</div>

      {/* Action buttons */}
      <button className="whiteButton" onClick={addNewItem}>
        + Add Item
      </button>
      <button
        className="pinkButton"
        onClick={proceedToSplit}
        disabled={!items.length}
      >
        Continue to split
      </button>
    </div>
  );
};

export default Review;
