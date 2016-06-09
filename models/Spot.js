const attributes = ['id', 'open', 'challengedCount'];

module.exports = class Spot {
  static getAttributes() {
    return attributes;
  }

  static getIdName() {
    return 'id';
  }

  static getTableName() {
    return 'spots';
  }
};
