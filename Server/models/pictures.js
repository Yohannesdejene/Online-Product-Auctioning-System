'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pictures extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Product}) {
      Pictures.belongsTo(Product);
      // define association here
    }
  }
  Pictures.init({
    id:{ 
      type:DataTypes.STRING,
      primaryKey:true}
  }, {
    sequelize,
    modelName: 'Pictures',
  });
  return Pictures;
};