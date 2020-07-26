import { uniqWith } from "lodash-es";

export const TRIPS = [
  // 2008
  {
    countryId: "724",
    city: "Malaga",
    date: "08-10-2008",
    lat: 36.721275,
    long: -4.421399,
  },
  {
    countryId: "724",
    city: "Seville",
    date: "08-10-2008",
    lat: 37.389091,
    long: -5.984459,
  },
  {
    countryId: "724",
    city: "Tarifa",
    date: "08-10-2008",
    lat: 36.01432,
    long: -5.60445,
  },

  // 2010
  {
    countryId: "380",
    city: "Rimini",
    date: "23-08-2010",
    lat: 44.060921,
    long: 12.5663,
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
    city: "Venice",
    date: "25-08-2010",
    lat: 45.440845,
    long: 12.315515,
  },
  {
    countryId: "380",
    city: "Florence",
    date: "26-08-2010",
    lat: 43.769562,
    long: 11.255814,
  },

  // 2011
  {
    countryId: "643",
    city: "Ufa",
    date: "22-03-2011",
    lat: 54.738762,
    long: 55.972054,
  },

  {
    countryId: "156",
    city: "Hainan",
    date: "19-11-2011",
    lat: 18.252848,
    long: 109.511909,
  },
  {
    countryId: "156",
    city: "Shanghai",
    date: "19-11-2011",
    lat: 31.230391,
    long: 121.473701,
  },

  // 2013
  {
    countryId: "643",
    city: "Moscow",
    date: "23-01-2013",
    lat: 55.755825,
    long: 37.617298,
  },
  {
    countryId: "643",
    city: "Moscow",
    date: "02-07-2013",
    lat: 55.755825,
    long: 37.617298,
  },
  {
    countryId: "356",
    city: "Goa",
    date: "12-11-2013",
    lat: 15.299326,
    long: 74.123993,
  },

  // 2014
  {
    countryId: "643",
    city: "Moscow",
    date: "23-01-2014",
    lat: 55.755825,
    long: 37.617298,
  },
  {
    countryId: "643",
    city: "Moscow",
    date: "02-07-2014",
    lat: 55.755825,
    long: 37.617298,
  },
  {
    countryId: "643",
    city: "Yoshkar Ola",
    date: "12-11-2014",
    lat: 56.632339,
    long: 47.894089,
  },

  // 2016
  {
    countryId: "643",
    city: "Moscow",
    date: "09-10-2016",
    lat: 55.755825,
    long: 37.617298,
  },
  {
    countryId: "643",
    city: "Gubaha",
    date: "12-12-2016",
    lat: 58.83992,
    long: 57.55243,
  },

  // 2017
  {
    countryId: "643",
    city: "Bannoe",
    date: "13-02-2017",
    lat: 53.590518,
    long: 58.583109,
  },
  {
    countryId: "428",
    city: "Riga",
    date: "27-07-2017",
    lat: 56.94965,
    long: 24.105186,
  },
  {
    countryId: "203",
    city: "Prague",
    date: "29-07-2017",
    lat: 50.075539,
    long: 14.4378,
  },
  {
    countryId: "276",
    city: "Saxon Switzerland",
    date: "01-08-2017",
    lat: 50.917675,
    long: 14.319574,
  },

  // 2018
  {
    countryId: "643",
    city: "Bannoe",
    date: "11-02-2018",
    lat: 53.590518,
    long: 58.583109,
  },
  {
    countryId: "643",
    city: "Mratkino",
    date: "13-02-2018",
    lat: 53.995518,
    long: 58.446874,
  },
  {
    countryId: "203",
    city: "Prague",
    date: "05-07-2018",
    lat: 50.075539,
    long: 14.4378,
  },

  {
    countryId: "643",
    city: "Moscow",
    date: "01-10-2018",
    lat: 55.755825,
    long: 37.617298,
  },
  {
    countryId: "752",
    city: "Stockholm",
    date: "01-10-2018",
    lat: 59.329323,
    long: 18.068581,
  },

  // 2019
  {
    countryId: "214",
    city: "Boca Chica",
    date: "01-02-2019",
    lat: 18.456169,
    long: -69.610046,
  },
  {
    countryId: "643",
    city: "Moscow",
    date: "07-02-2019",
    lat: 55.755825,
    long: 37.617298,
  },

  {
    countryId: "752",
    city: "Stockholm",
    date: "25-03-2019",
    lat: 59.329323,
    long: 18.068581,
  },
  {
    countryId: "528",
    city: "Amsterdam",
    date: "27-03-2019",
    lat: 52.370216,
    long: 4.895168,
  },
  {
    countryId: "643",
    city: "Moscow",
    date: "29-03-2019",
    lat: 55.755825,
    long: 37.617298,
  },

  {
    countryId: "643",
    city: "Moscow",
    date: "25-04-2019",
    lat: 55.755825,
    long: 37.617298,
  },

  {
    countryId: "643",
    city: "Moscow",
    date: "24-06-2019",
    lat: 55.755825,
    long: 37.617298,
  },

  {
    countryId: "752",
    city: "Stockholm",
    date: "29-06-2019",
    lat: 59.329323,
    long: 18.068581,
  },

  {
    countryId: "250",
    city: "Paris",
    date: "12-07-2019",
    lat: 48.856788,
    long: 2.351077,
  },

  {
    countryId: "752",
    city: "Stockholm",
    date: "27-07-2019",
    lat: 59.329323,
    long: 18.068581,
    relocated: true,
  },

  {
    countryId: "040",
    city: "Vienna",
    date: "16-08-2019",
    lat: 48.209206,
    long: 16.372778,
  },

  {
    countryId: "528",
    city: "Amsterdam",
    date: "01-08-2019",
    lat: 52.370216,
    long: 4.895168,
  },

  {
    countryId: "250",
    city: "Paris",
    date: "23-09-2019",
    lat: 48.856788,
    long: 2.351077,
  },

  {
    countryId: "250",
    city: "Paris",
    date: "04-10-2019",
    lat: 48.856788,
    long: 2.351077,
  },

  {
    countryId: "276",
    city: "Berlin",
    date: "02-10-2019",
    lat: 52.517632,
    long: 13.409657,
  },
  {
    countryId: "208",
    city: "Copenhagen",
    date: "04-10-2019",
    lat: 55.675757,
    long: 12.569023,
  },
  {
    countryId: "643",
    city: "Kazan",
    date: "28-12-2019",
    lat: 55.830433,
    long: 49.066082,
  },

  // 2020
  {
    countryId: "643",
    city: "Moscow",
    date: "25-01-2020",
    lat: 55.755825,
    long: 37.617298,
  },
  {
    countryId: "144",
    city: "Weligama",
    date: "27-01-2020",
    lat: 5.977378,
    long: 80.428848,
  },
  {
    countryId: "144",
    city: "Mirissa",
    date: "28-01-2020",
    lat: 5.9493634,
    long: 80.4558128,
  },
  {
    countryId: "144",
    city: "Galle",
    date: "29-01-2020",
    lat: 6.0328139,
    long: 80.214955,
  },
  {
    countryId: "144",
    city: "Nuwara Eliya",
    date: "03-02-2020",
    lat: 6.96861,
    long: 80.783943,
  },
  {
    countryId: "144",
    city: "Ella",
    date: "04-02-2020",
    lat: 6.8736058,
    long: 81.0489927,
  },
  {
    countryId: "643",
    city: "Kazan",
    date: "10-02-2020",
    lat: 55.830433,
    long: 49.066082,
  },
  {
    countryId: "752",
    city: "Gothenburg",
    date: "10-07-2020",
    lat: 57.7089,
    long: 11.9746,
  },
  {
    countryId: "380",
    city: "Milan",
    date: "18-07-2020",
    lat: 45.464203,
    long: 9.189982,
  },
  {
    countryId: "380",
    city: "Florence",
    date: "19-07-2020",
    lat: 43.769562,
    long: 11.255814,
  },
  {
    countryId: "380",
    city: "Rome",
    date: "20-07-2020",
    lat: 41.902782,
    long: 12.496365,
  },
  {
    countryId: "336",
    city: "Vatican City",
    date: "21-07-2020",
    lat: 41.819691,
    long: 12.55561,
  },
  {
    countryId: "380",
    city: "Pisa",
    date: "22-07-2020",
    lat: 43.722839,
    long: 10.401689,
  },
  {
    countryId: "380",
    city: "Genoa",
    date: "23-07-2020",
    lat: 44.4056,
    long: 8.9463,
  },
];

export let UNIQUE_COUNTRIES_VISITED = new Set();
TRIPS.forEach(({ countryId }) => {
  UNIQUE_COUNTRIES_VISITED.add(countryId);
});

export const UNIQUE_PLACES_VISITED = uniqWith(
  TRIPS,
  (a, b) => a.lat === b.lat && a.long === b.long
);
UNIQUE_PLACES_VISITED.push({
  countryId: "643",
  city: "Kazan",
  date: "29-05-1997",
  lat: 55.830433,
  long: 49.066082,
});

export const COUNTRY_EMOJI = {
  "040": "🇦🇹",
  "144": "🇱🇰",
  "156": "🇨🇳",
  "203": "🇨🇿",
  "208": "🇩🇰",
  "214": "🇩🇴",
  "250": "🇫🇷",
  "276": "🇩🇪",
  "752": "🇸🇪",
  "336": "🇻🇦",
  "356": "🇮🇳",
  "380": "🇮🇹",
  "428": "🇱🇻",
  "528": "🇳🇱",
  "643": "🇷🇺",
  "674": "🇸🇲",
  "724": "🇪🇸",
};
