const access = require("./access");

exports.create = protester => access.pool().query(
    "insert into protester values ($1, $2, $3, $4) on conflict do nothing",
    [protester.id, protester.nickname, protester.authToken, protester.deviceToken]);

exports.update = protester => access.pool().query(
    "update protester set device_token = $2, nickname = $3 where id = $1",
    [protester.id, protester.deviceToken, protester.nickname]);

exports.auth = async protester => {
    let response = await access.pool().query(
        "select count(*) = 1 as result from protester where id = $1 and auth_token = $2",
        [protester.id, protester.authToken]);
    return response.rows[0]["result"];
};

exports.delete = id => access.pool().query("delete from protester where id = $1", [id]);

exports.joinProtest = (protesterId, protestId) => access.pool().query(
    "insert into protestor_in_protest values ($1, $2) on conflict do nothing",
    [protesterId, protestId]);