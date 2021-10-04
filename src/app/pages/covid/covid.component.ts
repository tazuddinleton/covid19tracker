import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { MapBuilder } from 'src/app/models/map/map-builder';
import * as am4maps from '@amcharts/amcharts4/maps';
import { CovidDataService } from 'src/app/services/covid-data.service';
import { HistoricalData } from 'src/app/models/covid-info';
import { AppConfigService } from 'src/app/services/app-config.service';
import { LocationService } from 'src/app/services/location.service';
import * as _ from 'lodash';
import { GeoDataService } from 'src/app/services/geo-data.service';

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss']
})
export class CovidComponent implements OnInit {

  private mapChart: am4maps.MapChart;
  countryCode: string;
  countryName: string;
  data: HistoricalData[]
  @ViewChild('mapdiv') mapContainer: ElementRef;

  constructor(private route: ActivatedRoute,
    private covData: CovidDataService,
    private appConfig: AppConfigService,
    private loc: LocationService, private geoData: GeoDataService)
    {
    this.route.params.subscribe(p => {
      this.countryCode = p['country'];
      this.countryName = this.loc.getCountryName(this.countryCode);
    });
   }

  ngOnInit(): void {
    this.covData.getCountrySummary(this.countryCode, 30)
    .subscribe(d => {
      this.data = d;
      this.drawMap();
    });


  }

  ngAfterViewInit(){

  }

  private drawMap(){
    this.disposeMapChart();
    this.mapChart = new MapBuilder(this.mapContainer.nativeElement)
    .withMercatorProjection()
    .withZoomControl()
    .withHomeButton()
    .withCountries({
      geoDataUrl:this.geoData.getUriByCode(this.countryCode),
      hideAtFirst: true
    })
    .withStateBubbles({data: this.data.map(x => {
      x['id'] = 'CA-AB';
      return x;
    }), fields: ["deaths", "cases", "recovered", "id"], valueField: "cases"})
    .build();
  }

  private disposeMapChart() {
    if (this.mapChart) {
      this.mapChart.dispose();
    }
  }

  ngOnDestroy(): void {
    this.disposeMapChart();

  }
}
