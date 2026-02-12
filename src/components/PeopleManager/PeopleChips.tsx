import styles from "./styles.module.css";
import type { Person } from "../../types";

interface Props {
  people: Person[];
  onAddClick: () => void;
  onRemovePerson: (id: string) => void;
}

export default function PeopleChips({
  people,
  onAddClick,
  onRemovePerson,
}: Props) {
  return (
    <div className={styles.chipsRow}>
      {people.map((p) => (
        <button
          key={p.id}
          className={styles.personChip}
          style={{ backgroundColor: p.color }}
          type="button"
          onClick={() => onRemovePerson(p.id)}
        >
          <span>{p.name}</span>
        </button>
      ))}

      <button type="button" onClick={onAddClick} className={styles.addChip}>
        + Add person
      </button>
    </div>
  );
}
