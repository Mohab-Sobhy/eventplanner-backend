function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  };
}

module.exports = authorizeRoles;