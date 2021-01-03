import {
  UNIQUE_PLACES_VISITED,
  UNIQUE_COUNTRIES_VISITED,
  TRIPS,
  COUNTRY_EMOJI,
} from "./data.js";
import fs from "fs";
import { reverse } from "ramda";
import { createStats } from "./create-stats";

function formatDate(dateStr) {
  const reversedDateParts = dateStr.split("-").reverse();
  const date = new Date(
    reversedDateParts[0],
    reversedDateParts[1] - 1,
    reversedDateParts[2]
  );
  const month = date.toLocaleString("default", { month: "long" });

  return `in ${month}`;
}

function isSameYear(date1, date2) {
  const parts1 = date1.split("-");
  const parts2 = date2.split("-");

  return parts1[2] === parts2[2];
}

function generateJSON() {
  const reversedTrips = reverse(TRIPS);

  let trips = [];
  let yearDetails = { trips: [] };

  for (let i = 0; i < reversedTrips.length; i++) {
    const trip = reversedTrips[i];
    const nextTrip = reversedTrips[i + 1];

    const tripDescription = `${COUNTRY_EMOJI[trip.countryId]} ${
      trip.city
    } ${formatDate(trip.date)}`;
    yearDetails.trips.push(tripDescription);

    if ((nextTrip && !isSameYear(trip.date, nextTrip.date)) || !nextTrip) {
      const year = trip.date.split("-")[2];
      yearDetails.year = year;

      trips.push(yearDetails);

      yearDetails = { trips: [] };
    }
  }

  const globeMetaData = {
    places: UNIQUE_PLACES_VISITED,
    countries: Array.from(UNIQUE_COUNTRIES_VISITED),
  };

  fs.writeFileSync("./static/trips.json", JSON.stringify(trips));
  fs.writeFileSync("./static/globe-meta.json", JSON.stringify(globeMetaData));
  fs.writeFileSync(
    "./static/trips-stats.json",
    JSON.stringify(createStats(TRIPS))
  );
}

generateJSON();
