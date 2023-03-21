'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Buyer}) {
      Payment.belongsTo(Buyer);
      // define association here
    }
  }
  Payment.init({
  id:{type: DataTypes.STRING,primaryKey:true
      },
  bankerId:{
    type:DataTypes.STRING,
    allowNull:false
  },
  date:{type:DataTypes.DATE}
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};