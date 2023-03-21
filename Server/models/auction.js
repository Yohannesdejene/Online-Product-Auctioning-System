'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Product,Category,Buyer,Bid,Notification,Transaction,Seller}) {
      Auction.hasOne(Product);
      Auction.belongsTo(Category);
      Auction.belongsTo(Seller);
      Auction.belongsToMany(Buyer,{through:Bid})
      Auction.hasMany(Transaction);
    }
  }
  Auction.init({
    id:{
      type: DataTypes.STRING,
      primaryKey:true
    },
    startdate:{
      type: DataTypes.DATE,
      allowNull:false
    },
    enddate:{ 
      type:DataTypes.DATE,
      allowNull:false
    },
    hammerprice:{ 
      type:DataTypes.STRING,
      allowNull:true
    },
    state:{ 
      type: DataTypes.STRING,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Auction',
  });
  return Auction;
};