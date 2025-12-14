import express from "express";
import cors from "cors";

import notificationRoutes from "./routes/notifications.js";
import coursesRoutes from "./routes/courses.js";
import usersRoutes from "./routes/users.js";

const app = express();

app.use(cors({
  origin: "http://localhost:8080",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());

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
