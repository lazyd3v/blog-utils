import debounce from "lodash/debounce";
import * as d3 from "./d3.js";
import { feature as getTopojsonFeature } from "topojson-client";
import * as PIXI from "pixi.js";
import worldAtlas from "world-atlas/countries-110m.json";

import {
  SPEED,
  VERTICAL_TILT,
  HORIZONTAL_TILT,
  COLORS,
  MARKER_RADIUS,
  ROTATION_MULTIPLIER,
} from "./config.js";

const width = 500;
const height = 500;
const center = [width / 2, height / 2];

const renderElement = document.getElementById("globe");
const app = new PIXI.Application();

const graphics = new PIXI.Graphics();
graphics.eventMode = "static";
graphics.dragging = false;
graphics.rotationAngle = -120;

const projection = d3.geoOrthographic().translate(center);
class GeoPathContext {
  constructor(graphics) {
    this.g = graphics;
    this._line = NaN;
    this._point = 0;
    this._radius = 4.5;
  }

  moveTo(x, y) { this.g.moveTo(x, y); }
  lineTo(x, y) { this.g.lineTo(x, y); }
  closePath() { this.g.closePath(); }
  beginPath() { this.g.beginPath(); }
  arc(x, y, r, startAngle, endAngle) { this.g.arc(x, y, r, startAngle, endAngle); }

  polygonStart() { this._line = 0; }
  polygonEnd() { this._line = NaN; }
  lineStart() { this._point = 0; }
  lineEnd() {
    if (this._line === 0) this.closePath();
    this._point = NaN;
  }

  point(x, y) {
    switch (this._point) {
      case 0: this.moveTo(x, y); this._point = 1; break;
      case 1: this.lineTo(x, y); break;
      default: this.moveTo(x + this._radius, y); this.arc(x, y, this._radius, 0, Math.PI * 2); break;
    }
  }

  pointRadius(_) { this._radius = _; return this; }
  result() {}
}

const geoPathContext = new GeoPathContext(graphics);
const path = d3.geoPath().projection(projection).context(geoPathContext);

function applySize() {
  const {
    width: newWidth,
    height: newHeight,
  } = renderElement.getBoundingClientRect();

  app.renderer.resize(newWidth, newHeight);
  app.stage.scale.set(newWidth / width, newHeight / height);
}

window.addEventListener("resize", debounce(applySize, 300));

async function initialize() {
  await app.init({
    width,
    height,
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio,
  });

  renderElement.appendChild(app.canvas);
  app.stage.addChild(graphics);

  fetch("/globe-meta.json")
    .then((res) => res.json())
    .then((json) => {
      const metaData = generateMetaDataForRender(json);

      applySize();
      initializeProjection(metaData);
      enableRotation(metaData);
      enableDragging();
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
  graphics.circle(center[0], center[1], height / 2).fill({ color: COLORS.ocean });

  // Visited countries
  drawFeatureCollection(visited, COLORS.visited);

  // Not visited countries
  drawFeatureCollection(notVisited, COLORS.country);

  drawMarkers(places);
}

function drawFeatureCollection(featureCollection, fillColor) {
  geoPathContext.beginPath();
  geoPathContext.g.setStrokeStyle({ width: 1, color: COLORS.border, alpha: 1 });
  path(featureCollection);
  geoPathContext.g.fill({ color: fillColor, alpha: 1 }).stroke();
}

function enableRotation(metaData) {
  const ticker = PIXI.Ticker.shared;

  ticker.add(() => {
    if (!graphics.dragging) {
      graphics.rotationAngle += PIXI.Ticker.shared.elapsedMS * SPEED;
    }

    projection.rotate([graphics.rotationAngle, VERTICAL_TILT, HORIZONTAL_TILT]);
    drawGlobe(metaData);
  });
  ticker.start();
}

function enableDragging () {
  let previousTouch
  const onStart = (event) => {
    previousTouch = event.data.originalEvent.touches?.[0]

    graphics.dragging = true;
  }
  
  const onMove = (event) => {
    if (!event.target) {
      return
    }

    if (graphics.dragging) {
      const movementX = event.data.originalEvent.movementX
      if (movementX) {
        graphics.rotationAngle += movementX * ROTATION_MULTIPLIER;
      } else if (previousTouch) {
        const delta = event.data.originalEvent.touches[0].pageX - previousTouch.pageX;
        graphics.rotationAngle += delta * ROTATION_MULTIPLIER;
      }
    }
    
    previousTouch = event.data.originalEvent.touches?.[0]
  }
  const onEnd = () => {
    graphics.dragging = false;
  }

  graphics.on('mousedown', onStart)
  graphics.on('touchstart', onStart)
  graphics.on('mousemove', onMove)
  graphics.on('touchmove', onMove)
  graphics.on('mouseout', onEnd)
  graphics.on('touchendoutside', onEnd)
  graphics.on('mouseup', onEnd)
  graphics.on('touchend', onEnd)
}

function drawMarkers(places) {
  places.forEach((place) => {
    const cords = [place.long, place.lat];
    const projectedCoords = projection(cords);

    const gdistance = d3.geoDistance(cords, projection.invert(center));
    const possibleRadius = (MARKER_RADIUS * (1.57 - gdistance)) / 1.57;
    const radius = Math.max(possibleRadius, 0);

    if (radius > 0) {
      graphics
        .circle(projectedCoords[0], projectedCoords[1], radius)
        .fill({ color: COLORS.marker });
    }
  });
}

initialize();
