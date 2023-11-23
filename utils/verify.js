const statusCode = require("http-status");
async function isUser(req, res, next) {
  if (req.user) {
    next(); // continue to processing
  } else {
    return res.status(statusCode.PROXY_AUTHENTICATION_REQUIRED).json({
      message: "Authenticatication require",
    });
  }
}

const isAdmin = async (req, res, next) => {
  const user = req.user;
  if (user && req.user.role === "admin") {
    next(); // continue to processing
  } else {
    return res.status(statusCode.PROXY_AUTHENTICATION_REQUIRED).json({
      message: "you are not authenticated",
    });
  }
};

module.exports = { isUser, isAdmin };
