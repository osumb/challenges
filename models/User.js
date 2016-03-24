'use strict';
//TODO: MAKE FIELD FOR SQUAD LEADER
const Sequelize = require('sequelize');
const config = require('../config');
const sql = new Sequelize(config.db.postgres);
const dataTypes = {
  'name.number': {
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

module.exports = User;
