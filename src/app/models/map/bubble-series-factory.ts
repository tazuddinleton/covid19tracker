import { BubbleConfig } from './bubble-config';
import * as am4maps from '@amcharts/amcharts4/maps';
import * as am4core from '@amcharts/amcharts4/core';
import { template } from 'lodash';

export class BubbleSeriesFactory {
  constructor() {}

  public static createSeries(
    config: BubbleConfig,
    mapChart: am4maps.MapChart
  ): am4maps.MapImageSeries {
    let series = mapChart.series.push(new am4maps.MapImageSeries());
    series.data = JSON.parse(JSON.stringify(config.data));

    config.fields.forEach((f) => (series.dataFields[f] = f));
    series.dataFields.value = config.valueField;

    series.tooltip.animationDuration = 0;
    series.tooltip.showInViewport = false;
    series.tooltip.background.fillOpacity = 0.2;
    series.tooltip.getStrokeFromObject = true;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fillOpacity = 0.2;
    series.tooltip.background.fill = am4core.color('#26081C');
    return series;
  }

  public static createImageTemplate(
    series: am4maps.MapImageSeries,
    parent: am4maps.MapPolygonSeries
  ): am4maps.MapImage {
    let imageTemplate = series.mapImages.template;
    // if you want bubbles to become bigger when zoomed, set this to false
    imageTemplate.nonScaling = true;
    imageTemplate.strokeOpacity = 0;
    imageTemplate.fillOpacity = 0.55;
    imageTemplate.tooltipText = `Cases: [bold]{cases}[/], Active: [bold]{active}[/], Deaths: [bold]{deaths}[/], Recovered: [bold]{recovered}[/]`;
    imageTemplate.applyOnClones = true;

    // this is needed for the tooltip to point to the top of the circle instead of the middle
    imageTemplate.adapter.add('tooltipY', (tooltipY, target) => {
      return -target.children.getIndex(0)['radius'];
    });

    // When hovered, circles become non-opaque
    var imageHoverState = imageTemplate.states.create('hover');
    imageHoverState.properties.fillOpacity = 0.8;

    // add circle inside the image
    var circle = imageTemplate.createChild(am4core.Circle);
    // this makes the circle to pulsate a bit when showing it
    circle.hiddenState.properties.scale = 0.0001;
    circle.hiddenState.transitionDuration = 2000;
    circle.defaultState.transitionDuration = 2000;
    circle.defaultState.transitionEasing = am4core.ease.elasticOut;
    // later we set fill color on template (when changing what type of data the map should show) and all the clones get the color because of this
    circle.applyOnClones = true;

    // heat rule makes the bubbles to be of a different width. Adjust min/max for smaller/bigger radius of a bubble
    series.heatRules.push({
      target: circle,
      property: 'radius',
      min: 8,
      max: 30,
      dataField: 'value',
    });

    // when data items validated, hide 0 value bubbles (because min size is set)
    series.events.on('dataitemsvalidated', () => {
      series.dataItems.each((dataItem) => {
        var mapImage = dataItem.mapImage;
        var circle = mapImage.children.getIndex(0);
        if (mapImage.dataItem.value == 0) {
          circle.hide(0);
        } else if (circle.isHidden || circle.isHiding) {
          circle.show();
        }
      });
    });

    // this places bubbles at the visual center of a country
    imageTemplate.adapter.add('latitude', (latitude, target) => {
      var polygon = parent.getPolygonById(target.dataItem.id);
      if (polygon) {
        target.disabled = false;
        return polygon.visualLatitude;
      } else {
        target.disabled = true;
      }
      return latitude;
    });

    imageTemplate.adapter.add('longitude', (longitude, target) => {
      var polygon = parent.getPolygonById(target.dataItem.id);
      if (polygon) {
        target.disabled = false;
        return polygon.visualLongitude;
      } else {
        target.disabled = true;
      }
      return longitude;
    });

    return imageTemplate;
  }
}
