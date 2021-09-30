import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigService } from './services/app-config.service';
import { HomeComponent } from './pages/home/home.component';
import { CovidComponent } from './pages/covid/covid.component';
import { VaccineComponent } from './pages/vaccine/vaccine.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';


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
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    DropdownModule
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
