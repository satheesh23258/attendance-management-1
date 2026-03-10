import AuditLog from '../models/AuditLog.js';

/**
 * Logs a system action to the database
 * @param {Object} req - Express request object
 * @param {String} action - Action name (e.g., 'EDIT_EMPLOYEE')
 * @param {String} module - Module name (e.g., 'Attendance')
 * @param {Object} details - Additional data/metadata
 */
export const logAudit = async (req, action, module, details = {}) => {
  try {
    const auditRecord = new AuditLog({
      userId: req.user?._id,
      userName: req.user?.name || 'System',
      userRole: req.user?.role || 'Guest',
      action,
      module,
      details,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });
    
    await auditRecord.save();
    console.log(`[AUDIT] ${action} performed by ${req.user?.name || 'System'} in ${module}`);
  } catch (error) {
    console.error('[AUDIT] Failed to save log:', error.message);
  }
};
