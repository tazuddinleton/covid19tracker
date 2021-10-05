import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as _ from 'lodash';
import { CovidInfo } from '../covid-info';
import { CountryConfig } from './country-config';
import { BubbleConfig } from './bubble-config';
import { CovidMap } from './covid-map';
import { HomeButtonFactory } from './home-button-factory';
import { CountrySeriesFactory } from './country-series-factory';
import { BubbleSeriesFactory } from './bubble-series-factory';

export class ContinentMapBuilder {
  private readonly mapChart: am4maps.MapChart;
  private continentSeries: am4maps.MapPolygonSeries;
  private continentTemplate: am4maps.MapPolygon;

  private countrySeries: am4maps.MapPolygonSeries;
  private countryTemplate: am4maps.MapPolygon;

  private bubbleSeries: am4maps.MapImageSeries;
  private bubbleTemplate: am4maps.MapPolygon;

  private hoverColor: am4core.Color = am4core.color('#01BAEF');
  private homeButton: am4core.Button;

  private callbacks: Function[] = [];

  constructor(
    private readonly container: HTMLElement,
    private readonly themes: am4core.ITheme[] = [am4themes_animated]
  ) {
    this.themes.forEach((th) => am4core.useTheme(th));
    this.mapChart = am4core.create(this.container, am4maps.MapChart);
  }

  goHome = () => {
    this.hideCountries();
    this.mapChart.goHome();
  };
  withMercatorProjection(): ContinentMapBuilder {
    this.mapChart.projection = new am4maps.projections.Mercator();
    return this;
  }

  withZoomControl(): ContinentMapBuilder {
    this.mapChart.zoomControl = new am4maps.ZoomControl();
    return this;
  }

  withHomeButton() {
    this.homeButton = HomeButtonFactory.create(this.goHome, this.mapChart);
    return this;
  }

  withContinents(selected?: string) {
    // Continents
    this.continentSeries = this.mapChart.series.push(
      new am4maps.MapPolygonSeries()
    );
    this.continentSeries.geodata = am4geodata_continentsLow;
    this.continentSeries.useGeodata = true;
    this.continentSeries.exclude = ['antarctica'];

    this.continentTemplate = this.continentSeries.mapPolygons.template;
    this.continentTemplate.tooltipText = '{name}';
    this.continentTemplate.properties.fillOpacity = 0.8; // Reduce conflict with back to continents map label
    this.continentTemplate.propertyFields.fill = 'color';
    this.continentTemplate.nonScalingStroke = true;

    //this.continentTemplate.events.on('hit', (ev) => this.zoomToContinent(ev.target));

    // var contintentHover = this.continentTemplate.states.create('hover');
    // contintentHover.properties.fill = this.hoverColor;
    // contintentHover.properties.stroke = this.hoverColor;

    var continentActive = this.continentTemplate.states.create('active');
    continentActive.properties.fill = this.hoverColor;
    continentActive.properties.stroke = this.hoverColor;

    this.continentSeries.dataFields.zoomLevel = 'zoomLevel';
    this.continentSeries.dataFields.zoomGeoPoint = 'zoomGeoPoint';

    this.continentSeries.data = [
      {
        id: 'africa',
      },
      {
        id: 'asia',
        zoomLevel: 2,
        zoomGeoPoint: {
          latitude: 46,
          longitude: 89,
        },
      },
      {
        id: 'oceania',
      },
      {
        id: 'europe',
      },
      {
        id: 'northAmerica',
      },
      {
        id: 'southAmerica',
      },
    ];

    if (selected) {
      let sid = _.camelCase(selected);
      this.continentSeries.data = this.continentSeries.data.map((x) => {
        if (x.id == sid) {
          x['color'] = this.mapChart.colors.getIndex(22);
        }
        return x;
      });
      this.callbacks.push(() => {
        this.showCountries();
        this.mapChart.zoomToMapObject(this.continentSeries.getPolygonById(sid));
      });
    } else {
      this.callbacks.push(() => {
        this.hideCountries();
        this.mapChart.goHome();
      });
    }
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

    this.countryTemplate = CountrySeriesFactory.createTemplate(
      this.countrySeries
    );
    let countryHover = CountrySeriesFactory.createHover(this.countryTemplate);

    if (config?.clickHandler) {
      this.countryTemplate.events.on('hit', config?.clickHandler);
    }

    if (config?.included?.length) {
      this.countrySeries.include = config?.included;
    }

    // Hide each country so we can fade them in
    if (config?.hideAtFirst) {
      this.hideCountries();
      this.countrySeries.events.once('inited', () => {
        this.hideCountries();
      });
    }

    return this;
  }

  withBubbles(config: BubbleConfig): ContinentMapBuilder {
    if (!config?.data?.length) {
      return this;
    }

    this.bubbleSeries = BubbleSeriesFactory.createSeries(config, this.mapChart);
    this.setDataToCountrySeries(config.data, config);

    let imageTemplate = BubbleSeriesFactory.createImageTemplate(
      this.bubbleSeries,
      this.countrySeries,
      "Country: {country}"
    );
    return this;
  }

  build(): CovidMap {
    setTimeout(() => {
      this.callbacks.forEach((fn) => fn());
    }, 0);

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
  }
}
