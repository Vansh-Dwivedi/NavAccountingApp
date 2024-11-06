const AuditLog = require('../models/AuditLog');
const { getIO } = require('../utils/socket');

const auditMiddleware = (action) => {
  return async (req, res, next) => {
    const originalJson = res.json;
    
    res.json = async function (data) {
      try {
        const userId = req.user?.id;
        if (userId) {
          const auditLog = new AuditLog({
            user: userId,
            action,
            details: typeof data === 'object' ? 
              (data.message || data.details || 'Action completed successfully') : 
              data
          });
          await auditLog.save();
          
          try {
            const io = getIO();
            const populatedLog = await AuditLog.findById(auditLog._id).populate('user', 'username');
            io.emit('newAuditLog', populatedLog);
          } catch (socketError) {
            console.error('Socket emission error:', socketError);
          }
        }
      } catch (error) {
        console.error('Audit logging error:', error);
      }
      return originalJson.apply(res, arguments);
    };

    next();
  };
};

module.exports = auditMiddleware; 