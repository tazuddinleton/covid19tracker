import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import * as am4maps from '@amcharts/amcharts4/maps';
import { CovidDataService } from 'src/app/services/covid-data.service';
import { HistoricalData } from 'src/app/models/covid-info';
import { AppConfigService } from 'src/app/services/app-config.service';
import { LocationService } from 'src/app/services/location.service';
import * as _ from 'lodash';
import { GeoDataService } from 'src/app/services/geo-data.service';
import { CovidMap } from 'src/app/models/map/covid-map';
import { CountryMapBuilder } from 'src/app/models/map/country-map-builder';
import { SubsManService } from 'src/app/services/subs-man.service';

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss']
})
export class CovidComponent implements OnInit, OnDestroy {

  private countryMap: CovidMap;
  countryCode: string;
  countryName: string;
  data: HistoricalData[]
  @ViewChild('mapdiv') mapContainer: ElementRef;

  constructor(private route: ActivatedRoute,
    private covData: CovidDataService,
    private appConfig: AppConfigService,
    private loc: LocationService, private geoData: GeoDataService, private subs: SubsManService)
    {
    this.route.params.subscribe(p => {
      this.countryCode = p['country'];
      this.countryName = this.loc.getCountryName(this.countryCode);
    });
   }

  ngOnInit(): void {
    let s =
    this.covData.getCountrySummary(this.countryCode, this.appConfig.data.pastDataDuration)
    .subscribe(d => {
      this.data = d.map(x=> {
        x.id = x.stateCode ? `${this.countryCode}-${x.stateCode}` : x.province;
        return x;
      });
      this.drawMap();
    });

    this.subs.add(s);
  }

  ngAfterViewInit(){

  }

  private drawMap(){
    this.disposeMapChart();
    this.countryMap = new CountryMapBuilder(this.mapContainer.nativeElement)
    .withMercatorProjection()
    .withZoomControl()
    .withHomeButton()
    .withCountries({
      geoDataUrl:this.geoData.getUriByCode(this.countryCode),
      hideAtFirst: true
    })
    .withStateBubbles({data: this.data, fields: ["deaths", "cases", "recovered", "id"], valueField: "cases"})
    .build();
  }

  private disposeMapChart() {
    if (this.countryMap) {
      this.countryMap.mapChart.dispose();
    }
  }

  ngOnDestroy(): void {
    this.disposeMapChart();
    this.subs.clearAll();
  }
}
