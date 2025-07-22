const express = require("express");
const multer = require("multer");
const cors = require("cors");
const vision = require("@google-cloud/vision");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

const client = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_VISION_CREDENTIALS),
});

app.post("/ocr", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const [result] = await client.textDetection(req.file.buffer);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      return res.status(200).json({ text: "", warning: "No text found" });
    }

    res.json({ text: detections[0].description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OCR failed" });
  }
});

app.listen(4000, () => {
  console.log("🚀 OCR server running on http://localhost:4000");
});
