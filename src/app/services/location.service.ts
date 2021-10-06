import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {map} from 'rxjs/operators'
import { CountryCode } from '../constants/country';
import { Continent, Country, RawLocation } from '../models/location/location';
import { LocUtils } from '../utils/locationUtil';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private continents: Map<string, Continent> = new Map();
  private countryCodeNameMap: Map<string, string> = new Map();

  constructor(private appConfig: AppConfigService) {
    this.prepareMap();
  }

  getContinent(key: string): Observable<Continent> {
    return of(this.continents.get(key));
  }

  getContinents():Observable<Continent[]> {
    return of([...this.continents.values()].filter(x=> x.code !== CountryCode.AN));
  }

  getCountryCodes(contCode: string): Observable<string[]>{
    return this.getContinent(contCode).pipe(map(cont => cont.countries.map(c=> c.code)));
  }

  getCountryName(code: string): string{
    return this.countryCodeNameMap.get(code);
  }

  prepareMap(){
    this.appConfig.data.locationInfo.forEach((rl: RawLocation) => {
      let country = LocUtils.asCountry(rl);
      if(this.continents.has(rl.Continent_Code)){
        this.continents.get(rl.Continent_Code).countries.push(country);
      }else{
        this.continents.set(rl.Continent_Code, LocUtils.asContinent(rl));
      }

      if(!this.countryCodeNameMap.get(country.code)){
        this.countryCodeNameMap.set(country.code, country.name);
      }
    });
  }

}
