import { geoPath, geoTransform } from "d3-geo";
import { feature } from "topojson-client";
import countriesAtlas from "world-atlas/countries-110m.json";

import {
  projectLonLatToTexture,
  worldTextureHeight,
  worldTextureWidth
} from "./simulation-geo";

type AtlasTopology = {
  objects: {
    countries: object;
  };
};

const atlasTopology = countriesAtlas as AtlasTopology;
const countriesFeatureCollection = feature(
  atlasTopology as never,
  atlasTopology.objects.countries as never
) as {
  features: unknown[];
};

const projection = geoTransform({
  point(longitude, latitude) {
    const [x, y] = projectLonLatToTexture(longitude, latitude);

    this.stream.point(x, y);
  }
});

const pathGenerator = geoPath(projection);
const worldCountryPath = countriesFeatureCollection.features
  .map((countryFeature) => pathGenerator(countryFeature as never))
  .filter((pathValue): pathValue is string => Boolean(pathValue))
  .join(" ");

const worldMapOverlaySvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${worldTextureWidth} ${worldTextureHeight}" fill="none">
    <defs>
      <linearGradient id="countryFill" x1="120" y1="80" x2="1640" y2="760" gradientUnits="userSpaceOnUse">
        <stop stop-color="#A7F5FF" stop-opacity="0.18" />
        <stop offset="1" stop-color="#7DE2BE" stop-opacity="0.08" />
      </linearGradient>
      <filter id="worldGlow" x="-5%" y="-5%" width="110%" height="110%">
        <feGaussianBlur stdDeviation="3.2" />
      </filter>
    </defs>

    <path d="${worldCountryPath}" fill="url(#countryFill)" stroke="#DDFDFF" stroke-opacity="0.34" stroke-width="1.2" />
    <path d="${worldCountryPath}" fill="none" stroke="#57D8C9" stroke-opacity="0.12" stroke-width="3" filter="url(#worldGlow)" />
  </svg>
`;

export const worldMapOverlayUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(worldMapOverlaySvg)}`;