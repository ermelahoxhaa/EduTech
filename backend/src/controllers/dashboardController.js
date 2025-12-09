const DashboardService = require("../services/DashboardService");

exports.getAdminDashboard = async (req, res) => {
  try {
    const stats = await DashboardService.getAdminStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json(err);
  }
};
