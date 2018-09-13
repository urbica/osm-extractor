# osm-extractor

Extracts data from OpenStreetMap

## Installation

```shell
npm i osm-extractor
```

## Usage

Extract from OpenStreetMap using BBox

```js
const fs = require("fs");
const { extractWithBBox } = require("osm-extractor");

extractWithBBox([11.5, 48.1, 11.6, 48.2]).then(data =>
  data.pipe(fs.createWriteStream("data.osm"))
);
```

Geocode area and extract from OpenStreetMap using BBox

```js
const fs = require("fs");
const {
  geocodeWithNominatim,
  nominatimBBoxToOSM,
  extractWithBBox
} = require("osm-extractor");

geocodeWithNominatim("severouralsk")
  .then(results => {
    const bbox = nominatimBBoxToOSM(results[0].boundingbox);
    return extractWithBBox(bbox);
  })
  .then(data => data.pipe(fs.createWriteStream("data.osm")));
```

## Known limits

- The maximum bbox size is 0.25
- You can't extract over 50 000 nodes at once
