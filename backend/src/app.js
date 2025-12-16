import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import notificationRoutes from "./routes/notifications.js";
import coursesRoutes from "./routes/courses.js";
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not set in environment variables!');
  console.error('Please create a .env file in the backend directory with:');
  console.error('JWT_SECRET=your_secret_key_here');
  process.exit(1);
}

const app = express();

app.use(cors({
  origin: "http://localhost:8080",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Backend is ready!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend is working on port ${PORT}`);
});
