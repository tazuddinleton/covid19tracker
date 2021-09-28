import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {map} from 'rxjs/operators'
import { Continent, Country, RawLocation } from '../models/location/location';
import { LocUtils } from '../utils/locationUtil';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private continents: Map<string, Continent> = new Map();

  constructor(private appConfig: AppConfigService) {
    this.prepareMap();
  }

  getContinent(key: string): Observable<Continent> {
    return of(this.continents.get(key));
  }

  getContinents():Observable<Continent[]> {
    return of([...this.continents.values()]);
  }

  getCountryCodes(contCode: string): Observable<string[]>{
    return this.getContinent(contCode).pipe(map(cont => cont.countries.map(c=> c.code)));
  }

  prepareMap(){
    this.appConfig.data.locationInfo.forEach((rl: RawLocation) => {
      if(this.continents.has(rl.Continent_Code)){
        this.continents.get(rl.Continent_Code).countries.push(LocUtils.asCountry(rl));
      }else{
        this.continents.set(rl.Continent_Code, LocUtils.asContinent(rl));
      }
    });
  }

}
