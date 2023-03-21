'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClosedBid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClosedBid.init({
    id: {
      type:DataTypes.STRING,
      primaryKey:true}
  }, {
    sequelize,
    modelName: 'ClosedBid',
  });
  return ClosedBid;
};