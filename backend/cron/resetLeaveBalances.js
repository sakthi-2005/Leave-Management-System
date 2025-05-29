const cron = require('node-cron');
const db = require('../db');

cron.schedule('0 0 1 * *', async () => {
  try {
    const [types] = await db.query('SELECT id, monthly_allocation FROM leave_types');
    for (const type of types) {
      await db.query('UPDATE leave_balances SET balance = ? WHERE leave_type_id = ?', [type.monthly_allocation, type.id]);
    }
    console.log('Leave balances reset successfully');
  } catch (err) {
    console.error('Error resetting leave balances:', err);
  }
});
