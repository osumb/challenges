import { camelCase } from 'change-case';

const changeCase = obj => {
  if (Array.isArray(obj)) {
    return changeCaseArray(obj);
  }

  return Object.keys(obj).reduce((acc, curr) => {
    const a = obj[curr];

    if (typeof a === 'object' && a !== null) {
      acc[camelCase(curr)] = changeCase(a);
    } else {
      acc[camelCase(curr)] = a;
    }

    return acc;
  }, {});
};

const changeCaseArray = arr =>
  arr.map(obj => {
    if (typeof obj === 'object') {
      return changeCase(obj);
    }
    return obj;
  });

export default changeCase;
