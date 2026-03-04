import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        employeeName: {
            type: String,
            required: true,
        },
        leaveType: {
            type: String,
            required: [true, 'Leave type is required'],
            enum: ['sick', 'casual', 'vacation', 'other'],
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },
        reason: {
            type: String,
            required: [true, 'Reason is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedByName: {
            type: String,
        },
        rejectionReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;
