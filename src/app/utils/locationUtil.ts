import { Continent, Country, RawLocation } from "../models/location/location";

export class LocUtils{
  public static asCountry(rl: RawLocation): Country{
    return {
      code: rl.Two_Letter_Country_Code,
      name: rl.Country_Name
    } as Country;
  }

  public static asContinent(rl: RawLocation): Country{
    return {
      code: rl.Continent_Code,
      name: rl.Continent_Name,
      countries: [LocUtils.asCountry(rl)]
    } as Continent;
  }
}
