const { EntitySchema } = require("typeorm");


const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true, 
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role_id: {
      name: "role_id",
      type: Number,
    },
    reporting_manager_d: {
      name: "manager_id",
      type: Number,
      nullable: true, 
    },
    isAdmin: {
      type: Boolean,
    },
  },
  relations: {
    manager: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "reporting_manager_id",
      },
      inverseSide: "directReports",
    },
    directReports: {
      type: "one-to-many",
      target: "User",
      inverseSide: "manager",
    },
    position: {
      type: "many-to-one",
      target: "Position",
      joinColumn: {
        name: "role_id",
      },
      inverseSide: "users",
    },
    leaveRequests: {
      type: "one-to-many",
      target: "LeaveRequest",
      inverseSide: "user",
    },
    leaveBalances: {
      type: "one-to-many",
      target: "LeaveBalance",
      inverseSide: "user",
    },
    leaveApprovals: {
      type: "one-to-many",
      target: "LeaveRequest",
      inverseSide: "approver",
    },
    leaveRejections: {
      type: "one-to-many",
      target: "LeaveRequest",
      inverseSide: "rejectedBy",
    },
    leaveCurrentApprovals: {
      type: "one-to-many",
      target: "LeaveRequest",
      inverseSide: "currentWaiting",
    },
  },
});

module.exports = { User };