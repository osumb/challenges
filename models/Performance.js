const options = {freezeTableName: true};

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Performances', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    openAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    closeAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, options);
};
