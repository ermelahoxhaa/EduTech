import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "./db.js";
const app = express();

// Aktivizo cors për të lejuar frontend-in
app.use(cors());
app.use(express.json());

// Një route test për të verifikuar që serveri punon
app.get("/", (req, res) => {
  res.send("Backend është gati dhe punon!");
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }
    const user = users[0];
    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, surname: user.surname }});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Register route
app.post("/register", async (req, res) => {
  const { name, surname, email, password } = req.body;
  try {
    // Check if user already exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    // Insert user
    await db.query(
      "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)",
      [name, surname, email, hash]
    );
    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
});

// Starto serverin
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend po funksionon në portin ${PORT}`);
});
