exports.validated = f => {
    return async (req, res) => {
        try {
            let ret = await f(req, res);
            res.status(200).send(ret);
        } catch (e) {
            res.status(e.status || 500).send(e.message);
            console.error(e);
        }
    };
};

exports.ok = (v, msg) => {
    msg = msg ? ". " + msg : "";
    if (typeof v === "undefined") {
        throw {
            message: "AssertionError [ERR_ASSERTION]: undefined" + msg,
            status: 400
        };
    }
    if (typeof v === "boolean" && !v) {
        throw {
            message: "AssertionError [ERR_ASSERTION]: false" + msg,
            status: 400
        };
    }
};

exports.okPoint = (p, msg) => {
    exports.ok(p, msg);
    exports.ok(p.x, msg);
    exports.ok(p.y, msg);
};