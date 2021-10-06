import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { RouteSegment } from '../constants/routes';
import { RouteInstance } from '../models/route-instance';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  constructor() { }

  parseCurrent(nav: NavigationEnd): RouteInstance{
    let seg =
    nav.url.split("/")
    .filter(x=> !!x);
    return <RouteInstance>{countryCode: seg[0], isCovidTabular: seg[seg.length -1] === RouteSegment.COVIDTABULARVIEW};
  }
}
