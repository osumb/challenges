'use strict';
const options = {freezeTableName: true};

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    'nameNumber': {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    row: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K', 'L', 'M', 'Q', 'R', 'S', 'T', 'X'),
      allowNull: true
    },
    file: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    instrument: {
      type: DataTypes.ENUM('Trumpet', 'Baton', 'Mellophone', 'Trombone', 'Baritone', 'Snare', 'Tenor', 'Cymbals', 'Bass', 'Sousaphone', 'Director'),
      allowNull: false,
      defaultValue: 'Baton'
    },
    part: {
      type: DataTypes.ENUM('Efer', 'First', 'Second', 'Flugel', 'Bass', 'Drum Major'),
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    squadLeader: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    challenged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, options);
};
