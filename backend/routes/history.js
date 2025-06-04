const express = require("express");
const { LeaveRequestRepo } = require("../db");
const router = express.Router();

router.get("/history", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const rawData = await LeaveRequestRepo.createQueryBuilder("lr")
      .leftJoinAndSelect("lr.approver", "approver")
      .leftJoinAndSelect("lr.rejector", "rejector")
      .innerJoinAndSelect("lr.leaveType", "lt")
      .where("lr.user_id = :userId", { userId })
      .select([
        "lr",
        "approver.name AS approver",
        "rejector.name AS rejector",
        "lt.name AS leaveType",
      ])
      .getRawMany();

    const rows = rawData.map((row) => {
      const result = {};
      for (const key in row) {
        result[key.startsWith("lr_") ? key.slice(3) : key] = row[key];
      }
      return result;
    });

    //   const [rows] = await db.query(` SELECT
    //   lr.*,
    //   approver.name AS approved_by_name,
    //   rejector.name AS rejected_by_name,
    //   lt.name as leaveType
    // FROM leave_requests lr
    // LEFT JOIN users approver ON lr.approved_by = approver.id
    // LEFT JOIN users rejector ON lr.rejected_by = rejector.id
    // JOIN leave_types lt ON lr.leave_type_id = lt.id
    // WHERE lr.user_id = ?`,[userId]);

    res.json({ history: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
