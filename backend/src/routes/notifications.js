const router = require("express").Router();
const notif = require("../controllers/notificationController");

router.post("/", notif.createNotification);
router.get("/", notif.getNotifications);

module.exports = router;
