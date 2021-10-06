import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigService } from './services/app-config.service';
import { HomeComponent } from './pages/home/home.component';
import { CovidTabViewComponent } from './pages/covid/covid-tab-view.component';
import { VaccineComponent } from './pages/vaccine/vaccine.component';

import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';

import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { RouterStrategy } from './router-strategy';
import { CovidTabPanelComponent } from './components/covid-map/covid-tab-panel.component';




function appInitFactory(configService: AppConfigService): Function{
  return () => configService.loadConfig();
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CovidTabViewComponent,
    VaccineComponent,
    CovidTabPanelComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    DropdownModule,
    TabViewModule,
    TableModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      multi: true,
      deps: [AppConfigService]
    },
    // Todo: later enable this
    // {
    //   provide: RouteReuseStrategy,
    //   useClass: RouterStrategy
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
