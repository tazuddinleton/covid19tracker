import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import * as _ from 'lodash';
import { MapQuality } from '../models/config/app-config';
@Injectable({
  providedIn: 'root'
})
export class GeoDataService {

  constructor(private appConfig: AppConfigService) {

  }


  getUri(countryName: string): string {
    let geo = this.appConfig.data.geo;
    let name = _.camelCase(countryName.split(",")[0]);
    let res = `${geo.dataUrl}${name}${geo.quality}.json`;
    console.log(res);
    return res;
  }

  getUriByCode(code: string): string{
    let geo = this.appConfig.data.geo;
    let country = geo.geodataMap.get(code);
    let res = `${geo.dataUrl}${country.maps[geo.quality]}.json`;
    console.log(res);
    return res;
  }
}
