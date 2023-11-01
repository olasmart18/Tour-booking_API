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

const isAdmin = async (req, res, next) => {
    const user = req.user;
    if (req.user.role !== "admin") {
        return res.status(statusCode.BAD_GATEWAY).json({
            message: "you are not authenticated"
        })
    } else {
        next()
    }
}

const logRoute = async (req, res, next) => {
    if (!req.originalUrl) {
        console.log('not a valid route');
    } else {
        console.log(req.originalUrl);
        next()
    }
}

module.exports = { isUser, isAdmin, logRoute };