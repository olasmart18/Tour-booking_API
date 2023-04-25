const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'you are not authorized'
    });
  }
  // verify token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (!err) {
      req.user = user;
      next();
    } else {
      return res.status(404).json({
        success: false,
        message: 'invalid token'
      });
    }
  });
};

// verify if it a legal user or admin
exports.verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.role === 'admin') {
      console.log(req.user.id, req.params.id);
      next();
    }
    return res.status(401).json({
      success: false,
      message: 'you are not authenticated'
    });
  });
};

// verify admin
exports.verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.role === 'admin') {
      next();
    }
    return res.status(401).json({
      success: false,
      message: 'you are not authenticated'
    });
  });
};
