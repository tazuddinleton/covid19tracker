import { Component, OnInit } from '@angular/core';
import { AppConfigService } from './services/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title: string;
  version: string;
  constructor(private config: AppConfigService){}

  ngOnInit(){
    this.title = this.config.get.title;
    this.version = this.config.get.version;
  }
}
