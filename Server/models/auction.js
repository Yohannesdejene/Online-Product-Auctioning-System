const {uid}=require('uid'); 
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
    static associate({Pictures,Category,Buyer,Bid,ReportedAuction,Transaction,Seller}) {
      Auction.hasMany(Pictures);
      Auction.belongsTo(Category);
      Auction.belongsTo(Seller);
      Auction.belongsToMany(Buyer,{through:Bid})
      Auction.hasMany(Transaction);
      Auction.hasMany(ReportedAuction)
    }
  }
  Auction.init({
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
    baseprice: {
      type:DataTypes.STRING,
      allowNull:false},
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
      /**
       * The alterantive values are 
       * started  notstarted closed suspended 
       * 
       */
      type: DataTypes.STRING,
      defaultValue:"not started"
    },
    winnerId:{
      type:DataTypes.STRING,
      allowNull:true
    },
    see:{
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'Auction',
  });
  return Auction;
};