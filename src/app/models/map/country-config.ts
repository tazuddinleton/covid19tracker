import { SpritePointerTypeEvent } from "@amcharts/amcharts4/.internal/core/SpriteEvents";

export interface CountryConfig{
  clickHandler?:(ev: SpritePointerTypeEvent) => void
  included?: string[];
  hideAtFirst?: boolean;
  geoDataUrl?: string;
}
