var DataTypes = require("sequelize").DataTypes;
var _board = require("./board");
var _board_comment = require("./board_comment");
var _sessions = require("./sessions");
var _user = require("./user");

function initModels(sequelize) {
  var board = _board(sequelize, DataTypes);
  var board_comment = _board_comment(sequelize, DataTypes);
  var sessions = _sessions(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  board.belongsTo(user, { as: "id_user", foreignKey: "id"});
  user.hasMany(board, { as: "boards", foreignKey: "id"});
  board_comment.belongsTo(board, { as: "board", foreignKey: "board_id"});
  board.hasMany(board_comment, { as: "board_comments", foreignKey: "board_id"});

  return {
    board,
    board_comment,
    sessions,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
