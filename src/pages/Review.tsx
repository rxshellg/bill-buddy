import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { parseItems } from "../utils/parseReceipt";
import type { Item } from "../types";
import useIsMobile from "../hooks/useIsMobile";
import styles from "./Review.module.css";

const Review = () => {
  const isMobile = useIsMobile();
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
    <div className={isMobile ? styles.mobilePage : styles.desktopPage}>
      <div className={styles.card}>
        <h2>Review and Edit Items</h2>

        {/* Empty state */}
        {!hasItems && (
          <p className={styles.empty}>
            No items found. You can go back and try again.
          </p>
        )}

        {/* Items list */}
        <div className={styles.list}>
          {items.map((item, index) => (
            <div key={item.id} className={styles.item}>
              {/* Quantity */}
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateItemField(index, "quantity", e.target.value)
                }
                className={styles.quantity}
                aria-label={`Quantity for ${item.name}`}
              />

              {/* Item name */}
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItemField(index, "name", e.target.value)}
                className={styles.name}
                aria-label="Item name"
              />

              {/* Price */}
              <input
                type="text"
                value={`$${item.price.toFixed(2)}`}
                onChange={(e) =>
                  updateItemField(index, "price", e.target.value)
                }
                className={styles.price}
                aria-label={`Price for ${item.name}`}
              />

              {/* Delete button */}
              <button
                onClick={() => deleteItem(item.id)}
                aria-label={`Delete ${item.name}`}
                className={styles.deleteButton}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          {/* Summary section */}
          <div className={styles.subtotal}>
            Subtotal: ${subtotal.toFixed(2)}
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
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
        </div>
      </div>
    </div>
  );
};

export default Review;
