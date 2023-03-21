'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Pictures,Auction}) {
      Product.hasMany(Pictures);
      Product.hasOne(Auction);
      // define association here
    }
  }
  Product.init({
    pid: {
      type:DataTypes.STRING,
      primaryKey:true,    
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    description: {
      type:DataTypes.TEXT,
      allowNull:true
    },
    location: {
      type:DataTypes.STRING,
      allowNull:false
    },
    baseprice: {type:DataTypes.STRING},
    id: {type:DataTypes.STRING},
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};