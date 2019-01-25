const protesterModel = require("../database/protesterModel");
const protestModel = require("../database/protestModel");

const guid = require("../utils/guid").guid;
const { validated, ok } = require("../utils/validation");

exports.create = validated(async req => {
    let protester = req.body;
    protester.id = guid();
    protester.authToken = guid();

    ok(protester.deviceToken, "Missing field: deviceToken");

    await protesterModel.create(protester);
    return protester;
});

exports.update = validated(async req => {
    let protester = req.body;

    // can't edit another user
    ok(req.currentUserId === protester.id, "Unauthorized");
    await protesterModel.update(protester);
});

exports.delete = validated(async req => {
    await protesterModel.delete(req.currentUserId);
});

exports.joinProtest = validated(async req => {
    let protesterId = req.currentUserId;

    // can't join a non-existing protest
    let protestId = req.params.protestId;
    ok(protestId, "Missing field: protestId");
    ok(await protestModel.findById(protestId), "Invalid field: protestId");

    await protesterModel.joinProtest(protesterId, protestId);
});