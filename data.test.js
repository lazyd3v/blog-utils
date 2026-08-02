import { execFileSync } from "node:child_process";

describe("Trip country metadata", () => {
  it("uses Luxembourg's ISO 3166-1 numeric code", () => {
    const output = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `import { COUNTRY_EMOJI, TRIPS } from "./data.js";
         const luxembourg = TRIPS.find((trip) => trip.city === "Luxembourg");
         process.stdout.write(JSON.stringify({
           countryId: luxembourg.countryId,
           emoji: COUNTRY_EMOJI[luxembourg.countryId],
         }));`,
      ],
      { cwd: process.cwd(), encoding: "utf8" }
    );
    const luxembourg = JSON.parse(output);

    expect(luxembourg.countryId).toBe("442");
    expect(luxembourg.emoji).toBe("🇱🇺");
  });
});
