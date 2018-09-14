# osm-extractor

[![Build Status](https://travis-ci.org/urbica/osm-extractor.svg?branch=master)](https://travis-ci.org/urbica/osm-extractor)

Extracts data from [OpenStreetMap](https://www.openstreetmap.org) using [Overpass API](https://overpass-turbo.eu/).

<img align="center" src="https://raw.githubusercontent.com/urbica/osm-extractor/master/Overpass_API.png" />

## Installation

```shell
npm i osm-extractor
```

## Usage

Geocode and extract area using [Overpass API](https://overpass-turbo.eu/)

```js
const fs = require("fs");
const { extractWithGeocode } = require("osm-extractor");

extractWithGeocode("Liechtenstein").then(data =>
  data.pipe(fs.createWriteStream("data.osm"))
);
```

Extract OpenStreetMap data from Overpass using [BBox](https://wiki.openstreetmap.org/wiki/Bounding_Box)

```js
const fs = require("fs");
const { extractWithBBox } = require("osm-extractor");

extractWithBBox([11.5, 48.1, 11.6, 48.2]).then(data =>
  data.pipe(fs.createWriteStream("data.osm"))
);
```

Extract from [Overpass API](https://overpass-turbo.eu/) using [Overpass QL](https://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide)

```js
const fs = require("fs");
const { extractWithQuery } = require("osm-extractor");

const query = "node(50.745,7.17,50.75,7.18);out;";
extractWithQuery(query).then(data =>
  data.pipe(fs.createWriteStream("data.osm"))
);
```
