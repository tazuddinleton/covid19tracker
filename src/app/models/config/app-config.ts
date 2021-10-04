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
  quality?: string;
}

