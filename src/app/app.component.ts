import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppConfigService } from './services/app-config.service';
import { StateManService } from './services/state-man.service';
import { SubsManService } from './services/subs-man.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title: string;
  version: string;
  constructor(private config: AppConfigService, private stateMan: StateManService, private subsMan: SubsManService){}

  private _selectedCountryCode: string;
  get selectedCountryCode (): string{
    return this._selectedCountryCode;
  }

  ngOnInit(){
    this.title = this.config.data.title;
    this.version = this.config.data.version;
    document.getElementsByTagName('title')[0].innerText = `${this.title}`;

    let s =
    this.stateMan.getSelectedCountryCode().subscribe(code => {
      this._selectedCountryCode = code;
    });
    this.subsMan.add(s);
  }

  ngOnDestroy(){
    this.subsMan.clearAll();
  }
}
