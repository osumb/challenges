/* eslint-disable complexity, yoda */
import { helpers as userHelpers } from '../user';
import { api } from '../../utils';

const stringSplitRegex = /[a-zA-Z]+|[0-9]+/g;
const rows = {
  A: 'A',
  B: 'B',
  C: 'C',
  E: 'E',
  F: 'F',
  H: 'H',
  I: 'I',
  J: 'J',
  K: 'K',
  L: 'L',
  M: 'M',
  Q: 'Q',
  R: 'R',
  S: 'S',
  T: 'T',
  X: 'X'
};
const rowFileMax = {
  A: 14,
  B: 14,
  C: 14,
  E: 14,
  F: 14,
  H: 14,
  I: 14,
  J: 18,
  K: 14,
  L: 14,
  M: 14,
  Q: 14,
  R: 14,
  S: 14,
  T: 14,
  X: 14
};
const compareSpots = (a, b) => {
  if (typeof a === 'string')
    return compareSpots(spotFromString(a), spotFromString(b));
  if (a.row === b.row) {
    return a.file - b.file;
  } else {
    return a.row > b.row ? 1 : -1;
  }
};
const rowInstrumentMap = () => ({
  A: userHelpers.instruments.TRUMPET,
  B: userHelpers.instruments.TRUMPET,
  C: userHelpers.instruments.TRUMPET,
  E: userHelpers.instruments.MELLOPHONE,
  F: userHelpers.instruments.TROMBONE,
  H: userHelpers.instruments.BARITONE,
  I: userHelpers.instruments.PERCUSSION,
  J: userHelpers.instruments.PERCUSSION,
  K: userHelpers.instruments.SOUSAPHONE,
  L: userHelpers.instruments.SOUSAPHONE,
  M: userHelpers.instruments.BARITONE,
  Q: userHelpers.instruments.TROMBONE,
  R: userHelpers.instruments.MELLOPHONE,
  S: userHelpers.instruments.TRUMPET,
  T: userHelpers.instruments.TRUMPET,
  X: userHelpers.instruments.TRUMPET
});
const rowPartsMap = () => ({
  A: [userHelpers.parts.EFER, userHelpers.parts.SOLO],
  B: [userHelpers.parts.FIRST, userHelpers.parts.SECOND],
  C: [userHelpers.parts.FLUGEL],
  E: [userHelpers.parts.FIRST, userHelpers.parts.SECOND],
  F: [
    userHelpers.parts.FIRST,
    userHelpers.parts.SECOND,
    userHelpers.parts.BASS
  ],
  H: [userHelpers.parts.FIRST],
  I: [userHelpers.parts.SNARE],
  J: [
    userHelpers.parts.CYMBALS,
    userHelpers.parts.TENOR,
    userHelpers.parts.BASS
  ],
  K: [userHelpers.parts.FIRST],
  L: [userHelpers.parts.FIRST],
  M: [userHelpers.parts.FIRST],
  Q: [
    userHelpers.parts.FIRST,
    userHelpers.parts.SECOND,
    userHelpers.parts.BASS
  ],
  R: [userHelpers.parts.FIRST, userHelpers.parts.SECOND],
  S: [userHelpers.parts.SECOND, userHelpers.parts.FLUGEL],
  T: [userHelpers.parts.FIRST, userHelpers.parts.SECOND],
  X: [userHelpers.parts.EFER, userHelpers.parts.SOLO]
});
const spotFromString = spot => {
  const [row, file] = spot.match(stringSplitRegex);

  return { row, file };
};
const toString = ({ row, file }) => `${row}${file}`;
const validInstrumentForRow = (row, instrument) => {
  if (
    row === rows.A ||
    row === rows.B ||
    row === rows.C ||
    row === rows.S ||
    row === rows.T ||
    row === rows.X
  ) {
    return instrument === userHelpers.instruments.TRUMPET;
  } else if (row === rows.E || row === rows.R) {
    return instrument === userHelpers.instruments.MELLOPHONE;
  } else if (row === rows.F || row === rows.Q) {
    return instrument === userHelpers.instruments.TROMBONE;
  } else if (row === rows.H || row === rows.M) {
    return instrument === userHelpers.instruments.BARITONE;
  } else if (row === rows.K || row === rows.L) {
    return instrument === userHelpers.instruments.SOUSAPHONE;
  } else {
    // JI row
    return instrument === userHelpers.instruments.PERCUSSION;
  }
};
const validPartForRow = (row, part) => {
  if (row === rows.A || row === rows.X) {
    return part === userHelpers.parts.SOLO || part === userHelpers.parts.EFER;
  } else if (row === rows.B || row === rows.T) {
    return (
      part === userHelpers.parts.FIRST || part === userHelpers.parts.SECOND
    );
  } else if (row === rows.E || row === rows.R) {
    return (
      part === userHelpers.parts.FIRST || part === userHelpers.parts.SECOND
    );
  } else if (row === rows.F || row === rows.Q) {
    return (
      part === userHelpers.parts.FIRST ||
      part === userHelpers.parts.SECOND ||
      part === userHelpers.parts.BASS
    );
  } else if (row === rows.H || row === rows.M) {
    return part === userHelpers.parts.FIRST;
  } else if (row === rows.K || row === rows.L) {
    return part === userHelpers.parts.FIRST;
  } else if (row === rows.I) {
    return part === userHelpers.parts.SNARE;
  } else if (row === rows.J) {
    return (
      part === userHelpers.parts.CYMBALS ||
      part === userHelpers.parts.BASS ||
      part === userHelpers.parts.BASS
    );
  } else if (row === rows.C) {
    return part === userHelpers.parts.FLUGEL;
  } else {
    // s row
    return (
      part === userHelpers.parts.SECOND || part === userHelpers.parts.FLUGEL
    );
  }
};
const validSpot = ({ row, file }) => {
  const numFile = parseInt(file, 10);
  if (!rows[row]) return false;
  if (row === rows.I || row === rows.J) return 1 <= numFile && numFile <= 18;
  return 1 <= numFile && numFile <= 14 && Boolean(rows[row]);
};
const find = ({ row, file }) => api.get(`/spots/find?query=${row}${file}`);

export default {
  compareSpots,
  find,
  rows,
  rowInstrumentMap,
  rowPartsMap,
  rowFileMax,
  spotFromString,
  toString,
  validPartForRow,
  validInstrumentForRow,
  validSpot
};
