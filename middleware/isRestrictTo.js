const isRestrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "You dont have permission to do this",
      });
    }
    next();
  };
};

module.exports = isRestrictTo;
