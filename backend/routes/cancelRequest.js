const express = require('express');
const db = require('../db');
const router = express.Router();
const { LeaveBalanceRepo , LeaveRequestRepo } = require('../db');

router.delete('/deleteRequest', async (req, res) => {

    const lrId = req.query.lrId;
    if (!lrId) return res.status(400).json({ error: 'Missing lrId' });

  try {
        const leaveRequest = await LeaveRequestRepo.findOne({
          where: { id: lrId },
          relations: ['user', 'leaveType']
        });

        if (!leaveRequest) {
          throw new Error('Leave request not found');
        }

        if(leaveRequest.status !== 'approved') {
          await LeaveBalanceRepo
            .createQueryBuilder()
            .update('leave_balances')
            .set({
              balance: () => `balance + ${leaveRequest.no_of_days}`,
              leave_taken: () => `leave_taken - ${leaveRequest.no_of_days}`
            })
            .where('user_id = :userId', { userId: leaveRequest.user.id })
            .andWhere('leave_type_id = :leaveTypeId', { leaveTypeId: leaveRequest.leaveType.id })
            .execute();
        }
        await LeaveRequestRepo.delete({ id: lrId });

    res.json({ status: 'deleted successfully' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
