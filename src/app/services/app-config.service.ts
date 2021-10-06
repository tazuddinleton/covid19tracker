import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppConfig, MapInfo } from '../models/config/app-config';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: AppConfig;
  constructor(private http: HttpClient) {}

  loadConfig(){
    return this.http.get<AppConfig>(environment.configUrl)
    .toPromise()
    .then(data => {
      this.config = data;
      this.prepareMap();
    })
    .catch(err => this.config.error = err);
   }
  get data():AppConfig{
    return this.config;
  }

  private prepareMap(){
    let map: Map<string, MapInfo> = new Map();
    for(let key in this.config.geo.geodataMap){
      map.set(key, this.config.geo.geodataMap[key])
    }
    this.config.geo.geodataMap = map;
  }
}
