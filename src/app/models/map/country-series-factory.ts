import * as am4maps from '@amcharts/amcharts4/maps';
import * as am4core from '@amcharts/amcharts4/core';

import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import { CountryConfig } from './country-config';



export class CountrySeriesFactory {
  constructor() {
  }

  public static createSeries(mapChart: am4maps.MapChart, config: CountryConfig, doneCallback: () => void): am4maps.MapPolygonSeries {
    let countrySeries = new am4maps.MapPolygonSeries();
    mapChart.series.push(countrySeries);

    countrySeries.visible = !!config?.hideAtFirst; // start off as hidden
    countrySeries.useGeodata = true;
    countrySeries.exclude = ['AQ'];
    countrySeries.dataFields.id = "id";

    if (config?.geoDataUrl) {
      countrySeries.geodataSource.url = config?.geoDataUrl;
      countrySeries.geodataSource.load();
      countrySeries.geodataSource.events.on('done', doneCallback);
    } else {
      countrySeries.geodata = am4geodata_worldLow;
    }

    countrySeries.geodata = am4geodata_worldLow;

    countrySeries.nonScalingStroke = true;
    countrySeries.strokeWidth = 0.5;
    countrySeries.calculateVisualCenter = true;
    return countrySeries;
  }


  public static createTemplate(series: am4maps.MapPolygonSeries): am4maps.MapPolygon{

    let template = series.mapPolygons.template;

    template.applyOnClones = true;
    template.fill = am4core.color('#3333dd');
    template.fillOpacity = 0.3; // see continents underneath, however, country shapes are more detailed than continents.
    template.strokeOpacity = 0.15
    template.setStateOnChildren = true;
    template.tooltipPosition = "fixed";
    template.nonScalingStroke = true;

    template.tooltipText = '{name}';
    return template;
  }

  public static createHover(template: am4maps.MapPolygon): any{

    let countryHover = template.states.create('hover');
    countryHover.properties.fill = am4core.color('#a791b4'); // todo: take this from config
    countryHover.properties.fillOpacity = 0.8;
    countryHover.properties.stroke = am4core.color('#a791b4'); // todo: take this from config
    countryHover.properties.strokeOpacity = 1;

    return countryHover;
  }
}
