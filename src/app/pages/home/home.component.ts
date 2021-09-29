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
  constructor(private loc: LocationService) {}

  ngOnInit(): void {

    this.$selectedContinent.subscribe((c: Continent) => {
      console.log("Selected continent code: ", c);
      this.drawSelectedContinent(c);
    })


    this.loc.getContinents()
    .subscribe(c => this.continents = c);

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
    .build();

  }

}
