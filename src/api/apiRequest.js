const nominatim = 'https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&addressdetails=18&limit=1&';
const overpass = 'http://overpass-api.de/api/interpreter?data=[out:json];way(';

/**
 * Fetch an osm_id from gps coordinates
 * @function fetchNominatimOsmID
 * @param {number} lat
 * @param {number} lng
 * @returns {number} osm_id
 */
const fetchNominatimOsmID = async (lat, lng) => {
  const response = await fetch(`${nominatim}lat=${lat}&lon=${lng}`, { method: 'GET' });
  const responseJson = await response.json();
  if (responseJson.osm_type === 'way' && responseJson.osm_id) {
    return responseJson.osm_id;
  }
  return 0;
};

/**
 * Fetch the way maxspeed from an osm_id
 * @function fetchOverpassMaxSpeed
 * @param {number} osmId
 * @returns {number} maxspeed
 */
const fetchOverpassMaxSpeed = async (osmId) => {
  const response = await fetch(`${overpass}${osmId});out;`, { method: 'GET' });
  if (await response && response.status === 200) {
    const responseJson = await response.json();
    if (responseJson.elements[0].tags.maxspeed) {
      return +responseJson.elements[0].tags.maxspeed;
    }
  }
  return 0;
};

export { fetchNominatimOsmID, fetchOverpassMaxSpeed };
