const express = require("express");
const db = require("../db");
const router = express.Router();
const { LeaveRequestRepo } = require("../db");

router.get("/calendarLeaves", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const rawData = await LeaveRequestRepo.createQueryBuilder("lr")
      .innerJoin("lr.user", "u")
      .innerJoin("lr.leaveType", "lt")
      .addSelect("u.name", "u_name")
      .addSelect("lt.name", "Type")
      .where("u.reporting_manager_id = :userId", { userId })
      .andWhere("lr.status = :status", { status: "approved" })
      .getRawMany();

    // const [rows] = await db.query(`SELECT lr.* , u.name , lt.name as Type
    //                                     FROM leave_requests lr
    //                                     JOIN users u ON lr.user_id = u.id
    //                                     JOIN leave_types lt on lt.id = lr.leave_type_id
    //                                     WHERE u.reporting_manager_id = ?
    //                                     AND lr.status = 'approved';
    //                                     `,[userId]);

    const rows = rawData.map((row) => {
      const result = {};
      for (const key in row) {
        result[key.startsWith("lr_") ? key.slice(3) : key] = row[key];
      }
      return result;
    });

    res.json({ leaves: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch leaves" });
  }
});

module.exports = router;
