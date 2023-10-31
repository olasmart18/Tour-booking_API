const statusCode = require("http-status");
async function isUser (req, res, next)  {
const user = req.user;
if (!user) {
    return res.status(statusCode.BAD_REQUEST).json({
        message: "Authenticatication require"
    })
} else {
    next();
}
}

module.exports = isUser ;