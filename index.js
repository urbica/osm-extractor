const axios = require('axios');

const geocodeWithNominatim = query =>
  axios
    .get('https://nominatim.openstreetmap.org/search', { params: { q: query, format: 'json' } })
    .then(response => response.data);

const nominatimBBoxToOSM = bbox => [bbox[2], bbox[0], bbox[3], bbox[1]];

// bbox = [left, bottom, right, top]
const extractWithBBox = bbox =>
  new Promise((resolve, reject) =>
    axios
      .get('https://api.openstreetmap.org/api/0.6/map', {
        responseType: 'stream',
        params: { bbox: bbox.join(',') }
      })
      .then(response => resolve(response.data))
      .catch(({ response }) => reject(new Error(response.headers.error)))
  );

module.exports = {
  geocodeWithNominatim,
  nominatimBBoxToOSM,
  extractWithBBox
};
