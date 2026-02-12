import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { DEFAULT_COLORS } from "./usePeople";
import styles from './AddPersonModal.module.css';

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string) => void;
}

export default function AddPersonModal({ show, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLORS[0]);

  const handleAdd = () => {
    if (name.trim()) {
      onSubmit(name.trim(), color);
      setName("");
      setColor(DEFAULT_COLORS[0]);
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop>
      <Modal.Header>
        <Modal.Title className={styles.modalTitle}>Add person</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: 16 }}
        />

        <label>Pick a color</label>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {DEFAULT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: color === c ? "3px solid #111" : "1px solid #aaa",
                backgroundColor: c
              }}
            />
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="whiteButton" onClick={onClose}>
          Cancel
        </button>
        <button className="pinkButton" onClick={handleAdd} disabled={!name.trim()}>
          Add
        </button>
      </Modal.Footer>
    </Modal>
  );
}