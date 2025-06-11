import { useState } from "react";

import useIsMobile from "../hooks/useIsMobile";

import styles from './Calculator.module.css'

const Calculator = () => {
    const isMobile = useIsMobile();
    const [bill, setBill] = useState<number | "">("");
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [customTip, setCustomTip] = useState<number | "">("");
    const [people, setPeople] = useState<number | "">("");
    const [results, setResults] = useState({
        tipAmount: 0,
        total: 0,
        perPerson: 0,
    });

    const handleCalculate = () => {
        const numericBill = Number(bill);
        const numericPeople = Number(people);
        const tipPercent = selectedTip ?? Number(customTip);
    
        if (!numericBill || !numericPeople || isNaN(tipPercent)) return;
    
        const tipAmount = (numericBill * tipPercent) / 100;
        const total = numericBill + tipAmount;
        const perPerson = total / numericPeople;
    
        setResults({
          tipAmount,
          total,
          perPerson,
        });
    };

    const handleReset = () => {
        setBill("");
        setPeople("");
        setSelectedTip(null);
        setCustomTip("");
        setResults({
          tipAmount: 0,
          total: 0,
          perPerson: 0,
        });
      };

    return (
        <>
            <div className={isMobile ? styles.mobilePage : styles.desktopPage}>
                <div className={styles.inputContainer}>

                    {/* Bill Amount */}
                    <div className={styles.inputGroup}>
                        <label>Bill</label>
                        <input
                            type="number"
                            value={bill}
                            min="1"
                            step="any"
                            onChange={(e) => setBill(Number(e.target.value))}
                        />
                    </div>

                    {/* Tip */}
                    <div className={styles.inputGroup}>
                        <label>Select Tip</label>
                        <div className={styles.tipButtons}>
                            {[5, 10, 15, 25, 50, 75].map((tip) => (
                                <button
                                key={tip}
                                className={`pinkButton ${selectedTip === tip ? "pinkButtonActive" : ""}`}
                                onClick={() => {
                                    setSelectedTip(tip);
                                    setCustomTip("");
                                }}
                                >
                                {tip}%
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            placeholder="Custom Tip (%)"
                            value={customTip}
                            onChange={(e) => {
                                setCustomTip(Number(e.target.value));
                                setSelectedTip(null);
                            }}
                        />
                    </div>

                    {/* People */}
                    <div className={styles.inputGroup}>
                        <label>Number of People</label>
                        <input
                            type="number"
                            value={people}
                            onChange={(e) => setPeople(Number(e.target.value))}
                        />
                    </div>

                    <button onClick={handleCalculate} className="pinkButton">Calculate</button>
                </div>
                <div className={styles.resultsContainer}>
                    <div className={styles.resultsHeader}>Results</div>
                    <div className={styles.resultRow}>
                        Tip amount 
                        <label>${results.tipAmount.toFixed(2)}</label>
                    </div>
                    <div className={styles.resultRow}>
                        Total 
                        <label>${results.total.toFixed(2)}</label>
                    </div>
                    <div className={styles.resultRow}>
                        Each person pays 
                        <label>${results.perPerson.toFixed(2)}</label>
                    </div>
                    <button className="whiteButton" onClick={handleReset}>Reset</button>
                </div>
            </div>
        </>
    )
}

export default Calculator;