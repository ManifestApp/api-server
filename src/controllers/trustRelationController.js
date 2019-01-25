const trustModel = require("../database/trustModel");
const guid = require("../utils/guid").guid;
const { validated, ok } = require("../utils/validation");

exports.findByProtester = validated(req => {
    return trustModel.findByProtester(req.currentUserId);
});

exports.create = validated(async req => {
    let relation = {
        id: guid(),
        truster: req.currentUserId,
        creationDate: new Date(),
        expirationDate: req.body.expirationDate
    };

    await trustModel.createTrustRelation(relation);
    return relation;
});

exports.updateRelationDate = validated(async req => {
    let relation = await trustModel.findById(req.params.relationId);
    // can't update a non-existing relation
    ok(relation, "Invalid field: relationId");

    // can't update someone else's relation
    ok(relation.truster === req.currentUserId, "Unauthorized");

    relation.expirationDate = req.body.expirationDate;
    await trustModel.updateExpiration(relation.id, relation.expirationDate);
    return relation;
});

exports.fulfill = validated(async req => {
    let relation = await trustModel.findById(req.params.relationId);

    // can't fulfill a non-existing relation
    ok(relation, "Invalid field: relationId");

    // can't fulfill a fulfilled relation
    ok(typeof relation.trustee === "undefined", "Invalid field: relationId");

    relation.trustee = req.currentUserId;
    await trustModel.fulfillTrustRelation(relation.id, relation.trustee);
    return relation;
});

exports.delete = validated(async req => {
    let relation = await trustModel.findById(req.params.relationId);

    // can't delete a non-existing relation
    ok(relation, "Invalid field: relationId");

    // can't delete someone else's relation
    ok(relation.trustee === req.currentUserId || relation.truster === req.currentUserId, "Unauthorized");
    await trustModel.delete(relation.id);
});