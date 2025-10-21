import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";
import Modal from "react-bootstrap/Modal";

import styles from './Home.module.css';

const Home = () => {
    const isMobile = useIsMobile();
    const navigate = useNavigate()
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const openModal = () => {
        setError(null);
        setShowUploadModal(true);
    };

    const closeModal = () => {
        setShowUploadModal(false);
        setLoading(false);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const processFile = async (file: File) => {
        
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:4000/ocr", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            const text = data.text?.trim() || "";

            const cleanedText = text
                .replace(/[^A-Za-zÀ-ÿ0-9\s]/g, "")
                .replace(/\s+/g, " ")
                .trim();

            const wordCount = cleanedText.split(" ").filter(Boolean).length;
            const hasRealContent = /[A-Za-zÀ-ÿ0-9]/.test(cleanedText);

            if (wordCount < 4 || !hasRealContent) {
                setError("Couldn't detect readable text. Please try a different image.");
            } else {
                navigate("/Review", { state: { ocrText: text } });
            }
        } catch (err) {
            console.error(err);
            setError("Error processing image. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await processFile(file);
    };

    const handleUseExample = async () => {
        try {
            const resp = await fetch("/images/sampleReceipt.jpg");
            if (!resp.ok) throw new Error("Couldn't load example image.");
            const blob = await resp.blob();
            const exampleFile = new File([blob], "sampleReceipt.jpg", { type: blob.type || "image/jpeg" });
            await processFile(exampleFile);
        } catch (e) {
            console.error(e);
            setError("Error using example image.");
        }
    };
    
    const buttons = (
        <div className={styles.buttonOptions}>
            <button className="pinkButton" onClick={openModal}>Upload a receipt</button>
            <Link to="/Calculator"><button className="whiteButton">Split manually</button></Link>
        </div>
    );

    return (
        <>
            <div className={isMobile ? styles.mobileHome : styles.desktopHome}>
                <div className={isMobile ? undefined : styles.content}>
                    <div className={styles.textContainer}>
                        <h1>Bill buddy</h1>
                        <h2>For when the check comes and no one wants to think.
                            Enter your numbers, split the bill, done.</h2>
                        {!isMobile && buttons}
                    </div>
                    <div className={styles.imageContainer}>
                        <img src="/images/homePageImage.png" />
                    </div>
                    {isMobile && buttons}
                </div>
            </div>
            {/* Upload Modal */}
            <Modal show={showUploadModal} onHide={closeModal} backdrop={true} backdropClassName="upload-backdrop" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2 style={{ lineHeight: 0.3 }}>Upload a receipt</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ marginBottom: 12 }}>
                        Try BillBuddy with your own photo, or use our sample image to see the flow.
                    </p>
                    {loading && <p style={{ marginTop: 12 }}>🔍 Scanning image for text…</p>}
                    {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                        <label className="pinkButton" style={{ margin: 0, cursor: "pointer" }}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            Choose image…
                        </label>
                        <button className="whiteButton" onClick={handleUseExample}>Use example image</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
};

export default Home;