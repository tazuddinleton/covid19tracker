import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppConfig, MapInfo } from '../models/config/app-config';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private _config: AppConfig;
  constructor(private http: HttpClient) {}

  async loadConfig(){
    try {
      this._config = await this.http.get<AppConfig>(environment.configUrl).toPromise();


      let map: Map<string, MapInfo> = new Map();
      for(let key in this._config.geo.geodataMap){
        map.set(key, this._config.geo.geodataMap[key])
      }
      this._config.geo.geodataMap = map;
    } catch (err) {
      this._config.error = err;
    }
  }

  get data():AppConfig{
    return this._config;
  }
}
