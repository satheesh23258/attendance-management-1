import mongoose from 'mongoose';

const hybridPermissionSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  employeeEmail: {
    type: String,
    required: true
  },
  grantedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  grantedByName: {
    type: String,
    required: true
  },
  permissions: {
    canAccessHR: {
      type: Boolean,
      default: true
    },
    canAccessEmployee: {
      type: Boolean,
      default: true
    },
    canViewReports: {
      type: Boolean,
      default: true
    },
    canManageAttendance: {
      type: Boolean,
      default: false
    },
    canManageLeaves: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active'
  },
  grantedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
  },
  lastAccessed: {
    type: Date
  },
  accessCount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for efficient queries
hybridPermissionSchema.index({ employeeId: 1, status: 1 });
hybridPermissionSchema.index({ employeeEmail: 1, status: 1 });

// Method to check if permission is still valid
hybridPermissionSchema.methods.isValid = function() {
  return this.status === 'active' && this.expiresAt > new Date();
};

// Method to update access tracking
hybridPermissionSchema.methods.updateAccess = function() {
  this.lastAccessed = new Date();
  this.accessCount += 1;
  return this.save();
};

// Static method to find active permission for employee
hybridPermissionSchema.statics.findActiveByEmployee = function(employeeId) {
  return this.findOne({ 
    employeeId, 
    status: 'active',
    expiresAt: { $gt: new Date() }
  }).populate('employeeId', 'name email employeeId department');
};

export default mongoose.model('HybridPermission', hybridPermissionSchema);
