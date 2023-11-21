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

const logRoute = async (req, res, next) => {
  if (!req.originalUrl) {
    console.log("not a valid route");
  } else {
    console.log(req.originalUrl);
    next();
  }
};

module.exports = { isUser, isAdmin, logRoute };
