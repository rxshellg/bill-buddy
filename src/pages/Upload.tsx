import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Upload.module.css";

const Upload = () => {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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