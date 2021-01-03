import { getPreciseDistance } from "geolib";
import { parse, isBefore } from "date-fns";
import { pipe, map, length, uniq } from "ramda";

function getBaseCityCoordinates(dateStr) {
  const date = parse(dateStr, "dd-MM-yyyy", new Date());
  // Living in Kazan before moving to Stockholm
  if (isBefore(date, new Date(2019, 6, 27))) {
    return {
      latitude: 55.830433,
      longitude: 49.066082,
    };
  }

  return {
    latitude: 59.329323,
    longitude: 18.068581,
  };
}

function calculateDistance(trips) {
  let result = 0;

  for (let i = 0; i < trips.length; i++) {
    const trip = trips[i];
    const previousTrip = trips[i - 1];

    if (previousTrip && trip.isNewTrip) {
      result += getPreciseDistance(getBaseCityCoordinates(trip.date), {
        latitude: previousTrip.lat,
        longitude: previousTrip.long,
      });
    }

    if (trip.isNewTrip) {
      result += getPreciseDistance(getBaseCityCoordinates(trip.date), {
        latitude: trip.lat,
        longitude: trip.long,
      });
    } else {
      result += getPreciseDistance(
        { latitude: previousTrip.lat, longitude: previousTrip.long },
        { latitude: trip.lat, longitude: trip.long }
      );
    }
  }

  return Math.round(result / 1000);
}

function calculateTrips(trips) {
  return trips.filter((trip) => trip.isNewTrip).length;
}

function calculateCities(trips) {
  return pipe(
    map((trip) => trip.city),
    uniq,
    length
  )(trips);
}

function calculateContries(trips) {
  return pipe(
    map((trip) => trip.countryId),
    uniq,
    length
  )(trips);
}

export function createStats(trips) {
  return {
    totalDistanceKm: calculateDistance(trips),
    totalTrips: calculateTrips(trips),
    totalCities: calculateCities(trips),
    totalCountries: calculateContries(trips),
  };
}
