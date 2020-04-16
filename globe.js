import * as d3 from "./d3";
import { feature as getTopojsonFeature } from "topojson-client";
import * as PIXI from "./pixi";
import worldAtlas from "world-atlas/countries-110m.json";

import {
  SPEED,
  VERTICAL_TILT,
  HORIZONTAL_TILT,
  COLORS,
  MARKER_RADIUS,
} from "./config";

const width = 350;
const height = 350;
const center = [width / 2, height / 2];

const app = new PIXI.Application({
  width,
  height,
  transparent: true,
  antialias: true,
  autoDensity: true,
  resolution: window.devicePixelRatio,
});
document.querySelector("#globe").appendChild(app.view);

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

const projection = d3.geoOrthographic().translate(center);
const path = d3.geoPath().projection(projection).context(graphics);

function initialize() {
  fetch("/globe-meta.json")
    .then((res) => res.json())
    .then((json) => {
      const metaData = generateMetaDataForRender(json);

      initializeProjection(metaData);
      drawGlobe(metaData);
      enableRotation(metaData);
    });
}

function generateMetaDataForRender(json) {
  const visitedCountriesIds = new Set(json.countries);

  const topojsonFeature = getTopojsonFeature(
    worldAtlas,
    worldAtlas.objects.countries
  );

  const visited = {
    ...topojsonFeature,
    features: topojsonFeature.features.filter((c) =>
      visitedCountriesIds.has(c.id)
    ),
  };
  const notVisited = {
    ...topojsonFeature,
    features: topojsonFeature.features.filter(
      (c) => !visitedCountriesIds.has(c.id)
    ),
  };

  return {
    countries: { visited, notVisited },
    places: json.places,
    topojsonFeature,
  };
}

function initializeProjection(metaData) {
  projection.fitSize([width, height], metaData.topojsonFeature);
}

function drawGlobe(metaData) {
  const {
    countries: { visited, notVisited },
    places,
  } = metaData;
  graphics.clear();

  // Ocean
  graphics.beginFill(COLORS.ocean);
  graphics.lineStyle(0);
  graphics.drawCircle(center[0], center[1], height / 2);
  graphics.endFill();

  // Visited countries
  graphics.beginFill(COLORS.visited, 1);
  graphics.lineStyle(1, COLORS.border, 1);
  path(visited);
  graphics.endFill();

  // Not visited countries
  graphics.beginFill(COLORS.country, 1);
  graphics.lineStyle(1, COLORS.border, 1);
  path(notVisited);
  graphics.endFill();

  drawMarkers(places);
}

function enableRotation(metaData) {
  const ticker = PIXI.Ticker.shared;

  let angle = -120;

  ticker.add(() => {
    angle += PIXI.Ticker.shared.elapsedMS * SPEED;
    projection.rotate([angle, VERTICAL_TILT, HORIZONTAL_TILT]);
    drawGlobe(metaData);
  });
  ticker.start();
}

function drawMarkers(places) {
  places.forEach((place) => {
    const cords = [place.long, place.lat];
    const projectedCoords = projection(cords);

    const gdistance = d3.geoDistance(cords, projection.invert(center));
    const possibleRadius = (MARKER_RADIUS * (1.57 - gdistance)) / 1.57;
    const radius = Math.max(possibleRadius, 0);

    if (radius > 0) {
      graphics.beginFill(COLORS.marker);
      graphics.lineStyle(0);
      graphics.drawCircle(projectedCoords[0], projectedCoords[1], radius);
      graphics.endFill();
    }
  });
}

initialize();
