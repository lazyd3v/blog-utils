import * as d3 from "d3";
import * as topojson from "topojson";
import worldAtlas from "world-atlas/countries-110m.json";

import {
  SPEED,
  VERTICAL_TILT,
  HORIZONTAL_TILT,
  COLORS,
  MARKER_RADIUS
} from "./config";
import { UNIQUE_PLACES_VISITED, UNIQUE_COUNTRIES_VISITED } from "./data";

const width = 500;
const height = 500;
const center = [width / 2, height / 2];

const svg = d3.select("#globe");
const markerGroup = svg.append("g");
const projection = d3.geoOrthographic().translate(center);
const path = d3.geoPath().projection(projection);

drawGlobe();
enableRotation();

function drawGlobe() {
  // Base
  svg
    .append("g")
    .append("circle")
    .style("fill", COLORS.ocean)
    .attr("cx", center[0])
    .attr("cy", center[1])
    .attr("r", height / 2);

  // Countries
  svg
    .selectAll(".segment")
    .data(topojson.feature(worldAtlas, worldAtlas.objects.countries).features)
    .enter()
    .append("path")
    .attr("class", "segment")
    .attr("d", path)
    .style("stroke", COLORS.border)
    .style("stroke-width", "1px")
    .style("fill", (d, i) => {
      return UNIQUE_COUNTRIES_VISITED.has(d.id)
        ? COLORS.visited
        : COLORS.country;
    });

  drawMarkers();
}

function enableRotation() {
  d3.timer(function(elapsed) {
    projection.rotate([SPEED * elapsed - 120, VERTICAL_TILT, HORIZONTAL_TILT]);
    svg.selectAll("path").attr("d", path);
    drawMarkers();
  });
}

function drawMarkers() {
  const markers = markerGroup.selectAll("circle").data(UNIQUE_PLACES_VISITED);

  markers
    .enter()
    .append("circle")
    .merge(markers)
    .attr("cx", d => projection([d.long, d.lat])[0])
    .attr("cy", d => projection([d.long, d.lat])[1])
    .attr("fill", COLORS.marker)
    .attr("r", d => {
      const coordinate = [d.long, d.lat];
      const gdistance = d3.geoDistance(coordinate, projection.invert(center));
      const r = (MARKER_RADIUS * (1.57 - gdistance)) / 1.57;

      return Math.max(r, 0);
    });

  markerGroup.each(function() {
    this.parentNode.appendChild(this);
  });
}
