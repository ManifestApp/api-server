const access = require("./access");

let to_json = "to_json(id, title, description, creator, image_url as imageUrl, starting_position as startingPosition, starting_time as startingTime)";

exports.create = protest => access.pool().query(
    "insert into protest values ($1, $2, $3, $4, $5, $6, $7) on conflict do nothing",
    [protest.id, protest.creator, protest.title, protest.description, protest.imageUrl, protest.startingPosition, protest.startingTime]);

exports.update = protest => access.pool().query(
    "update protest set title=$2, description=$3, image_url=$4, starting_position=$5, starting_time=$6 where id = $1",
    [protest.id, protest.title, protest.description, protest.imageUrl, protest.startingPosition, protest.startingTime]);

exports.delete = id => access.pool().query("delete form protest where id = $1", [id]);

exports.findById = async id => {
    let response = await access.pool().query(`select ${to_json} from protest where id = \$1`, [id]);
    return response.rows[0];
};

exports.findByCreator = async protesterId => {
    let response = await access.pool().query(`select ${to_json} from protest where creator = \$1`, [protesterId]);
    return response.rows;
};

exports.findInFutureWithin = async (upperLeft, lowerRight) => {
    let response = await access.pool().query(
        `select ${to_json} from protest where starting_position >= ($1, $2) and starting_position <= (\$3, \$4) and starting_time > now()`,
        [upperLeft.x, upperLeft.y, lowerRight.x, lowerRight.y]);
    return response.rows;
};