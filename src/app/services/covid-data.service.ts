import { string } from '@amcharts/amcharts4/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultTo } from 'lodash';
import { Observable, of, Subject, Subscriber } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CovidInfo, HistoricalData, HistoryRaw } from '../models/covid-info';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {

  private $historicalData: Subject<HistoricalData[]> = new Subject();
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
    this.http.get<HistoryRaw>(`${this.appConfig.data.covidApiBase}/v3/covid-19/historical/${code}?lastdays=${duration}`)
    .subscribe((d:HistoryRaw) => {
      if(d.province.length > 1) {
        let pp = [...d.province];
        let p = pp.join(",");
        this.http.get<HistoryRaw[]>(`${this.appConfig.data.covidApiBase}/v3/covid-19/historical/${code}/${p}?lastdays=${duration}`)
        .subscribe((data: HistoryRaw[]) => {
          console.log('summary data last 30 days all province',data)
          this.$historicalData.next(this.process(data));
        });
      }
      console.log('summary data last 30 days mainland',d)
      this.$historicalData.next(this.process([d]));
    });
    return this.$historicalData;
  }


  private process(data: HistoryRaw[]): HistoricalData[]{
    let res: HistoricalData[] = [];
    data.forEach(d => {
      console.log(d);
      let cases = this.project(d.timeline.cases);
      let deaths = this.project(d.timeline.deaths);
      cases.forEach((v, k) => {
        res.push(<HistoricalData>{
          province: d.province,
          date: new Date(k),
          cases: v,
          deaths: deaths.get(k),
          recovered: v-deaths.get(k)
        })
      });
    });
    return res;
  }

  private project(data: any) {
    let map: Map<string, number> = new Map();
    Object.keys(data).forEach(k => {
      map.set(k, data[k])
    });
    return map;
  }

}
