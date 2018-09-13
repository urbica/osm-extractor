const axios = require('axios');

const geocodeWithNominatim = (query, options = {}) =>
  axios
    .get(options.url || 'https://nominatim.openstreetmap.org/search', {
      params: { q: query, format: options.format || 'json' }
    })
    .then(response => response.data);

const nominatimBBoxToOSM = bbox => [bbox[2], bbox[0], bbox[3], bbox[1]];

// https://github.com/tyrasd/overpass-turbo/blob/fcf98fd443b5372010ce45017d44d67f796d111f/js/shortcuts.js#L103
const normalizeNominatimId = (result) => {
  let areaRef = 1 * result.osm_id;
  if (result.osm_type === 'way') areaRef += 2400000000;
  if (result.osm_type === 'relation') areaRef += 3600000000;
  return areaRef;
};

const buildOverpassAreaQuery = nominatimResult =>
  [
    `area(${normalizeNominatimId(nominatimResult)})->.searchArea;`,
    '(node(area.searchArea); way(area.searchArea); relation(area.searchArea););',
    'out body; >; out skel qt;'
  ].join('');

// bbox = [left, bottom, right, top]
const extractWithBBox = (bbox, options = {}) =>
  new Promise((resolve, reject) =>
    axios
      .get(options.url || 'https://api.openstreetmap.org/api/0.6/map', {
        responseType: 'stream',
        params: { bbox: bbox.join(',') }
      })
      .then(response => resolve(response.data))
      .catch(({ response }) => reject(new Error(response.headers.error)))
  );

const extractWithOverpassQuery = (query, options = {}) =>
  axios
    .get(options.url || 'https://overpass-api.de/api/interpreter', {
      responseType: options.responseType || 'stream',
      params: { data: query }
    })
    .then(response => response.data);

const geocodeAndExtract = query =>
  geocodeWithNominatim(query).then(results =>
    extractWithOverpassQuery(buildOverpassAreaQuery(results[0]))
  );

module.exports = {
  geocodeAndExtract,
  geocodeWithNominatim,
  nominatimBBoxToOSM,
  buildOverpassAreaQuery,
  extractWithBBox,
  extractWithOverpassQuery
};
