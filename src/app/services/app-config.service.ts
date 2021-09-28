import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../models/config/app-config';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private _config: AppConfig;
  constructor(private http: HttpClient) {}

  async loadConfig(){
    try {
      this._config = await this.http.get<AppConfig>(environment.configUrl).toPromise();
    } catch (err) {
      this._config.error = err;
    }
  }

  get data():AppConfig{
    return this._config;
  }
}
