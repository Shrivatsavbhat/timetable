module.exports = function requireCR(req, res, next) {
    if (req.session?.user?.role !== 'CR') {
        return res.status(403).json({
            success: false,
            message: 'Only the Class Representative can perform this action'
        });
    }

    next();
};
