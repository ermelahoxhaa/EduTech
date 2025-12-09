const router = require("express").Router();
const controller = require("../controllers/dashboardController");

router.get("/admin", controller.getAdminDashboard);

module.exports = router;
