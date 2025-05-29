const { Worker } = require('bullmq');
const db = require('../db');


new Worker('addUser', async (job) => {
    const { users } = job.data;

    for (const user of users) {
        try {
            const [rows] = await db.query('SELECT id FROM positions WHERE name = ?', [user.position]);

            if (rows.length === 0) {
                throw new Error('No matching in TableB');
            }
            const Id = rows[0].id;

            const [user_id] = await db.query(`SELECT MAX(id) as ID from users`);

            await db.execute(
                'INSERT INTO users (id, name, email, password, role_id, reporting_manager_id, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [user_id[0].ID+1 , user.name, user.email, user.password, Id , Number(user.ManagerId), Boolean(user.isAdmin)]
            );
        } catch (err) {
            console.error('Insert failed:', err.message);
        }
    }
}, { connection: {port: 6379, host: '127.0.0.1' ,maxRetriesPerRequest: null} });
