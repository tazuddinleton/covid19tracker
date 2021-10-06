import { string } from '@amcharts/amcharts4/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultTo } from 'lodash';
import { Observable, of, Subject, Subscriber } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { State } from '../models/config/app-config';
import { CovidInfo, HistoricalData, HistoryRaw, UsStateResult } from '../models/covid-info';
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
    return of([]);
  }

  getCountry(code: string): Observable<CovidInfo>{
    if(!!code)
      return this.http.get<CovidInfo>(this.appConfig.data.covidApiBase + "/v3/covid-19/countries/" + code);
    return of();
  }

  getCountrySummary(code: string, duration: number): Observable<HistoricalData[]>{
    if(!code){
      return of([])
    }
    if(code === "US"){
      return this.getUsSummary(code);
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
    }, err => of());
    return this.$historicalData;
  }


  private getUsSummary(code: string): Observable<HistoricalData[]>{
    let stateMap = this.getStateMap(code);
    return this.http.get<UsStateResult[]>(`${this.appConfig.data.covidApiBase}/v3/covid-19/states`)
    .pipe(map(d => d.map(r => {
      let s = stateMap.get(r.state.toLowerCase());
      return <HistoricalData>{
        cases: r.cases,
        date: new Date(r.updated),
        deaths: r.deaths,
        stateCode: s?.abbreviation,
        stateName: s?.name,
        recovered: r.recovered,
        province: r.state
      }
    })))
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
    let map = this.getStateMap(countryCode);
    data.forEach(d => {
      let s = map.get(d.province);
      d.stateCode = s?.abbreviation;
      d.stateName = s?.name;
    });
    return data;
  }

  private processData(data: HistoryRaw[]): HistoricalData[]{
    let res: HistoricalData[] = [];
    data.forEach(d => {
      if(!d){
        return;
      }
      let cases = this.transform(d.timeline.cases);
      let deaths = this.transform(d.timeline.deaths);
      cases.forEach((v, k) => {
        res.push(<HistoricalData>{
          province: d.province['splice'] ? d.province[0] : d.province,
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

  private getStateMap(countryCode: string): Map<string, State>{
    let c = this.appConfig.data.countriesStates.find(x=> x.abbreviation == countryCode);
    let map: Map<string, State> = new Map();
    c.states.forEach(x => map.set(x.name.toLowerCase(), x));
    return map;
  }

}
