import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import cors from "cors";
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

const app = express();
const upload = multer({ dest: path.resolve("./server/uploads") });
app.use(cors());
app.use(express.json());

// In-memory document store: { id: { filename, pages: [text] } }
const docs = {};

function ensureUploadsDir() {
  const dir = path.resolve("./server/uploads");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureUploadsDir();

async function extractPages(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const strings = textContent.items.map((s) => s.str);
    pages.push(strings.join(" "));
  }
  return pages;
}

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "no file" });
    const id = path.parse(file.filename).name;
    const dest = path.resolve(file.path);
    const pages = await extractPages(dest);
    docs[id] = { filename: file.originalname, pages, path: dest };
    return res.json({
      id,
      filename: file.originalname,
      pageCount: pages.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

app.get("/file/:id", (req, res) => {
  const id = req.params.id;
  const doc = docs[id];
  if (!doc) return res.status(404).json({ error: "not found" });
  res.sendFile(doc.path);
});

app.get("/doc/:id/pages", (req, res) => {
  const id = req.params.id;
  const doc = docs[id];
  if (!doc) return res.status(404).json({ error: "not found" });
  res.json({ pageCount: doc.pages.length });
});

// Simple naive retrieval: rank pages by keyword matches
app.post("/query", (req, res) => {
  try {
    const { id, query } = req.body;
    if (!id || !query)
      return res.status(400).json({ error: "id and query required" });
    const doc = docs[id];
    if (!doc) return res.status(404).json({ error: "doc not found" });
    const qTokens = query
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);

    const scores = doc.pages.map((text, idx) => {
      const t = text.toLowerCase();
      let score = 0;
      for (const tok of qTokens) {
        if (t.includes(tok)) score += 1;
      }
      return { idx: idx + 1, score, snippet: t.slice(0, 800) };
    });

    scores.sort((a, b) => b.score - a.score);
    const top = scores.filter((s) => s.score > 0).slice(0, 3);

    let answer = "";
    if (top.length === 0) {
      // fallback: return first page excerpt
      answer = doc.pages[0].slice(0, 1000);
    } else {
      answer = top.map((t) => `Page ${t.idx}: ${t.snippet}`).join("\n\n");
    }

    const citations = top.map((t) => ({ page: t.idx }));

    res.json({ answer, citations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
