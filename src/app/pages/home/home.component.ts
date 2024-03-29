import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';
import { Continent } from 'src/app/models/location/location';
import { Subject } from 'rxjs';
import { ContinentMapBuilder } from 'src/app/models/map/continent-map-builder';

import { CovidDataService } from 'src/app/services/covid-data.service';
import { mergeMap, map } from 'rxjs/operators';
import { CovidInfo } from 'src/app/models/covid-info';
import { CovidMap } from 'src/app/models/map/covid-map';
import {SubsMan} from '../../utils/subs-man'
import {Field} from '../../constants/data-fields'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  continents: Continent[];
  selectedCountryInfo: CovidInfo;
  private selectedContinentSubject: Subject<Continent> = new Subject();
  private subs: SubsMan = new SubsMan();
  set selectedContinent(continent: Continent){
      this.selectedContinentSubject.next(continent);
  }

  private continentMap: CovidMap;
  @ViewChild('mapdiv') mapContainer: ElementRef;
  @ViewChild('countryPopup') countryPopup: ElementRef<HTMLElement>;


  constructor(private loc: LocationService,
    private covData: CovidDataService) {}

  ngOnInit(): void {

    let s =
    this.loc.getContinents()
    .subscribe(conts => this.continents = conts, err => console.error(err));

    let s1 =
    this.selectedContinentSubject.pipe(
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
    },err => console.error(err));

    this.subs.add(s, s1);
  }

  ngAfterViewInit() {
      this.disposeMapChart();
      this.continentMap = new ContinentMapBuilder(this.mapContainer.nativeElement)
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
    this.continentMap = new ContinentMapBuilder(this.mapContainer.nativeElement)
    .withMercatorProjection()
    .withZoomControl()
    .withHomeButton()
    .withContinents(c?.name)
    .withCountries({clickHandler: ev=> this.onCountryClicked(ev)})
    .withBubbles({data: mapData, fields: [Field.ACTIVE, Field.DEATHS, Field.CASES, Field.RECOVERED, Field.ID], valueField: Field.ACTIVE})
    .build();
  }

  private onCountryClicked(event){
    this.selectedCountryInfo = <CovidInfo>event.target.dataItem.dataContext;
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
