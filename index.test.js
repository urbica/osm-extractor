const test = require('tape');
const moxios = require('moxios');
const { geocode } = require('./index');

test('geocode', (t) => {
  moxios.install();

  const nominatimResponse = [];
  moxios.stubRequest(/nominatim.openstreetmap.org/, {
    status: 200,
    responseText: nominatimResponse
  });

  geocode('Moscow').then((results) => {
    t.deepEqual(results, nominatimResponse);
    moxios.uninstall();
    t.end();
  });
});

// TODO: write the remaining tests
