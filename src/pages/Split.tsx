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

    items.forEach((item) => {
      const assignedPeople = itemAssignments[item.id] || [];
      if (assignedPeople.length === 0) return;

      const itemTotal = item.price * item.quantity;
      const amountPerPerson = itemTotal / assignedPeople.length;

      assignedPeople.forEach((personId) => {
        totals[personId] = (totals[personId] || 0) + amountPerPerson;
      });
    });

    return totals;
  };

  const personTotals = calculatePersonTotals();
  const grandTotal = Object.values(personTotals).reduce(
    (sum, total) => sum + total,
    0,
  );

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
        <div className={styles.test}>
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
              {people.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}:</td>
                  <td>${personTotals[person.id]?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}
            </table>
            <div className={styles.total}>Total: ${grandTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Split;
