'use strict';
const options = {freezeTableName: true};
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Spots', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        spotValid: function(value) {
          const validRows = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K', 'L', 'M', 'Q', 'R', 'S', 'T', 'X'];
          const spotRegex = /[A-Z]+|[1-9]+/g;
          const spotArr = value.match(spotRegex);
          const row = spotArr[0], file = spotArr[1];
          const spotIsInRange = (1 <= file && file <= 15);
          const rowIsValid = validRows.includes(row);
          return (spotArr.length == 2 && spotIsInRange && rowIsValid);
        }
      }
    },
    open: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    challenged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, options);
};
