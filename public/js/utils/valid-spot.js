const regex = /^[ABCEFHIJKLMQRSTX](?:[1-9]|(?:[1][0-8]))$/;

module.exports = (spot) => regex.test(spot);
