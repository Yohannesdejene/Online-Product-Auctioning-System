'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Banker.init({
    id:{
      type: DataTypes.STRING,
      primaryKey:true}
  },
   {
    sequelize,
    modelName: 'Banker',
  });
  return Banker;
};