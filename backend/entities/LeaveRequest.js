const {  EntitySchema } = require("typeorm");

const LeaveRequest = new EntitySchema({
    name: "LeaveRequest",
    tableName: "leave_requests",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        userId: {
            name: "user_id",
            type: Number,
            nullable: false,
        },
        leaveTypeId: {
            name: "leave_type_id",
            type: Number,
            nullable: false,
        },
        description: {
            type: String,
            nullable: true,
        },
        status: {
            type: String,
            default: "pending",
        },
        stepsCompleted: {
            name: "steps_completed",
            type: Number,
            default: 0,
        },
        stepsRequired: {
            name: "steps_required",
            type: Number,
            default: 1,
        },
        rejectionReason: {
            type: String,
            nullable: true,
        },
        createdAt: {
            name: "created_at",
            type: Date,
            default: () => "CURRENT_TIMESTAMP",
        },
        approvedAt: {
            name: "approved_at",
            type: Date,
            nullable: true,
        },
        approvedBy: {
            name: "approved_by",
            type: Number,
            nullable: true,
        },
        rejectedBy: {
            name: "rejected_by",
            type: Number,
            nullable: true,
        },
        currentWaiting: {
            name: "current_waiting",
            type: Number,
            nullable: true,
        },
        noOfDays: {
            name: "no_of_days",
            type: Number,
            nullable: false,
        },
        startDate: {
            type: Date,
            nullable: false,
        },
        endDate: {
            type: Date,
            nullable: false,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: {
                name: "user_id",
            },
            inverseSide: "leaveRequests",
        },
        leaveType: {
            type: "many-to-one",
            target: "LeaveType",
            joinColumn: {
                name: "leave_type_id",
            },
            inverseSide: "leaveRequests",
        },
        approver: {
            type: "many-to-one",
            target: "User",
            joinColumn: {
                name: "approved_by",
            },
            inverseSide: "leaveApprovals",
        },
        rejector: {
            type: "many-to-one",
            target: "User",
            joinColumn: {
                name: "rejected_by",
            },
            inverseSide: "leaveRejections",
        },
        currentApprover: {
            type: "many-to-one",
            target: "User",
            joinColumn: {
                name: "current_waiting",
            },
            inverseSide: "leaveCurrentApprovals",
        },
    },
});

module.exports = LeaveRequest;