import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import styles from "./Upload.module.css";

const Upload = () => {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Open modal automatically when page loads
    setShow(true);
  }, []);

  const handleClose = () => setShow(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/images/sampleReceipt.jpg";
    link.download = "sampleReceipt.jpg";
    link.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setPreviewURL(null);
    setOcrText(null);

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
        setPreviewURL(URL.createObjectURL(file));
        setOcrText(text);
      }
    } catch (err) {
      console.error(err);
      setError("Error processing image. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.desktopPage}>
      <div className={styles.content}>
        <Modal show={show} onHide={handleClose} backdrop={true} backdropClassName="upload-backdrop">
          <Modal.Header closeButton>
            <Modal.Title><h2 style={{lineHeight: 0.3}}>Hello there! Recruiter? 👀</h2></Modal.Title>
          </Modal.Header>
          <Modal.Body style={{margin: "10px 0"}}>
          Click below to download a sample receipt image
          and try out the upload functionality.
          </Modal.Body>
          <Modal.Footer>
            <button className="pinkButton" onClick={handleDownload}>
            Download Image
            </button>
          </Modal.Footer>
        </Modal>
        <div className={styles.uploadContainer}>
          <h2>Upload a Receipt</h2>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {loading && <p>🔍 Scanning image for text…</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Link to="/Review" state={{ ocrText }}>
            <button className="pinkButton">Continue</button>
          </Link>
        </div>
        {previewURL && (
          <div className={styles.imageContainer}>
            <img
              src={previewURL}
              alt="Receipt Preview"
              className={styles.previewImage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;