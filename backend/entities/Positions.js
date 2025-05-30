const { EntitySchema } = require("typeorm");

const Position = new EntitySchema({
    name: "Position",
    tableName: "positions",
    columns: {
        id: {
        type: Number,
        primary: true,
        generated: true,
        },
        name: {
        type: String,
        nullable: false,
        }
    },
    relations: {
        users: {
            type: "one-to-many",
            target: "User",
            inverseSide: "position",
        },
        leaveTypes: {
            type: "many-to-many",
            target: "LeaveType",
            inverseSide: "position",
        },
        leaveBalances: {
            type: "one-to-many",
            target: "LeaveBalance",
            inverseSide: "position",
        }
    }
    });

module.exports = Position;