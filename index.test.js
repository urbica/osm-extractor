const test = require('tape');
const moxios = require('moxios');
const { geocodeWithNominatim } = require('./index');

test('geocodeWithNominatim', (t) => {
  moxios.install();

  const nominatimResponse = [];
  moxios.stubRequest(/nominatim.openstreetmap.org/, {
    status: 200,
    responseText: nominatimResponse
  });

  geocodeWithNominatim('Moscow').then((results) => {
    t.deepEqual(results, nominatimResponse);
    moxios.uninstall();
    t.end();
  });
});

// TODO: write the remaining tests
