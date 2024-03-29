import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as _ from 'lodash';
import { Continent } from '../location/location';
import { SpritePointerTypeEvent } from '@amcharts/amcharts4/.internal/core/SpriteEvents';
import { CovidInfo } from '../covid-info';
import { CountryConfig } from './country-config';
import { BubbleConfig } from './bubble-config';
import { CovidMap } from './covid-map';

import { BubbleSeriesFactory } from '../../factories/bubble-series-factory';
import { HomeButtonFactory } from 'src/app/factories/home-button-factory';
import { CountrySeriesFactory } from 'src/app/factories/country-series-factory';
import { ChartEvent } from 'src/app/constants/chart-events';
import { Field } from 'src/app/constants/data-fields';

export class CountryMapBuilder {
  private readonly mapChart: am4maps.MapChart;
  private continentSeries: am4maps.MapPolygonSeries;
  private continentTemplate: am4maps.MapPolygon;

  private countrySeries: am4maps.MapPolygonSeries;
  private countryTemplate: am4maps.MapPolygon;

  private bubbleSeries: am4maps.MapImageSeries;
  private bubbleTemplate: am4maps.MapPolygon;

  private hoverColor: am4core.Color = am4core.color('#01BAEF');
  private homeButton: am4core.Button;

  private callbacks = [];

  constructor(
    private readonly container: HTMLElement,
    private readonly themes: am4core.ITheme[] = [am4themes_animated]
  ) {
    this.themes.forEach((th) => am4core.useTheme(th));
    this.mapChart = am4core.create(this.container, am4maps.MapChart);
  }

  goHome = () => {
    this.mapChart.goHome(1000);
  };
  withMercatorProjection(): CountryMapBuilder {
    this.mapChart.projection = new am4maps.projections.Mercator();
    return this;
  }

  withZoomControl(): CountryMapBuilder {
    this.mapChart.zoomControl = new am4maps.ZoomControl();
    return this;
  }

  withHomeButton() {
    this.homeButton = HomeButtonFactory.create(this.goHome, this.mapChart);
    return this;
  }

  withCountries(config?: CountryConfig) {
    this.countrySeries = CountrySeriesFactory.createSeries(
      this.mapChart,
      config,
      () => {
        this.showCountries();
      }
    );

    this.callbacks.push(this.goHome);

    this.countryTemplate = CountrySeriesFactory.createTemplate(
      this.countrySeries
    );

    let hover = CountrySeriesFactory.createHover(this.countryTemplate);

    if (config?.clickHandler) {
      this.countryTemplate.events.on(ChartEvent.HIT, config?.clickHandler);
    }

    if (config?.included?.length) {
      this.countrySeries.include = config?.included;
    }


    // Hide each country so we can fade them in
    if (config?.hideAtFirst) {
      this.hideCountries();
      this.countrySeries.events.once(ChartEvent.INITED, () => {
        this.hideCountries();
      });
    }

    this.countrySeries.data = config.data;
    this.countrySeries.dataFields.id = Field.ID;

    return this;
  }
  withStateBubbles(config: BubbleConfig): CountryMapBuilder {
    if (!config?.data?.length) {
      return this;
    }
    this.bubbleSeries = BubbleSeriesFactory.createSeries(config, this.mapChart);

    let imageTemplate = BubbleSeriesFactory.createImageTemplate(
      this.bubbleSeries,
      this.countrySeries,
      "State: {stateName}"
    );
    this.bubbleSeries.dataFields.id = Field.ID;
    this.setDataToCountrySeries(config.data, config);
    return this;
  }

  build(): CovidMap {
    this.callbacks.forEach((fn) => {
      fn();
    });
    return <CovidMap>{
      mapChart: this.mapChart,
      bubbleSeries: this.bubbleSeries,
      bubbleTemplate: this.bubbleTemplate,
      continentSeries: this.continentSeries,
      continentTemplate: this.continentTemplate,
      countrySeries: this.countrySeries,
      countryTemplate: this.countryTemplate,
      homButton: this.homeButton,
    };
  }

  private hideCountries() {
    this.countrySeries.hide();
    this.countryTemplate.hide();
  }

  private showCountries() {
    this.countrySeries.show();
    this.countryTemplate.show();
  }


  private setDataToCountrySeries(mapData: CovidInfo[], config: BubbleConfig) {
    config.fields.forEach((f) => (this.countrySeries.dataFields[f] = f));
    this.countrySeries.dataFields.value = config.valueField;
    this.countrySeries.data = mapData;
    this.countrySeries.dataFields.id = Field.ID;
  }
}
