/**
* Return the distance between two gps coordinate
* @function getHaversineDistance
* @param {number} lat
* @param {number} lng
* @param {number} oldlat
* @param {number} oldlng
* @returns {number} distance
*/
export const getHaversineDistance = (lat, lng, oldlat, oldlng) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // km

  const dLat = toRad(oldlat - lat);
  const dLatSin = Math.sin(dLat / 2);
  const dLon = toRad(oldlng - lng);
  const dLonSin = Math.sin(dLon / 2);

  const a = dLatSin * dLatSin + Math.cos(toRad(oldlng))
  * Math.cos(toRad(oldlng)) * dLonSin * dLonSin;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
