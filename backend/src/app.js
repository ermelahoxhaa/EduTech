import express from "express";
import cors from "cors";

const app = express();

import notificationRoutes from './routes/notifications.js';
import coursesRoutes from './routes/courses.js';
import usersRoutes from './routes/users.js';

app.use('/api/courses', coursesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is ready!");
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend is working on port ${PORT}`);
});
