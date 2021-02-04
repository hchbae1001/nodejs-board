const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('board', {
    board_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(4000),
      allowNull: false
    },
    board_comment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'board',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "board_id" },
        ]
      },
      {
        name: "fk_id_board",
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
