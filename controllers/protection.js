const rateLimit = require('express-rate-limit');

const limiter = () => {
    return rateLimit({
        windowMS : 1000,
        max : 20
    });
}

module.exports = limiter;