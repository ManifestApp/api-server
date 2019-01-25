const protesterModel = require("../database/protesterModel");

exports.middleware = (req, res, next) => {
    // TODO: decode base 64
    // TODO: check unauthorized status
    let authStr = req.headers["authorization"];
    if (!authStr) {
        res.status(400).send("Authorization header required");
    }

    let auth;
    try {
        auth = JSON.parse(authStr);
        if (!auth.id || !auth.authToken) throw null;
    } catch (e) {
        res.status(400).send("Authentication failed");
    }

    protesterModel.auth({
        id: auth.id,
        authToken: auth.authToken
    }).then(valid => {
        if (valid) {
            req.currentUserId = auth.id;
            next();
        } else {
            res.status(400).send("Authentication failed");
        }
    }).catch(() => res.status(400).send("Authentication failed"));
};