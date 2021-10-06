import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { RouteSegment } from '../constants/routes';
import { RouteInstance } from '../models/route-instance';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  private n: NavigationEnd;
  private c: RouteInstance;
  constructor() { }

  parseCurrent(nav: NavigationEnd): RouteInstance{
    this.n = nav;
    this.parse();
    return this.c;
  }


  private parse(){
    let seg =
    this.n.url.split("/")
    .filter(x=> !!x);
    this.c = <RouteInstance>{countryCode: seg[0], isCovidTabular: seg[seg.length -1] === RouteSegment.COVIDTABULARVIEW};
  }
}
