import { RawLocation } from "../location/location";

export interface AppConfig {
  title?: string,
  version?: string,
  covidApiBase?: string;
  error?: any;
  geo?: Geo;
  locationInfo?: RawLocation[];

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
