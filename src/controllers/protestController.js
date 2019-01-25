const protestModel = require("../database/protestModel");

const guid = require("../utils/guid").guid;
const { validated, ok, okPoint } = require("../utils/validation");

let validateProtest = protest => {
    ok(protest.title, "Missing field: title");
    okPoint(protest.startingPosition, "Invalid field: startingPosition");
    ok(protest.startingTime, "Missing field: startingTime");
};

exports.create = validated(async req => {
    let protest = req.body;
    protest.id = guid();

    // can't create a protest for another user
    ok(req.currentUserId === protest.creator, "Invalid field: creator");

    validateProtest(protest);

    await protestModel.create(protest);
    return protest;
});

exports.update = validated(async req => {
    let protest = req.body;
    let oldProtest = await protestModel.findById(protest.id);

    // can't update if protest doesn't exist
    ok(oldProtest, "Invalid field: id");

    // user shouldn't try to change the creator
    ok(protest.creator === oldProtest.creator, "Invalid field: creator");

    // current user should be the creator of the protest
    ok(req.currentUserId === protest.creator, "Unauthorized");

    validateProtest(protest);

    await protestModel.create(protest);
    return protest;
});

exports.delete = validated(async req => {
    let id = req.params.protestId;

    // can't delete a non-existing protest
    let protest = await protestModel.findById(id);
    ok(protest, "Invalid field: protestId");

    // can't delete a protest owned by someone else
    ok(req.currentUserId === protest.creator, "Unauthorized");

    await protestModel.delete(id);
});

exports.findByLocation = validated(async req => {
    let upperLeft = req.body.upperLeft;
    let lowerRight = req.body.lowerRight;

    okPoint(upperLeft, "Invalid field: upperLeft");
    okPoint(lowerRight, "Invalid field: lowerRight");

    return protestModel.findInFutureWithin(upperLeft, lowerRight);
});

exports.findByCreator = validated(async req => {
    return protestModel.findByCreator(req.currentUserId);
});