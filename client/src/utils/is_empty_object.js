export default function isEmptyObject(obj) {
  return Boolean(obj) && Object.keys(obj).length === 0 && obj.constructor === Object;
}
