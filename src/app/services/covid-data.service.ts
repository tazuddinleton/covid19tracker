import { string } from '@amcharts/amcharts4/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultTo } from 'lodash';
import { Observable, of, Subject, Subscriber } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { State } from '../models/config/app-config';
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
        this.getEveryProvince(code, d, duration);
        return;
      }
      if(this.hasStates(code)){
        this.$historicalData.next(this.mapProvinceToState(this.processData([d]), code));
        return;
      }
      this.$historicalData.next(this.processData([d]));
    });
    return this.$historicalData;
  }

  private getEveryProvince(code: string, d: HistoryRaw, duration: number){
    let pp = [...d.province];
        let p = pp.join(",");
        this.http.get<HistoryRaw[]>(`${this.appConfig.data.covidApiBase}/v3/covid-19/historical/${code}/${p}?lastdays=${duration}`)
        .subscribe((data: HistoryRaw[]) => {
          if(this.hasStates(code)){
            this.$historicalData.next(this.mapProvinceToState(this.processData(data), code));
          }else{
            this.$historicalData.next(this.processData(data));
          }
        });
  }

  private hasStates(countryCode: string): boolean{
    let country = this.appConfig.data.countriesStates.find(x=> x.abbreviation == countryCode);
    return !!country;
  }

  private mapProvinceToState(data: HistoricalData[], countryCode: string): HistoricalData[]{

    let c = this.appConfig.data.countriesStates.find(x=> x.abbreviation ==countryCode);
    let map: Map<string, State> = new Map();
    c.states.forEach(x => map.set(x.name.toLowerCase(), x));

    data.forEach(d => {
      let s = map.get(d.province);
      if(s){
        d.stateCode = s.abbreviation;
        d.stateName = s.name;
      }
    });

    return data;
  }

  private processData(data: HistoryRaw[]): HistoricalData[]{
    let res: HistoricalData[] = [];
    data.forEach(d => {
      console.log(d);
      let cases = this.transform(d.timeline.cases);
      let deaths = this.transform(d.timeline.deaths);
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

  private transform(data: any) {
    let map: Map<string, number> = new Map();
    Object.keys(data).forEach(k => {
      map.set(k, data[k])
    });
    return map;
  }

}
