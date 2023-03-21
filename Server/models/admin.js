'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init({
    id: {
      type:DataTypes.STRING,
      primaryKey:true
    },
    email:{
      type:DataTypes.STRING,
      allowNull:true
    },
    phone:{
      type:DataTypes.STRING,
      allowNull:false
    },
    password:{
      type:DataTypes.TEXT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};