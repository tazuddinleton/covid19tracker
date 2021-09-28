import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(private loc: LocationService) {}

  continents: string[] = [
    'Asia',
    'Africa',
    'North America',
    'South America',
    'Europe',
    'Oceania',
  ];

  selectedContinent: string;

  ngOnInit(): void {

    this.loc.getContinents()
    .subscribe(c => console.log(c));

    this.loc.getCountryCodes("AS")
    .subscribe(c=> console.log(c));
  }

  ngAfterViewInit() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    var chart = am4core.create('mapdiv', am4maps.MapChart);

    // Set projection
    chart.projection = new am4maps.projections.Mercator();

    var restoreContinents = function () {
      hideCountries();
      chart.goHome();
    };

    // Zoom control
    chart.zoomControl = new am4maps.ZoomControl();

    var homeButton = new am4core.Button();
    homeButton.events.on('hit', restoreContinents);

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path =
      'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);

    // Shared
    var hoverColorHex = '#9a7bca';
    var hoverColor = am4core.color(hoverColorHex);
    var hideCountries = function () {
      countryTemplate.hide();
    };

    // Continents
    var continentsSeries = chart.series.push(new am4maps.MapPolygonSeries());
    continentsSeries.geodata = am4geodata_continentsLow;
    continentsSeries.useGeodata = true;
    continentsSeries.exclude = ['antarctica'];

    var continentTemplate = continentsSeries.mapPolygons.template;
    continentTemplate.tooltipText = '{name}';
    continentTemplate.properties.fillOpacity = 0.8; // Reduce conflict with back to continents map label
    continentTemplate.propertyFields.fill = 'color';
    continentTemplate.nonScalingStroke = true;
    continentTemplate.events.on('hit', function (event) {
      if (!countriesSeries.visible) countriesSeries.visible = true;
      chart.zoomToMapObject(event.target);
      countryTemplate.show();
    });

    var contintentHover = continentTemplate.states.create('hover');
    contintentHover.properties.fill = hoverColor;
    contintentHover.properties.stroke = hoverColor;

    var continentActive = continentTemplate.states.create('active');
    contintentHover.properties.fill = hoverColor;
    contintentHover.properties.stroke = hoverColor;

    continentsSeries.dataFields.zoomLevel = 'zoomLevel';
    continentsSeries.dataFields.zoomGeoPoint = 'zoomGeoPoint';

    continentsSeries.data = [
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

    // Countries

    var countriesSeries = new am4maps.MapPolygonSeries();
    chart.series.push(countriesSeries);

    var countries = countriesSeries.mapPolygons;
    countriesSeries.visible = false; // start off as hidden
    countriesSeries.exclude = ['AQ'];
    countriesSeries.geodata = am4geodata_worldLow;
    countriesSeries.useGeodata = true;
    // Hide each country so we can fade them in
    countriesSeries.events.once('inited', function () {
      hideCountries();
    });

    var countryTemplate = countries.template;
    countryTemplate.applyOnClones = true;
    countryTemplate.fill = am4core.color('#a791b4');
    countryTemplate.fillOpacity = 0.3; // see continents underneath, however, country shapes are more detailed than continents.
    countryTemplate.strokeOpacity = 0.5;
    countryTemplate.nonScalingStroke = true;
    countryTemplate.tooltipText = '{name}';
    countryTemplate.events.on('hit', function (event) {
      chart.zoomToMapObject(event.target);
    });

    var countryHover = countryTemplate.states.create('hover');
    countryHover.properties.fill = hoverColor;
    countryHover.properties.fillOpacity = 0.8; // Reduce conflict with back to continents map label
    countryHover.properties.stroke = hoverColor;
    countryHover.properties.strokeOpacity = 1;

  }
}
