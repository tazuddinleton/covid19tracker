import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { LocationService } from 'src/app/services/location.service';
import { Continent, Country } from 'src/app/models/location/location';
import { Subject, Subscription } from 'rxjs';
import { MapBuilder } from 'src/app/models/map/map-builder';
import { ThrowStmt } from '@angular/compiler';
import { CovidDataService } from 'src/app/services/covid-data.service';
import { mergeMap, map } from 'rxjs/operators';
import { CovidInfo } from 'src/app/models/covid-info';
import { Router } from '@angular/router';
import { CovidMap } from 'src/app/models/map/covid-map';
import { SubsManService } from 'src/app/services/subs-man.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  continents: Continent[];
  selectedCountryInfo: CovidInfo;
  $selectedContinent: Subject<Continent> = new Subject();

  set selectedContinent(continent: Continent){
      this.$selectedContinent.next(continent);
  }

  private continentMap: CovidMap;
  @ViewChild('mapdiv') mapContainer: ElementRef;
  @ViewChild('countryPopup') countryPopup: ElementRef<HTMLElement>;


  constructor(private loc: LocationService,
    private covData: CovidDataService,
    private router: Router, private subs: SubsManService) {}

  ngOnInit(): void {

    let s =
    this.loc.getContinents()
    .subscribe(conts => this.continents = conts);

    let s1 =
    this.$selectedContinent.pipe(
      map(c => !c ? <Continent>{} : c),
      mergeMap(continent =>
        this.covData.getCountries(continent?.countries?.map(c => c.code))
          .pipe(map(data => {
              continent?.countries?.map(country => {
                country.covidInfo = data.find(x=> x.countryInfo.iso2 === country.code)
                return country;
              });
              return continent;
          }))
        )
    ).subscribe(res => {
      this.drawSelectedContinent(res);
      console.log(res);
    });

    this.subs.add(s, s1);
  }

  ngAfterViewInit() {
      this.disposeMapChart();
      this.continentMap = new MapBuilder(this.mapContainer.nativeElement)
      .withMercatorProjection()
      .withZoomControl()
      .withHomeButton()
      .withContinents()
      .withCountries()
      .build();
  }

  drawSelectedContinent(c: Continent) {

    c.countries =  c?.countries?.filter(x=> !!x.covidInfo);

    let mapData = c?.countries?.map(country => {
      country.covidInfo.id = country.covidInfo.countryInfo.iso2
      return country.covidInfo;
    });

    this.disposeMapChart();
    this.continentMap = new MapBuilder(this.mapContainer.nativeElement)
    .withMercatorProjection()
    .withZoomControl()
    .withHomeButton()
    .withContinents(c?.name)
    .withCountries({clickHandler: ev=> this.onCountryClicked(ev)})
    .withBubbles({data: mapData, fields: ["active", "deaths", "cases", "recovered", "id"], valueField: "active"})
    .build();
  }

  private onCountryClicked(event){
    this.selectedCountryInfo = <CovidInfo>event.target.dataItem.dataContext;
    console.log(this.selectedCountryInfo);
    this.continentMap.mapChart.closeAllPopups();
    if(this.selectedCountryInfo?.countryInfo){
      setTimeout(() => this.continentMap.mapChart.openPopup(this.countryPopup.nativeElement.innerHTML));
    }
  }

  private disposeMapChart() {
    if (this.continentMap) {
      this.continentMap.mapChart.dispose();
    }
  }

  ngOnDestroy(): void {
    this.disposeMapChart();
    this.subs.clearAll();
  }
}
