import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: 'http://localhost:8080', 
  credentials: true
}));

app.use(express.json());

import notificationRoutes from './routes/notifications.js';
app.use('/api/notifications', notificationRoutes);

app.get("/", (req, res) => {
  res.send("Backend është gati dhe punon!");
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend po funksionon në portin ${PORT}`);
});
