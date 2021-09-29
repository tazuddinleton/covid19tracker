import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as _ from 'lodash';

export class MapBuilder {
  private readonly mapChart: am4maps.MapChart;
  private continentSeries: am4maps.MapPolygonSeries;
  private continentTemplate: am4maps.MapPolygon;

  private countrySeries: am4maps.MapPolygonSeries;
  private countryTemplate: am4maps.MapPolygon;

  private hoverColor: am4core.Color = am4core.color('#9a7bca');

  private callbacks: Function[] = [];

  constructor(
    private readonly container: HTMLElement,
    private readonly themes: am4core.ITheme[] = [am4themes_animated]
  ) {
    this.themes.forEach((th) => am4core.useTheme(th));
    this.mapChart = am4core.create(this.container, am4maps.MapChart);
  }

  withMercatorProjection(): MapBuilder {
    this.mapChart.projection = new am4maps.projections.Mercator();
    return this;
  }

  withZoomControl(): MapBuilder {
    this.mapChart.zoomControl = new am4maps.ZoomControl();
    return this;
  }

  withHomeButton() {
    var homeButton = new am4core.Button();
    homeButton.events.on('hit', (ev) => {
      this.hideCountries();
      this.mapChart.goHome();
    });
    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path =
      'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
    homeButton.marginBottom = 10;
    homeButton.parent = this.mapChart.zoomControl;
    homeButton.insertBefore(this.mapChart.zoomControl.plusButton);
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

    var contintentHover = this.continentTemplate.states.create('hover');
    contintentHover.properties.fill = this.hoverColor;
    contintentHover.properties.stroke = this.hoverColor;

    var continentActive = this.continentTemplate.states.create('active');
    contintentHover.properties.fill = this.hoverColor;
    contintentHover.properties.stroke = this.hoverColor;

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
          x['color'] = this.mapChart.colors.getIndex(2);
        }
        return x;
      });
      this.callbacks.push(() => {
        this.mapChart.zoomToMapObject(this.continentSeries.getPolygonById(sid));
      })
    }
    return this;
  }

  withCountries(included: string[] = [], excluded: string[] = ['AQ']) {
    this.countrySeries = new am4maps.MapPolygonSeries();
    this.mapChart.series.push(this.countrySeries);

    var countries = this.countrySeries.mapPolygons;
    this.countrySeries.visible = false; // start off as hidden
    this.countrySeries.geodata = am4geodata_worldLow;
    this.countrySeries.useGeodata = true;

    this.countrySeries.exclude = excluded;
    if (included.length > 0) {
      this.countrySeries.include = included;
    }
    // Hide each country so we can fade them in
    this.countrySeries.events.once('inited', () => {
      this.hideCountries();
    });

    this.countryTemplate = countries.template;
    this.countryTemplate.applyOnClones = true;
    this.countryTemplate.fill = am4core.color('#a791b4');
    this.countryTemplate.fillOpacity = 0.3; // see continents underneath, however, country shapes are more detailed than continents.
    this.countryTemplate.strokeOpacity = 0.5;
    this.countryTemplate.nonScalingStroke = true;
    this.countryTemplate.tooltipText = '{name}';
    this.countryTemplate.events.on('hit', (event) => {
      this.mapChart.zoomToMapObject(event.target);

    });

    var countryHover = this.countryTemplate.states.create('hover');
    countryHover.properties.fill = this.hoverColor;
    countryHover.properties.fillOpacity = 0.8; // Reduce conflict with back to continents map label
    countryHover.properties.stroke = this.hoverColor;
    countryHover.properties.strokeOpacity = 1;
    return this;
  }

  build() {
    setTimeout(() => {
      this.callbacks.forEach(fn => fn());
    }, 0)
    return this;
  }
  private hideCountries() {
    this.countryTemplate.hide();
  }

  private zoomToContinent(target: am4maps.MapObject){
    if (!this.countrySeries.visible) {
      this.countrySeries.visible = true;
    }
    this.mapChart.zoomToMapObject(target);
    this.countryTemplate.show();
  }
}
