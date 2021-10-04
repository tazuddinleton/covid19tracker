import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

export interface CovidMap{
  mapChart: am4maps.MapChart;

   continentSeries: am4maps.MapPolygonSeries;
   continentTemplate: am4maps.MapPolygon;

   countrySeries: am4maps.MapPolygonSeries;
   countryTemplate: am4maps.MapPolygon;

   bubbleSeries: am4maps.MapImageSeries;
   bubbleTemplate: am4maps.MapPolygon;
}
