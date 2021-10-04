import { SpritePointerTypeEvent } from "@amcharts/amcharts4/.internal/core/SpriteEvents";

// clickHandler?: (ev: SpritePointerTypeEvent) => void, included?: string[], hideCountries?: boolean, geoDataUrl?: string
export interface CountryConfig{
  clickHandler?:(ev: SpritePointerTypeEvent) => void
  included?: string[];
  hideAtFirst?: boolean;
  geoDataUrl?: string;
}
