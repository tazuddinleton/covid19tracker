import { RawLocation } from "../location/location";

export interface AppConfig {
  title?: string;
  version?: string;
  api?: Api;
  pastDataDuration: number;
  error?: any;
  geo?: Geo;
  locationInfo?: RawLocation[];
  countriesStates?: CountryState[];
}
export interface Api{
  covidApiBase?: string;
  countries?: string;
  historical?: string;
  states?: string;
}

export interface Geo {
  dataUrl?: string;
  quality?: MapQuality;
  geodataMap: Map<string, MapInfo>;
}

export interface MapInfo{
  country: string;
  continent_code: string;
  continent: string;
  maps: string[];
}

export enum MapQuality{
  Low = 0, High = 1
}

export interface CountryState{
  name: string;
  abbreviation: string,
  states: State[]
}

export interface State{
  name: string;
  abbreviation: string;
}
