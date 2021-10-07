import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take, takeLast } from 'rxjs/operators';

import { Field, Param, Province } from 'src/app/constants/data-fields';
import { CovidInfo, HistoricalData } from 'src/app/models/covid-info';
import { ContinentMapBuilder } from 'src/app/models/map/continent-map-builder';
import { CountryMapBuilder } from 'src/app/models/map/country-map-builder';
import { CovidMap } from 'src/app/models/map/covid-map';
import { RouteInstance } from 'src/app/models/route-instance';
import { AppConfigService } from 'src/app/services/app-config.service';
import { CovidDataService } from 'src/app/services/covid-data.service';
import { GeoDataService } from 'src/app/services/geo-data.service';
import { LocationService } from 'src/app/services/location.service';
import { RoutingService } from 'src/app/services/routing.service';
import { SubsMan } from 'src/app/utils/subs-man';

@Component({
  selector: 'app-covid-map',
  templateUrl: './covid-tab-panel.component.html',
  styleUrls: ['./covid-tab-panel.component.scss']
})
export class CovidTabPanelComponent implements AfterViewInit, OnDestroy{


  private countryMap: CovidMap;

  countryName: string;
  data: HistoricalData[]
  @ViewChild('mapdiv') mapContainer: ElementRef;

  private subs: SubsMan = new SubsMan();
  private currentRoute: RouteInstance;

  get isTabular():Boolean{
    return this.currentRoute.isCovidTabular;
  }

  get countryCode(): string{
    return this.currentRoute.countryCode;
  }

  constructor(private route: ActivatedRoute,
    private covData: CovidDataService,
    private appConfig: AppConfigService,
    private loc: LocationService, private geoData: GeoDataService, private router: Router, private routing: RoutingService)
    {
      this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), take(1), map((e: NavigationEnd) => this.routing.parseCurrent(e)))
      .subscribe(r => {
        this.currentRoute = r;
        console.log(this.currentRoute);
      });
   }

  ngAfterViewInit(){
    let s =
    this.covData.getCountrySummary(this.countryCode, this.appConfig.data.pastDataDuration)
    .pipe(map(d => d.map(data => this.assignId(data))))
    .subscribe(d => {
      this.data = d;
      this.drawMap();
    });
    this.subs.add(s);
  }

  private assignId(d: HistoricalData): HistoricalData{
    d.id = d.stateCode ? `${this.countryCode}-${d.stateCode}` : d.province;
    return d;
  }

  private drawMap(){
    if(this.isTabular){
      return;
    }
    if(this.statesAvailable()){
      this.drawStates();
      return;
    }
    this.drawSelectedCountry(this.countryCode);
  }

  private statesAvailable(): boolean{
    return this.data[0].province !== Province.MAINLAND
  }

  private drawStates(){
    this.disposeMapChart();
    this.countryMap = new CountryMapBuilder(this.mapContainer.nativeElement)
    .withMercatorProjection()
    .withZoomControl()
    .withHomeButton()
    .withCountries({
      geoDataUrl:this.geoData.getUriByCode(this.countryCode),
      hideAtFirst: true,
      data: this.data
    })
    .withStateBubbles({data: this.data, fields: [Field.CASES, Field.DEATHS, Field.RECOVERED, Field.ID], valueField: Field.CASES})
    .build();
  }

  private drawSelectedCountry(code: string){
    this.covData.getCountry(code)
    .subscribe((covidInfo: CovidInfo)=> {
      covidInfo.id = covidInfo.countryInfo.iso2;
      this.disposeMapChart();
      this.countryMap = new ContinentMapBuilder(this.mapContainer.nativeElement)
      .withMercatorProjection()
      .withZoomControl()
      .withHomeButtonForSinleCountry()
      .withCountries({included: [code]})
      .withBubbles({data: [covidInfo], fields: [Field.ACTIVE, Field.DEATHS, Field.CASES, Field.RECOVERED, Field.ID], valueField: Field.ACTIVE})
      .build();
    });

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

  navigate(){
    console.log('hello');
  }

}
