'use strict';
module.exports = (sequelize, DataTypes) => {
  var diaries = sequelize.define('diaries', {
    diary_title: DataTypes.STRING,
    diary_body: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  diaries.associate = function(models) {
    // associations can be defined here
    diaries.belongsTo(models.users);
  };
  return diaries;
};
