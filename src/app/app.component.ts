import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppConfigService } from './services/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title: string;
  version: string;
  constructor(private config: AppConfigService){}

  ngOnInit(){
    this.title = this.config.data.title;
    this.version = this.config.data.version;
    document.getElementsByTagName('title')[0].innerText = `${this.title}`;
  }

  ngOnDestroy(){
  }
}
