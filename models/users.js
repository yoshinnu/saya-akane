'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define('users', {
    user_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  users.associate = function(models) {
    // associations can be defined here
    users.hasMany(models.diaries);
  };
  return users;
};
