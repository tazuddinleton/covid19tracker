import { RawLocation } from "../location/location";

export interface AppConfig {
  title?: string,
  version?: string,
  covidApiBase?: string;
  error?: any;
  locationInfo: RawLocation[];
}
