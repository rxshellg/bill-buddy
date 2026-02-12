import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import type { Item, Person } from "../types";
import styles from "./AssignItemModal.module.css";

interface Props {
  show: boolean;
  item: Item | null;
  people: Person[];
  currentAssignees: string[]; // Array of person IDs currently assigned
  onClose: () => void;
  onSave: (itemId: string, personIds: string[]) => void;
}

export default function AssignItemModal({
  show,
  item,
  people,
  currentAssignees,
  onClose,
  onSave,
}: Props) {
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  useEffect(() => {
    setSelectedPeople(currentAssignees);
  }, [currentAssignees, show]);

  const togglePerson = (personId: string) => {
    setSelectedPeople((prev) => {
      if (prev.includes(personId)) {
        return prev.filter((id) => id !== personId);
      } else {
        return [...prev, personId];
      }
    });
  };

  const calculateSplitAmount = () => {
    if (!item || selectedPeople.length === 0) return 0;
    const itemTotal = item.price * item.quantity;
    return itemTotal / selectedPeople.length;
  };

  const handleSave = () => {
    if (!item) return;
    onSave(item.id, selectedPeople);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original assignments
    setSelectedPeople(currentAssignees);
    onClose();
  };

  if (!item) return null;

  const splitAmount = calculateSplitAmount();

  return (
    <Modal show={show} onHide={handleCancel} centered backdrop>
      <Modal.Header>
        <Modal.Title className={styles.modalTitle}>
          Assign {item.name} to...
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* People selection */}
        <div>
          {people.length === 0 ? (
            <p className={styles.emptyState}>
              No people added yet. Add people first to assign items.
            </p>
          ) : (
            <div className={styles.peopleList}>
              {people.map((person) => {
                const isSelected = selectedPeople.includes(person.id);
                return (
                  <label
                    key={person.id}
                    className={`${styles.personOption} ${isSelected ? styles.selected : ""}`}
                    style={{
                      borderColor: isSelected ? person.color : undefined,
                      backgroundColor: isSelected
                        ? `${person.color}15`
                        : undefined,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePerson(person.id)}
                      className={styles.checkbox}
                    />
                    <span
                      className={styles.colorDot}
                      style={{ backgroundColor: person.color }}
                    />
                    <span className={styles.personName}>{person.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Split preview */}
        {selectedPeople.length > 0 && (
          <div className={styles.splitPreview}>
            <div className={styles.splitLabel}>
              Split between {selectedPeople.length}{" "}
              {selectedPeople.length === 1 ? "person" : "people"}
            </div>
            <div className={styles.splitAmount}>
              ${splitAmount.toFixed(2)} each
            </div>
          </div>
        )}

        {selectedPeople.length === 0 && people.length > 0 && (
          <div className={styles.warning}>
            Select at least one person to assign this item to
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="whiteButton" onClick={handleCancel}>
          Cancel
        </button>
        <button
          className="pinkButton"
          onClick={handleSave}
          disabled={selectedPeople.length === 0}
        >
          Save Assignment
        </button>
      </Modal.Footer>
    </Modal>
  );
}
