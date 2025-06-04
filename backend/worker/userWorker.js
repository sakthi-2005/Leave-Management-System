const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const { Worker } = require("bullmq");
const {
  UserRepo,
  PositionRepo,
  LeaveBalanceRepo,
  LeaveTypeRepo,
  initializeDatabase,
} = require("../db");

new Worker(
  "addUser",
  async (job) => {
    await initializeDatabase();
    const { users } = job.data;

    for (const user of users) {
      try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        const position = await PositionRepo.findOneBy({ name: user.position });

        if (!position) throw new Error("Position not found");

        const latest = await UserRepo.createQueryBuilder("u")
          .select("MAX(u.id)", "max")
          .getRawOne();

        const newUser = UserRepo.create({
          id: latest.max + 1,
          name: user.name,
          email: user.email,
          password: user.password,
          role_id: position.id,
          reporting_manager_id: Number(user.ManagerId) || null,
          isAdmin: Boolean(user.isAdmin),
        });

        await UserRepo.save(newUser);

        let leaveTypes = await LeaveTypeRepo.find({
          where: { position_id: position.id },
        });

        const l_latest = await LeaveBalanceRepo.createQueryBuilder("lb")
          .select("MAX(lb.id)", "max")
          .getRawOne();

        for (const leaveType of leaveTypes) {
          l_latest.max = (l_latest.max || 0) + 1;
          const leaveBalance = LeaveBalanceRepo.create({
            id: l_latest.max,
            user_id: newUser.id,
            leave_type_id: leaveType.id,
            balance: leaveType.monthly_allocation,
            leave_taken: 0,
          });
          await LeaveBalanceRepo.save(leaveBalance);
        }
        console.log(`User ${user.name} added successfully.`);
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
        console.error("Insert failed:", err.message);
      }
    }
  },
  { connection: { port: 6379, host: "127.0.0.1", maxRetriesPerRequest: null } },
);
