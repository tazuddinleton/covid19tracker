import * as am4maps from '@amcharts/amcharts4/maps';

export interface CovidMap {
  mapChart: am4maps.MapChart;

  continentSeries: am4maps.MapPolygonSeries;
  continentTemplate: am4maps.MapPolygon;

  countrySeries: am4maps.MapPolygonSeries;
  countryTemplate: am4maps.MapPolygon;

  bubbleSeries: am4maps.MapImageSeries;
  bubbleTemplate: am4maps.MapPolygon;
}
