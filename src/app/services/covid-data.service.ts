import { string } from '@amcharts/amcharts4/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultTo } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CovidInfo, HistoricalData, HistoryRaw } from '../models/covid-info';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {

  constructor(private http: HttpClient, private appConfig: AppConfigService) {

  }

  getCountries(countryCodes: string[]): Observable<CovidInfo[]>{
    if(!!countryCodes)
      return this.http.get<CovidInfo[]>(this.appConfig.data.covidApiBase + "/v3/covid-19/countries/" + countryCodes.join(","));
    else
      return of([]);
  }

  getCountrySummary(code: string, duration: number): Observable<HistoricalData[]>{
    if(!code){
      return of([])
    }
    return this.http.get<HistoryRaw>(`${this.appConfig.data.covidApiBase}/v3/covid-19/historical/${code}?lastdays=${duration}`)
    .pipe(map((d: HistoryRaw) => {
      let cases = this.project(d.timeline.cases);
      let deaths = this.project(d.timeline.deaths);
      let res: HistoricalData[] = [];
      cases.forEach((v, k) => {
        res.push(<HistoricalData>{
          date: new Date(k),
          cases: v,
          deaths: deaths.get(k),
          recovered: v-deaths.get(k)
        })
      });
      return res;
    }))
  }

  private project(data: any) {
    let map: Map<string, number> = new Map();
    Object.keys(data).forEach(k => {
      map.set(k, data[k])
    });
    return map;
  }

}
