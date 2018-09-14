const axios = require('axios');

const geocode = (query, options = {}) =>
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

const buildAreaQuery = nominatimResult =>
  [
    `area(${normalizeNominatimId(nominatimResult)})->.searchArea;`,
    '(node(area.searchArea); way(area.searchArea); relation(area.searchArea););',
    'out body; >; out skel qt;'
  ].join('');

const buildBBoxQuery = (bbox) => {
  const bboxStr = bbox.join(',');
  return [
    `(node(${bboxStr}); way(${bboxStr}); relation(${bboxStr}););`,
    'out body; >; out skel qt;'
  ].join('');
};

const extractWithQuery = (query, options = {}) =>
  axios
    .get(options.url || 'https://overpass-api.de/api/interpreter', {
      responseType: options.responseType || 'stream',
      params: { data: query }
    })
    .then(response => response.data);

const extractWithBBox = bbox => extractWithQuery(buildBBoxQuery(bbox));

const extractWithGeocode = query =>
  geocode(query).then(results => extractWithQuery(buildAreaQuery(results[0])));

module.exports = {
  geocode,
  nominatimBBoxToOSM,
  buildAreaQuery,
  buildBBoxQuery,
  extractWithQuery,
  extractWithBBox,
  extractWithGeocode
};
