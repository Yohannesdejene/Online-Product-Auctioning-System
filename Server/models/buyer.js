'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Buyer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Bid,Auction,Payment,Transaction,Notification}) {
      Buyer.belongsToMany(Auction,{through:Bid})
      Buyer.hasMany(Notification);
      Buyer.hasMany(Payment);
      Buyer.hasMany(Transaction);
      // define association here
    }
  }
  Buyer.init(
    {
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
      type:{ 
        type:DataTypes.STRING,
        allowNull:false
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
    },
   {
    sequelize,
    modelName: 'Buyer',
  });
  return Buyer;
};