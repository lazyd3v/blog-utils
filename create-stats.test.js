// Example of four trips:
// Kazan - Malaga - Seville - Kazan
// Kazan - Rimini - San Marino - Kazan
// Stockholm - Milan - Florence - Stockholm
// Stockholm - Uppsala - Stockholm

import { createStats } from "./create-stats";

const data = [
  {
    countryId: "724",
    city: "Malaga",
    date: "08-10-2008",
    lat: 36.721275,
    long: -4.421399,
    isNewTrip: true,
  },
  {
    countryId: "724",
    city: "Seville",
    date: "08-10-2008",
    lat: 37.389091,
    long: -5.984459,
  },

  {
    countryId: "380",
    city: "Rimini",
    date: "23-08-2010",
    lat: 44.060921,
    long: 12.5663,
    isNewTrip: true,
  },
  {
    countryId: "674",
    city: "San Marino",
    date: "24-08-2010",
    lat: 43.94236,
    long: 12.457777,
  },

  {
    countryId: "380",
    city: "Milan",
    date: "18-07-2020",
    lat: 45.464203,
    long: 9.189982,
    isNewTrip: true,
  },
  {
    countryId: "380",
    city: "Florence",
    date: "19-07-2020",
    lat: 43.769562,
    long: 11.255814,
  },

  {
    countryId: "752",
    city: "Uppsala",
    date: "03-10-2020",
    lat: 59.85882,
    long: 17.63889,
    isNewTrip: true,
  },
];

describe("Create statistics", () => {
  it("should calculate distance stats correctly", () => {
    const { totalDistanceKm } = createStats(data);

    // got similar results when calculating by hand
    expect(totalDistanceKm).toEqual(17598);
  });

  it("should calculate days stats correctly", () => {
    const { totalTrips } = createStats(data);

    expect(totalTrips).toEqual(4);
  });

  it("should calculate cities stats correctly", () => {
    const { totalCities } = createStats(data);

    expect(totalCities).toEqual(7);
  });

  it("should calculate countries stats correctly", () => {
    const { totalCountries } = createStats(data);

    expect(totalCountries).toEqual(4);
  });
});
