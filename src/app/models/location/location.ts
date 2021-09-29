import { CountryInfo, CovidInfo } from "../covid-info";

export interface Country {
  code:string;
  name:string;
  continent?:string
  flag?:string
  covidInfo?: CovidInfo
}

export interface Continent{
  code:string;
  name:string;
  countries?: Country[];
}

export interface RawLocation{
  Continent_Name:string;
  Continent_Code:string;
  Country_Name:string;
  Two_Letter_Country_Code:string;
  Three_Letter_Country_Code:string;
  Country_Number:string;
}
