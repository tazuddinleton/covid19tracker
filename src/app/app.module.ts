import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigService } from './services/app-config.service';
import { HomeComponent } from './pages/home/home.component';
import { CovidComponent } from './pages/covid/covid.component';
import { VaccineComponent } from './pages/vaccine/vaccine.component';


function appInitFactory(configService: AppConfigService): Function{
  return () => configService.loadConfig();
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CovidComponent,
    VaccineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      multi: true,
      deps: [AppConfigService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
