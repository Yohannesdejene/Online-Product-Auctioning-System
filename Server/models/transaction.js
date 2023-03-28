const {uid}=require('uid'); 
'use strict';
const {
  Model
} = require('sequelize');
const auction = require('./auction');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Auction,Buyer}) {
      Transaction.belongsTo(Auction)
      Transaction.belongsTo(Buyer)
      // define association here
    }
  }
  Transaction.init({
    id:{
      set(value) {
        let x=uid(16);
        // Storing passwords in plaintext in the database is terrible.
        // Hashing the value with an appropriate cryptographic hash function is better.
        this.setDataValue('id', x);
      },
      type: DataTypes.STRING,
      primaryKey:true
    },
    amount:{
      type:DataTypes.DOUBLE,
      
    },
    date:{
      type:DataTypes.DATE,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};