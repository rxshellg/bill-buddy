import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AssignItemModal from "../components/AssignItemModal";
import type { Item } from "../types";
import useIsMobile from "../hooks/useIsMobile";
import {
  usePeople,
  PeopleChips,
  AddPersonModal,
} from "../components/PeopleManager";

import styles from "./Split.module.css";

const Split = () => {
  const isMobile = useIsMobile();
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const { people, addPerson, removePerson } = usePeople([]);
  const { state } = useLocation() as { state?: { items?: Item[] } };
  const items = state?.items || [];
  const [itemBeingAssigned, setItemBeingAssigned] = useState<Item | null>(null);
  const [itemAssignments, setItemAssignments] = useState<
    Record<string, string[]>
  >({});
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [tipPercent, setTipPercent] = useState<number>(0);

  // Sync assignment state with items on load
  useEffect(() => {
    const initialAssignments: Record<string, string[]> = {};
    items.forEach((item) => {
      initialAssignments[item.id] = item.assignedTo || [];
    });
    setItemAssignments(initialAssignments);
  }, [items]);

  const calculatePersonTotals = () => {
    const totals: Record<string, number> = {};

    people.forEach((p) => {
      totals[p.id] = 0;
    });

    let subtotal = 0;

    // Add up assigned items
    items.forEach((item) => {
      const assignedPeople = itemAssignments[item.id] || [];
      if (assignedPeople.length === 0) return;

      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const amountPerPerson = itemTotal / assignedPeople.length;

      assignedPeople.forEach((personId) => {
        totals[personId] = (totals[personId] || 0) + amountPerPerson;
      });
    });

    if (subtotal > 0) {
      const taxAmount = (subtotal * taxPercent) / 100;
      const tipAmount = (subtotal * tipPercent) / 100;

      // Split tax/tip proportionally based on each person's share
      people.forEach((p) => {
        const personSubtotal = totals[p.id] || 0;
        const personProportion = personSubtotal / subtotal;
        const personTaxTip = (taxAmount + tipAmount) * personProportion;

        totals[p.id] = personSubtotal + personTaxTip;
      });
    }

    return totals;
  };

  const personTotals = calculatePersonTotals();
  const grandTotal = Object.values(personTotals).reduce(
    (sum, total) => sum + total,
    0,
  );

  // Calculate breakdown for display
  const subtotal = items.reduce((sum, item) => {
    const assignedPeople = itemAssignments[item.id] || [];
    if (assignedPeople.length === 0) return sum;
    return sum + item.price * item.quantity;
  }, 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const tipAmount = (subtotal * tipPercent) / 100;

  const openAssignModal = (item: Item) => setItemBeingAssigned(item);
  const closeAssignModal = () => setItemBeingAssigned(null);

  const saveAssignment = (itemId: string, personIds: string[]) => {
    // Keep existing assignments, update this item
    setItemAssignments((currentAssignments) => ({
      ...currentAssignments,
      [itemId]: personIds,
    }));
    closeAssignModal();
  };

  return (
    <>
      <div className={isMobile ? styles.mobilePage : styles.desktopPage}>
        {/* Items & Assignment */}
        <div className={styles.content}>
          <div className={styles.itemsContainer}>
            <PeopleChips
              people={people}
              onAddClick={() => setShowAddPersonModal(true)}
              onRemovePerson={removePerson}
            />

            {/* Items table */}
            <table>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className={styles.quantity}>{item.quantity}</span>
                  </td>
                  <td style={{ width: "80%" }}>
                    <div className={styles.nameAndPrice}>
                      <span>{item.name}</span>${item.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="text-end">
                    <button
                      className={`pinkButton ${styles.assignButton}`}
                      onClick={() => openAssignModal(item)}
                    >
                      {itemAssignments[item.id]?.length > 0
                        ? `Assigned (${itemAssignments[item.id].length})`
                        : "Assign"}
                    </button>
                  </td>
                </tr>
              ))}
            </table>

            {/* Tax & Tip Inputs */}
            <div className={styles.adjustments}>
              <div className={styles.inputGroup}>
                <label>Tax (%)</label>
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Tip (%)</label>
                <input
                  type="number"
                  value={tipPercent}
                  onChange={(e) => setTipPercent(Number(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="1"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Modals */}
            <AddPersonModal
              show={showAddPersonModal}
              onClose={() => setShowAddPersonModal(false)}
              onSubmit={(name, color) => addPerson(name, color)}
            />
            <AssignItemModal
              show={itemBeingAssigned !== null}
              item={itemBeingAssigned}
              people={people}
              currentAssignees={
                itemBeingAssigned
                  ? itemAssignments[itemBeingAssigned.id] || []
                  : []
              }
              onClose={closeAssignModal}
              onSave={saveAssignment}
            />
          </div>

          {/* Results */}
          <div className={styles.resultsContainer}>
            <div className={styles.resultsHeader}>Results</div>

            <table>
              {/* Breakdown */}
              {(taxPercent > 0 || tipPercent > 0) && (
                <>
                  <tr>
                    <td>Subtotal:</td>
                    <td>${subtotal.toFixed(2)}</td>
                  </tr>

                  {taxPercent > 0 && (
                    <tr>
                      <td>Tax ({taxPercent}%):</td>
                      <td>${taxAmount.toFixed(2)}</td>
                    </tr>
                  )}

                  {tipPercent > 0 && (
                    <tr>
                      <td>Tip ({tipPercent}%):</td>
                      <td>${tipAmount.toFixed(2)}</td>
                    </tr>
                  )}

                  <tr className={styles.spacerRow}>
                    <td colSpan={2} aria-hidden></td>
                  </tr>
                </>
              )}

              {/* Each person's total */}
              {people.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}:</td>
                  <td>${personTotals[person.id]?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}

              {/* Grand total */}
              {people.length > 0 && (
                <tr>
                  <td colSpan={2}>
                    <div className={styles.divider}></div>
                  </td>
                </tr>
              )}
              <tr>
                <td>Total: </td>
                <td>${grandTotal.toFixed(2)}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Split;
