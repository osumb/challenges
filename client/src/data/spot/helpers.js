/* eslint-disable complexity, yoda */
import { helpers as userHelpers } from '../user';

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
const compareSpots = (a, b) => {
  if (typeof a === 'string') return compareSpots(spotFromString(a), spotFromString(b));
  if (a.row === b.row) {
    return a.file - b.file;
  } else {
    return a.row > b.row ? 1 : -1;
  }
};
const spotFromString = spot => {
  const [row, file] = spot.match(stringSplitRegex);

  return { row, file };
};
const validInstrumentForRow = (row, instrument) => {
  if (row === rows.A || row === rows.B || row === rows.C || row === rows.S || row === rows.T || row === rows.X) {
    return instrument === userHelpers.instruments.TRUMPET;
  } else if (row === rows.E || row === rows.R) {
    return instrument === userHelpers.instruments.MELLOPHONE;
  } else if (row === rows.F || row === rows.Q) {
    return instrument === userHelpers.instruments.TROMBONE;
  } else if (row === rows.H || row === rows.M) {
    return instrument === userHelpers.instruments.BARITONE;
  } else if (row === row.K || row === rows.L) {
    return instrument === userHelpers.instruments.SOUSAPHONE;
  } else { // JI row
    return instrument === userHelpers.instruments.PERCUSSION;
  }
};
const validPartForRow = (row, part) => {
  if (row === rows.A || row === rows.X) {
    return part === userHelpers.parts.SOLO || part === userHelpers.parts.EFER;
  } else if (row === rows.B || row === rows.T) {
    return part === userHelpers.parts.FIRST || part === userHelpers.parts.SECOND;
  } else if (row === rows.E || row === rows.R) {
    return part === userHelpers.parts.FIRST || part === userHelpers.parts.SECOND;
  } else if (row === rows.F || row === rows.Q) {
    return part === userHelpers.parts.FIRST || part === userHelpers.parts.SECOND || part === userHelpers.parts.BASS;
  } else if (row === rows.H || row === rows.M) {
    return part === userHelpers.parts.FIRST;
  } else if (row === rows.K || row === rows.L) {
    return part === userHelpers.parts.FIRST;
  } else if (row === rows.I) {
    return part === userHelpers.parts.SNARE;
  } else if (row === rows.J) {
    return part === userHelpers.parts.CYMBALS || part === userHelpers.parts.BASS || part === userHelpers.parts.BASS;
  } else if (row === rows.C) {
    return part === userHelpers.parts.FLUGEL;
  } else { // s row
    return part === userHelpers.parts.SECOND || part === userHelpers.parts.FLUGEL;
  }
};
const validSpot = ({ row, file }) => {
  const numFile = parseInt(file, 10);
  if (!rows[row]) return false;
  if (row === rows.I || row === rows.J) return 1 <= numFile && numFile <= 18;
  return 1 <= numFile && numFile <= 14 && Boolean(rows[row]);
};

export default {
  compareSpots,
  rows,
  spotFromString,
  validPartForRow,
  validInstrumentForRow,
  validSpot
};
