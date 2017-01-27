export default function compareSpots(a, b) {
  const aNumber = parseInt(a.substring(1), 10),
    aSpot = a.substring(0, 1),
    bNumber = parseInt(b.substring(1), 10),
    bSpot = b.substring(0, 1);

  if (aSpot !== bSpot) {
    return aSpot.localeCompare(bSpot);
  }

  return aNumber - bNumber;
}
