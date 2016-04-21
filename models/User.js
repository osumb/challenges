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
    instrument: {
      type: DataTypes.ENUM('Trumpet', 'Mellophone', 'Trombone', 'Baritone', 'Snare', 'Tenor', 'Cymbals', 'Bass', 'Sousaphone'),
      allowNull: true
    },
    part: {
      type: DataTypes.ENUM('Efer', 'First', 'Second', 'Flugel', 'Bass', 'Solo'),
      allowNull: true,
      validate: {
        correctInstrument: function(value) {
          let instrumentMatchesPart = true;
          switch(this.instrument) {
          case 'Trumpet':
            instrumentMatchesPart = (value === 'Solo' || value === 'First' || value === 'Second' || value === 'Flugel' || value === 'Effer');
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
    eligible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    alternate: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, options);
};
