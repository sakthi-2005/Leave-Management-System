const { Worker } = require('bullmq');
const { UserRepo , PositionRepo } = require('../db');


new Worker('addUser', async (job) => {
    const { users } = job.data;

    for (const user of users) {
        try {

            const position = await PositionRepo.findOneBy({ name: user.position });
            if (!position) throw new Error('Position not found');

            const latest = await UserRepo
                .createQueryBuilder('u')
                .select('MAX(u.id)', 'max')
                .getRawOne();


            const newUser = UserRepo.create({
                id: latest.max + 1,
                name: user.name,
                email: user.email,
                password: user.password,
                role_id: position.id,
                reporting_manager_id: Number(user.ManagerId),
                isAdmin: Boolean(user.isAdmin),
            });

            await UserRepo.save(newUser);

            // const [rows] = await db.query('SELECT id FROM positions WHERE name = ?', [user.position]);

            // if (rows.length === 0) {
            //     throw new Error('No matching in TableB');
            // }
            // const Id = rows[0].id;

            // const [user_id] = await db.query(`SELECT MAX(id) as ID from users`);

            // await db.execute(
            //     'INSERT INTO users (id, name, email, password, role_id, reporting_manager_id, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)',
            //     [user_id[0].ID+1 , user.name, user.email, user.password, Id , Number(user.ManagerId), Boolean(user.isAdmin)]
            // );
        } catch (err) {
            console.error('Insert failed:', err.message);
        }
    }
}, { connection: {port: 6379, host: '127.0.0.1' ,maxRetriesPerRequest: null} });
