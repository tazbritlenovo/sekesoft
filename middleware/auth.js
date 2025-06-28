const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'sekret_super_i_forte';

module.exports = function (allowedRoles = []) {
  return (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Tokeni mungon' });

    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
      req.user = decoded;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Nuk ke akses' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Token i pavlefshëm' });
    }
  };
};
