'use strict';
module.exports = (sequelize, DataTypes) => {
  var communities = sequelize.define('communities', {
    community_title: DataTypes.STRING,
    owner: DataTypes.STRING
  }, {
    underscored: true,
  });
  communities.associate = function(models) {
    // associations can be defined here
  };
  return communities;
};
