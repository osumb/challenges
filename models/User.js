'use strict';
//TODO: MAKE FIELD FOR SQUAD LEADER
const Sequelize = require('sequelize');
const config = require('../config');
const sql = new Sequelize(config.db.postgres);
const xlsx = require('node-xlsx');
const dataTypes = {
  'nameNumber': {
    type: Sequelize.STRING,
    primaryKey: true,
    autoIncrement: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  row: {
    type: Sequelize.ENUM('A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K', 'L', 'M', 'Q', 'R', 'S', 'T', 'X'),
    allowNull: true
  },
  file: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  instrument: {
    type: Sequelize.ENUM('Trumpet', 'Baton', 'Mellophone', 'Trombone', 'Baritone', 'Snare', 'Tenor', 'Cymbals', 'Bass', 'Sousaphone', 'Director'),
    allowNull: false,
    defaultValue: 'Baton'
  },
  part: {
    type: Sequelize.ENUM('Efer', 'First', 'Second', 'Flugel', 'Bass', 'Drum Major'),
    allowNull: false,
    defaultValue: 'First',
    validate: {
      correctInstrument: function(value) {
        let instrumentMatchesPart = true;
        switch(this.instrument) {
        case 'Trumpet':
          instrumentMatchesPart = (value === 'First' || value === 'Second' || value === 'Flugel' || value === 'Effer');
          break;
        case 'Trombone':
          instrumentMatchesPart = (value === 'First' || value === 'Second' || value === 'Bass');
          break;
        default:
          instrumentMatchesPart = true;
        }
        if (!instrumentMatchesPart) throw new Error(`Instrument: ${this.instrument} can't have part ${value}`);
      }
    }
  },
  spotOpen: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
};

const options = {freezeTableName: true};
const User = sql.define('User', dataTypes, options);

// 'static function'
User.canChallenge = function(challenger, challengee) {
  const sameInstrument = challenger.dataValues.instrument === challengee.dataValues.instrument;
  const samePart = challenger.dataValues.part === challengee.dataValues.part;
  const challengeeNotAlternate = challengee.dataValues.file < 13;
  const challengerEligible = !challenger.dataValues.spotOpen;
  return (sameInstrument && samePart && challengeeNotAlternate && challengerEligible);
};

//the order of columns in execl file is Spot, Name, Instrument, Part, Name.#
//spot comes as 'A1', so we need to split to insert into db
User.getUsersFromExcelFile = function(filePath){
  const parseObj = xlsx.parse(filePath);
  const rowFileRegex = /[a-zA-Z]+|[0-9]+/g;
  const userArr = [];
  let UserObj = {};

  parseObj[0].data.forEach((e, index) => {
    //first line of file is column names
    if (index != 0) {
      UserObj = new Object();
      let rowFile = e[0].match(rowFileRegex);
      UserObj.name = e[1];
      UserObj.row = rowFile[0];
      UserObj.file = rowFile[1];
      UserObj.instrument = e[2];
      //Solo is considered first
      e[3] = (e[3] === 'Solo') ? 'First': e[3];
      UserObj.part = e[3];
      UserObj.nameNumber = e[4];
      userArr.push(UserObj);
    }
  });
  return userArr;
};

module.exports = User;
