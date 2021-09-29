import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { LocationService } from 'src/app/services/location.service';
import { Continent } from 'src/app/models/location/location';
import { Subject } from 'rxjs';
import { MapBuilder } from 'src/app/models/map/map-builder';
import { ThrowStmt } from '@angular/compiler';
import { CovidDataService } from 'src/app/services/covid-data.service';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  continents: Continent[];
  $selectedContinent: Subject<Continent> = new Subject();

  set selectedContinent(continent: Continent){
      this.$selectedContinent.next(continent);
  }


  @ViewChild('mapdiv') mapContainer: ElementRef
  constructor(private loc: LocationService, private covData: CovidDataService) {}

  ngOnInit(): void {
    this.loc.getContinents()
    .subscribe(conts => this.continents = conts);
    // todo: fix error when continent deselected
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
  }

  ngAfterViewInit() {

    let map = new MapBuilder(this.mapContainer.nativeElement)
    .withMercatorProjection()
    .withZoomControl()
    .withHomeButton()
    .withContinents()
    .withCountries()
    .build();
  }

  drawSelectedContinent(c: Continent) {
    let map = new MapBuilder(this.mapContainer.nativeElement)
    .withMercatorProjection()
    .withZoomControl()
    .withHomeButton()
    .withContinents(c?.name)
    .withCountries()
    .withBubbles(c)
    .build();
  }

}
