import { RouteSegment } from "../constants/routes";

export interface RouteInstance{
  countryCode: string;
  lastSegment: RouteSegment;
  isCovidTabular: boolean;
}
