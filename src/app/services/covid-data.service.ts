import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CovidInfo } from '../models/covid-info';
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
}
