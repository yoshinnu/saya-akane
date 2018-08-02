'use strict';
module.exports = (sequelize, DataTypes) => {
  var communities_users = sequelize.define('communities_users', {
    community_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  communities_users.associate = function(models) {
    // associations can be defined here
    // foreign key constraint is not added
    models.communities.belongsToMany(models.users, {
      through: communities_users
    });
    models.users.belongsToMany(models.communities, {
      through: communities_users
    });
  };
  return communities_users;
};
