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
const geoPathContext = createGeoPathContext(graphics);
const path = d3.geoPath().projection(projection).context(geoPathContext);

// Proxy wraps PixiJS Graphics to expose a Canvas2D-compatible API.
// d3.geoPath expects a Canvas2D context (beginFill, lineStyle, drawCircle, endFill),
// but PixiJS v8 uses different method names (fill, setStrokeStyle, circle).
// This proxy translates Canvas2D-style calls from d3 into PixiJS v8 calls at runtime.
function createGeoPathContext(graphics) {
  return new Proxy(graphics, {
    get(target, property, receiver) {
      if (property === "beginFill") {
        return (color, alpha = 1) => {
          target.fill({ color, alpha });
          return receiver;
        };
      }

      if (property === "lineStyle") {
        return (width = 1, color = 0, alpha = 1) => {
          if (width <= 0) {
            target.setStrokeStyle({ width: 0, alpha: 0 });
          } else {
            target.setStrokeStyle({ width, color, alpha });
          }
          return receiver;
        };
      }

      if (property === "drawCircle") {
        return (x, y, radius) => {
          target.circle(x, y, radius);
          return receiver;
        };
      }

      if (property === "endFill") {
        return () => receiver;
      }

      const value = Reflect.get(target, property, receiver);

      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

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
  graphics
    .beginPath()
    .setStrokeStyle({ width: 1, color: COLORS.border, alpha: 1 });

  path(featureCollection);

  graphics.fill({ color: fillColor, alpha: 1 }).stroke();
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
