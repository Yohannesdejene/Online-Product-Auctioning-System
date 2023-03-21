'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Auction}) {
      Seller.hasMany(Auction);
      // define association here
    }
  }
  Seller.init({
    id: {
      type:DataTypes.STRING,
      primaryKey:true,
      
    },
    fname: {
      type:DataTypes.STRING,
      allowNull:true
    },
    lname: {
      type:DataTypes.STRING,
      allowNull:true
    },
    phonenumber: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    email: {
      type:DataTypes.STRING,
      allowNull:true
    },
    city:{ 
      type:DataTypes.STRING,
      allowNull:true
    },
    password:{ 
      type:DataTypes.STRING,
      allowNull:false,
    },
    account:{ 
      type:DataTypes.STRING,
      allowNull:true
    },
    region:{ 
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'Seller',
  });
  return Seller;
};