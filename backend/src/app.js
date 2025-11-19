import express from "express";
import cors from "cors";

const app = express();

// Aktivizo cors për të lejuar frontend-in
app.use(cors());
app.use(express.json());

// Një route test për të verifikuar që serveri punon
app.get("/", (req, res) => {
  res.send("Backend është gati dhe punon!");
});

// Starto serverin
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend po funksionon në portin ${PORT}`);
});
