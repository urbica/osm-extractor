# osm-extractor

Extracts data from [OpenStreetMap](https://www.openstreetmap.org)

## Installation

```shell
npm i osm-extractor
```

## Usage

tl;dr -- Geocode and extract area using [Overpass API](https://overpass-turbo.eu/)

```js
const fs = require("fs");
const { geocodeAndExtract } = require("osm-extractor");

geocodeAndExtract("Liechtenstein").then(data =>
  data.pipe(fs.createWriteStream("data.osm"))
);
```

### More examples:

Extract from OpenStreetMap using [BBox](https://wiki.openstreetmap.org/wiki/Bounding_Box)

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

geocodeWithNominatim("Severouralsk")
  .then(results => {
    const bbox = nominatimBBoxToOSM(results[0].boundingbox);
    return extractWithBBox(bbox);
  })
  .then(data => data.pipe(fs.createWriteStream("data.osm")));
```

Extract from [Overpass API](https://overpass-turbo.eu/) using [Overpass QL](https://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide)

```js
const fs = require("fs");
const { extractWithOverpassQuery } = require("osm-extractor");

const query = "node(50.745,7.17,50.75,7.18);out;";
extractWithOverpassQuery(query).then(data =>
  data.pipe(fs.createWriteStream("data.osm"))
);
```

Geocode and build area query to extract from Overpass API

```js
const fs = require("fs");
const {
  geocodeWithNominatim,
  buildOverpassAreaQuery,
  extractWithOverpassQuery
} = require("osm-extractor");

geocodeWithNominatim("Moscow")
  .then(results => {
    const query = buildOverpassAreaQuery(results[0]);
    return extractWithOverpassQuery(query);
  })
  .then(data => data.pipe(fs.createWriteStream("data.osm")));
```

## Known limits

`extractWithBBox`

- The maximum bbox size is 0.25
- You can't extract over 50 000 nodes at once
