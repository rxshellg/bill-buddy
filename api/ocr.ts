import type { VercelRequest, VercelResponse } from "@vercel/node";
import formidable from "formidable";
import fs from "node:fs/promises";

export const config = {
  api: {
    bodyParser: false,
    maxDuration: 10
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const apiKey = process.env.GOOGLE_VISION_CREDENTIALS;
  if (!apiKey) return res.status(500).json({ error: "Missing GOOGLE_VISION_CREDENTIALS" });

  try {
    // Parse the uploaded file (field name: "file")
    const form = formidable({
      multiples: false,
      maxFileSize: 8 * 1024 * 1024,
      filter: (part) =>
        part.mimetype ? /^image\/(png|jpe?g|webp)$/i.test(part.mimetype) : false
    });

    const { files }: any = await new Promise((resolve, reject) =>
      form.parse(req, (err, _fields, files) => (err ? reject(err) : resolve({ files })))
    );

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file?.filepath) return res.status(400).json({ error: "No file uploaded" });

    const buf = await fs.readFile(file.filepath);
    const content = buf.toString("base64");

    // Call Google Vision REST API (TEXT_DETECTION)
    const r = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content },
              features: [{ type: "TEXT_DETECTION" }]
            }
          ]
        })
      }
    );

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: text });
    }

    const data: any = await r.json();
    const resp = data?.responses?.[0] ?? {};
    const text =
      resp?.fullTextAnnotation?.text ??
      resp?.textAnnotations?.[0]?.description ??
      "";

    if (!text) return res.status(200).json({ text: "", warning: "No text found" });
    return res.status(200).json({ text });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "OCR failed" });
  }
}