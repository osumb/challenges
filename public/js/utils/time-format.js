const moment = require('moment');

module.exports = (classNames, formatString) => {
  const elements = classNames.map((name) => document.getElementsByClassName(name));

  elements.forEach((element) => {
    Array.from(element).forEach((e) => {
      if (e) {
        console.log(e.innerHTML);
        e.innerHTML = moment(e.innerHTML).format(formatString);
      }
    });
  });
};
