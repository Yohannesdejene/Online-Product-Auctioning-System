const {uid}=require('uid'); 
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
    static associate({Bid,Auction,Payment,Transaction,Notification,Notifyme}) {
      Buyer.belongsToMany(Auction,{through:Bid})
      Buyer.hasMany(Notification);
      Buyer.hasMany(Payment);
      Buyer.hasMany(Transaction);
      Buyer.hasMany(Notifyme)
      // define association here
    }
  }
  Buyer.init(
    {
      id: {
        set(value) {
          let x=uid(16);
          // Storing passwords in plaintext in the database is terrible.
          // Hashing the value with an appropriate cryptographic hash function is better.
          this.setDataValue('id', x);
        },
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