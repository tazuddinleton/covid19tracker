import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { MapBuilder } from 'src/app/models/map/map-builder';
import * as am4maps from '@amcharts/amcharts4/maps';
import { CovidDataService } from 'src/app/services/covid-data.service';
import { HistoricalData } from 'src/app/models/covid-info';


@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss']
})
export class CovidComponent implements OnInit {

  private mapChart: am4maps.MapChart;
  selectedCountry: string;
  data: HistoricalData[]
  @ViewChild('mapdiv') mapContainer: ElementRef;

  constructor(private route: ActivatedRoute, private covData: CovidDataService) {
    route.params.subscribe(p => {
      this.selectedCountry = p['country'];
    });
   }

  ngOnInit(): void {
    this.covData.getCountrySummary(this.selectedCountry, 30)
    .subscribe(d => this.data = d);
  }

  ngAfterViewInit(){
    this.disposeMapChart();
    this.mapChart = new MapBuilder(this.mapContainer.nativeElement)
    .withMercatorProjection()
    .withZoomControl()
    .withHomeButton()
    .withCountries()
    .build();
  }

  private disposeMapChart() {
    if (this.mapChart) {
      this.mapChart.dispose();
    }
  }

  ngOnDestroy(): void {
    this.disposeMapChart();

  }
}
