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
    this.http.get<AppConfig>(environment.configUrl)
    .toPromise()
    .then(data => this.config = data)
    .catch(err => this.config.error = err);
   }
  get data():AppConfig{
    return this.config;
  }
}
