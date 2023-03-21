'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Auction,Buyer}) {
      // Bid.belongsTo(Auction);
      // Bid.belongsTo(Buyer);
    }
  }
  Bid.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    bidprice: {type:DataTypes.DOUBLE,allowNull:false},
    biddate: {type:DataTypes.DATE,allowNull:false},
  }, {
    sequelize,
    modelName: 'Bid',
  });
  return Bid;
};