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






export class MapBuilder {
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

  goHome =  ()=> {
      this.hideCountries();
      this.mapChart.goHome();
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
    this.homeButton = new am4core.Button();
    this.homeButton.events.on('hit', this.goHome );
    this.homeButton.icon = new am4core.Sprite();
    this.homeButton.padding(7, 5, 7, 5);
    this.homeButton.width = 30;
    this.homeButton.icon.path =
      'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
      this.homeButton.marginBottom = 10;
      this.homeButton.parent = this.mapChart.zoomControl;
      this.homeButton.insertBefore(this.mapChart.zoomControl.plusButton);
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
          x['color'] = this.mapChart.colors.getIndex(2);
        }
        return x;
      });
      this.callbacks.push(() => {
        this.showCountries();
        this.mapChart.zoomToMapObject(this.continentSeries.getPolygonById(sid));
      })
    }else{
      this.callbacks.push(() => {
        this.hideCountries();
        this.mapChart.goHome();
      })
    }
    return this;
  }

  withCountries(config?: CountryConfig) {

    this.countrySeries = new am4maps.MapPolygonSeries();
    this.mapChart.series.push(this.countrySeries);

    var countries = this.countrySeries.mapPolygons;
    this.countrySeries.visible = !!config?.hideAtFirst; // start off as hidden
    this.countrySeries.useGeodata = true;
    this.countrySeries.exclude = ['AQ'];
    this.countrySeries.dataFields.id = "id";


    if(config?.geoDataUrl){
      console.log(config);
      this.countrySeries.geodataSource.url = config?.geoDataUrl;
      this.countrySeries.geodataSource.load();
      this.countrySeries.geodataSource.events.on('done', (ev) => {
        this.showCountries();
        console.log('showCountries')
      })
    }else{
      this.countrySeries.geodata = am4geodata_worldLow;
    }

    this.countryTemplate = countries.template;
    this.countryTemplate.applyOnClones = true;
    this.countryTemplate.fill = am4core.color('#a791b4');
    this.countryTemplate.fillOpacity = 0.3; // see continents underneath, however, country shapes are more detailed than continents.
    this.countryTemplate.strokeOpacity = 0.5;
    this.countryTemplate.nonScalingStroke = true;
    this.countryTemplate.tooltipText = '{name}';

    var countryHover = this.countryTemplate.states.create('hover');
    countryHover.properties.fill = this.hoverColor;
    countryHover.properties.fillOpacity = 0.8; // Reduce conflict with back to continents map label
    countryHover.properties.stroke = this.hoverColor;
    countryHover.properties.strokeOpacity = 1;

  if(config?.clickHandler){
      this.countryTemplate.events.on('hit', config?.clickHandler);
    }

    if(config?.included?.length){
      this.countrySeries.include = config?.included;
    }

      // Hide each country so we can fade them in
    if(config?.hideAtFirst){
      this.hideCountries();
      this.countrySeries.events.once('inited', () => {
        this.hideCountries();
      });
    }

    return this;
  }

  withBubbles(config: BubbleConfig): MapBuilder{

    if(!config?.data?.length){
      return this;
    }

    // Bubble series
  this.bubbleSeries = this.mapChart.series.push(new am4maps.MapImageSeries());
  this.bubbleSeries.data = JSON.parse(JSON.stringify(config.data));

  config.fields.forEach(f => this.bubbleSeries.dataFields[f]=f);
  this.bubbleSeries.dataFields.value = config.valueField;

  this.setDataToCountrySeries(config.data);


  // adjust tooltip
  this.bubbleSeries.tooltip.animationDuration = 0;
  this.bubbleSeries.tooltip.showInViewport = false;
  this.bubbleSeries.tooltip.background.fillOpacity = 0.2;
  this.bubbleSeries.tooltip.getStrokeFromObject = true;
  this.bubbleSeries.tooltip.getFillFromObject = false;
  this.bubbleSeries.tooltip.background.fillOpacity = 0.2;
  this.bubbleSeries.tooltip.background.fill = am4core.color("#26081C");

  var imageTemplate = this.bubbleSeries.mapImages.template;
  // if you want bubbles to become bigger when zoomed, set this to false
  imageTemplate.nonScaling = true;
  imageTemplate.strokeOpacity = 0;
  imageTemplate.fillOpacity = 0.55;
  imageTemplate.tooltipText = `Cases: [bold]{cases}[/], Active: [bold]{active}[/], Deaths: [bold]{deaths}[/], Recovered: [bold]{recovered}[/]`;
  imageTemplate.applyOnClones = true;

  // this is needed for the tooltip to point to the top of the circle instead of the middle
  imageTemplate.adapter.add("tooltipY", (tooltipY, target) => {
    return -target.children.getIndex(0)['radius'];
  })

  // When hovered, circles become non-opaque
  var imageHoverState = imageTemplate.states.create("hover");
  imageHoverState.properties.fillOpacity = .80;

  // add circle inside the image
  var circle = imageTemplate.createChild(am4core.Circle);
  // this makes the circle to pulsate a bit when showing it
  circle.hiddenState.properties.scale = 0.0001;
  circle.hiddenState.transitionDuration = 2000;
  circle.defaultState.transitionDuration = 2000;
  circle.defaultState.transitionEasing = am4core.ease.elasticOut;
  // later we set fill color on template (when changing what type of data the map should show) and all the clones get the color because of this
  circle.applyOnClones = true;

  // heat rule makes the bubbles to be of a different width. Adjust min/max for smaller/bigger radius of a bubble
  this.bubbleSeries.heatRules.push({
    "target": circle,
    "property": "radius",
    "min": 10,
    "max": 100,
    "dataField": "value"
  })

  // when data items validated, hide 0 value bubbles (because min size is set)
  this.bubbleSeries.events.on("dataitemsvalidated", () => {
    this.bubbleSeries.dataItems.each((dataItem) => {
      var mapImage = dataItem.mapImage;
      var circle = mapImage.children.getIndex(0);
      if (mapImage.dataItem.value == 0) {
        circle.hide(0);
      }
      else if (circle.isHidden || circle.isHiding) {
        circle.show();
      }
    })
  })

  // this places bubbles at the visual center of a country
  imageTemplate.adapter.add("latitude", (latitude, target) => {
    var polygon = this.countrySeries.getPolygonById(target.dataItem.id);
    if (polygon) {
      target.disabled = false;
      return polygon.visualLatitude;
    }
    else {
      target.disabled = true;
    }
    return latitude;
  })

  imageTemplate.adapter.add("longitude", (longitude, target) => {
    var polygon = this.countrySeries.getPolygonById(target.dataItem.id);
    if (polygon) {
      target.disabled = false;
      return polygon.visualLongitude;
    }
    else {
      target.disabled = true;
    }
    return longitude;
  })

    return this;
  }

  build(): CovidMap {
    setTimeout(() => {
      this.callbacks.forEach(fn => fn());
    }, 0)

    return <CovidMap>{
      mapChart: this.mapChart,
      bubbleSeries: this.bubbleSeries,
      bubbleTemplate: this.bubbleTemplate,
      continentSeries: this.continentSeries,
      continentTemplate: this.continentTemplate,
      countrySeries: this.countrySeries,
      countryTemplate: this.countryTemplate,
      homButton: this.homeButton
    }
  }

  private hideCountries() {
    this.countrySeries.hide();
    this.countryTemplate.hide();
  }

  private showCountries(){
    this.countrySeries.show();
    this.countryTemplate.show();
  }


  private setDataToCountrySeries(mapData: CovidInfo[]){
    this.countrySeries.data = JSON.parse(JSON.stringify(mapData));
    this.countrySeries.dataFields.value = "active";
    this.countrySeries.dataFields['active'] = "active";
    this.countrySeries.dataFields['deaths'] = "deaths";
    this.countrySeries.dataFields['cases'] = "cases";
    this.countrySeries.dataFields['recovered'] = "recovered";
    this.countrySeries.dataFields.id = "id";
  }
}
