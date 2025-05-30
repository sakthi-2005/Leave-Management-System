const express = require('express');
const db = require('../db');
const router = express.Router();
const { UserRepo,LeaveRequestRepo,LeaveBalanceRepo } = require('../db');

router.patch('/accept-request', async (req, res) => {

  const { userId, reqId } = req.body;

  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {

      const leaveRequest = await LeaveRequestRepo.findOne({
        where: { id: reqId },
      });

      if (!leaveRequest) throw new Error('Leave request not found');
      const currentApprover = await UserRepo.findOne({
        where: { id: leaveRequest.current_waiting },
      });

      if (!currentApprover) throw new Error('Current approver not found');

      const isFinalStep = leaveRequest.steps_required === leaveRequest.steps_completed + 1; 

      leaveRequest.status = isFinalStep ? 'approved' : 'pending';
      leaveRequest.current_waiting = isFinalStep ? null : currentApprover.reporting_manager_id;
      leaveRequest.approved_by = isFinalStep ? userId : null;
      leaveRequest.steps_completed += 1;
      await LeaveRequestRepo.save(leaveRequest); // Update the leave request status and approver

    const leaveBalance = await LeaveBalanceRepo.findOne({
      where: {
        user_id: leaveRequest.user_id,
        leave_type_id: leaveRequest.leave_type_id,
      },
    });

    if (!leaveBalance) throw new Error('Leave balance not found');

    leaveBalance.leave_taken += leaveRequest.no_of_days;
    leaveBalance.balance -= leaveRequest.no_of_days;

    await LeaveBalanceRepo.save(leaveBalance); // Update the leave balance


    // const [rows] = await db.query(`UPDATE leave_requests rr
    //                                       JOIN users u ON u.id = rr.current_waiting
    //                                       SET 
    //                                         rr.status = CASE 
    //                                                       WHEN rr.steps_required = rr.steps_completed + 1 THEN 'approved' 
    //                                                       ELSE 'pending' 
    //                                                   END,
    //                                         rr.current_waiting = CASE 
    //                                                               WHEN rr.steps_required = rr.steps_completed + 1 THEN NULL 
    //                                                               ELSE u.reporting_manager_id
    //                                                             END,
    //                                         rr.approved_by = CASE 
    //                                                           WHEN rr.steps_required = rr.steps_completed + 1 THEN ?
    //                                                           ELSE NULL
    //                                                         END,
    //                                         rr.steps_completed = rr.steps_completed + 1
    //                                       WHERE rr.id = ? `,[userId,reqId]);

    // await db.query(`UPDATE leave_balances lb
    //                 JOIN leave_requests lr ON lr.user_id = lb.user_id AND lr.leave_type_id = lb.leave_type_id
    //                 SET lb.leave_taken = lb.leave_taken + lr.no_of_days , lb.balance = lb.balance - lr.no_of_days
    //                 WHERE lr.id = ?`,[reqId])

    
    res.json({ status: 'updated' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to acceptRequest' });
  }
});

module.exports = router;
