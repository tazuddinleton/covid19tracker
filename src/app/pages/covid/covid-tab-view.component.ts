import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import * as am4maps from '@amcharts/amcharts4/maps';
import { CovidDataService } from 'src/app/services/covid-data.service';
import { CovidInfo, HistoricalData } from 'src/app/models/covid-info';
import { AppConfigService } from 'src/app/services/app-config.service';
import { LocationService } from 'src/app/services/location.service';
import * as _ from 'lodash';
import { GeoDataService } from 'src/app/services/geo-data.service';
import { CovidMap } from 'src/app/models/map/covid-map';
import { CountryMapBuilder } from 'src/app/models/map/country-map-builder';
import { ContinentMapBuilder } from 'src/app/models/map/continent-map-builder';
import { Field, Param, Province } from 'src/app/constants/data-fields';
import { SubsMan } from 'src/app/utils/subs-man';
import { RouteInstance } from 'src/app/models/route-instance';
import { RoutingService } from 'src/app/services/routing.service';
import { filter, map, take } from 'rxjs/operators';
import { RouteSegment } from 'src/app/constants/routes';

@Component({
  selector: 'app-covid-tab-view',
  templateUrl: './covid-tab-view.component.html',
  styleUrls: ['./covid-tab-view.component.scss']
})
export class CovidTabViewComponent implements OnDestroy{
  private subs: SubsMan = new SubsMan();
  private currentRoute: RouteInstance;

  get index(): number{
    return this.currentRoute.isCovidTabular ? 1 : 0;
  }

  set index(val: number){
    let r = [this.currentRoute.countryCode, RouteSegment.COVID];
    if(val){
      r.push(RouteSegment.COVIDTABULARVIEW)
    }
    this.router.navigate(r);
  }

  get countryCode(): string{
    return this.currentRoute.countryCode;
  }

  constructor(private router: Router, private routing: RoutingService){
      let s =
      this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), take(1), map((e: NavigationEnd) => this.routing.parseCurrent(e)))
      .subscribe(r => this.currentRoute = r);
      this.subs.add(s);
   }
  ngOnDestroy(): void {
    this.subs.clearAll();
  }
}
