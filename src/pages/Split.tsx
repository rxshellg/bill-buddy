import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { Item } from "../utils/parseReceipt";
import useIsMobile from "../hooks/useIsMobile";
import { usePeople, PeopleChips, AddPersonModal } from "../components/PeopleManager";

import styles from './Split.module.css'

const Split = () => {
    const isMobile = useIsMobile();
    const { state } = useLocation() as { state?: { items?: Item[] } };
    const { people, addPerson, removePerson, grandTotal } = usePeople([]);
    const [showModal, setShowModal] = useState(false);
    const items = state?.items || [];
    
    return (
        <>
            <div className={isMobile ? styles.mobilePage : styles.desktopPage}>
                <div className={styles.itemsContainer}>
                    <PeopleChips
                        people={people}
                        onAddClick={() => setShowModal(true)}
                        onRemovePerson={removePerson}
                    />
                    <table>
                        {items.map((item, i) => (
                            <tr key={i}>
                                <td>{item.quantity}</td>
                                <td>{item.name}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td><button className="pinkButton">Assign</button></td>
                            </tr>
                        ))}
                    </table>
                    <AddPersonModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        onSubmit={(name, color) => addPerson(name, color)}
                    />
                </div>
                <div className={styles.resultsContainer}>
                    <div className={styles.resultsHeader}>Results</div>
                    <table>
                        {people.map((p) => (
                            <tr key={p.id}>
                                <td>{p.name}:</td>
                                <td>${p.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </table>
                    <div className={styles.total}>Total: ${grandTotal.toFixed(2)}</div>
                </div>
            </div>
        </>
    );
}

export default Split;