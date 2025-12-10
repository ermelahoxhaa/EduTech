import express from "express";
import cors from "cors";

const app = express();

const notificationRoutes = require('./routes/notification');
app.use('/api/notifications', notificationRoutes);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend është gati dhe punon!");
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend po funksionon në portin ${PORT}`);
});
