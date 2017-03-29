export default function compareSpots(a, b) {
  if (a.row === b.row) {
    return a.file - b.file;
  } else {
    return a.row > b.row ? 1 : -1;
  }
}
