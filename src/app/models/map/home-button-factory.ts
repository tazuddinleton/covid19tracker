import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';

export class HomeButtonFactory{

  constructor(){

  }

  public static create(callback: () => void, mapChart: am4maps.MapChart): am4core.Button {
    let btn = new am4core.Button();
    btn.events.on('hit', callback);
    btn.icon = new am4core.Sprite();
    btn.padding(7, 5, 7, 5);
    btn.width = 30;
    btn.icon.path =
      'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
      btn.marginBottom = 10;
      btn.parent = mapChart.zoomControl;
      btn.insertBefore(mapChart.zoomControl.plusButton);
    return btn;
  }
}



