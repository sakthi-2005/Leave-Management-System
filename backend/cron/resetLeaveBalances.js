const cron = require("node-cron");
const { LeaveBalanceRepo, LeaveTypeRepo } = require("../db");

cron.schedule("0 0 1 * *", async () => {
  try {
    const leaveTypes = await LeaveTypeRepo.find({
      select: ["id", "monthly_allocation"],
    });

    for (const type of leaveTypes) {
      await LeaveBalanceRepo.createQueryBuilder()
        .update()
        .set({ balance: type.monthly_allocation })
        .where("leave_type_id = :id", { id: type.id })
        .execute();
    }
    console.log("Leave balances reset successfully");
  } catch (err) {
    console.error("Error resetting leave balances:", err);
  }
});
