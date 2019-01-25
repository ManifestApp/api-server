const access = require("./access");

let to_json = "to_json(id, truster, trustee, creation_date as creationDate, expiration_date as epirationDate)";

exports.createTrustRelation = (relation) => access.pool().query(
    "insert into protestor_trust_relation values ($1, $2, $3, $4, null) on conflict do nothing",
    [relation.id, relation.truster, relation.creationDate, relation.expirationdDate]);

exports.delete = id => access.pool().query("delete from protestor_trust_relation where id = $1", [id]);

exports.updateExpiration = (id, expirationDate) => access.pool().query(
    "update protestor_trust_relation set expiration_date = $2 where id = $1",
    [id, expirationDate]);

exports.fulfillTrustRelation = (relationId, trusteeId) => access.pool().query(
    "update protestor_trust_relation set trustee = $2 where id = $1",
    [relationId, trusteeId]);

exports.findByProtester = async protesterId => {
    let response = await access.pool().query(
        `select ${to_json} from protestor_trust_relation where trustee = \$1 or truster = \$1`,
        [protesterId]);
    return response.rows;
};

exports.findById = async id => {
    let response = await access.pool().query(`select ${to_json} from protestor_trust_relation where id = \$1`, [id]);
    return response.rows[0];
};