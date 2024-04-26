import { Component, ElementRef, NgZone, effect, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Feature, Map, View } from 'ol';
import { Point, Polygon } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { Projection, fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';

import { DragRotate, defaults as defaultInteractions } from "ol/interaction";
import { platformModifierKeyOnly } from 'ol/events/condition';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ng-openlayers-canvas-bug';

  olDiv$$ = viewChild<ElementRef>('ol');
  zone = inject(NgZone);

  map = this.zone.runOutsideAngular(() => new Map({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      new VectorLayer({
        source: new VectorSource({
          features: [
            // just add some features to see if the canvas is working
            new Feature({
              geometry: new Point(fromLonLat([0, 0])),
            }),
            // norway feature
            new Feature({
              geometry: new Point(fromLonLat([10.7522, 59.9139])),
            }),

            // feature polygon around europe
            new Feature({
              geometry: new Polygon([
                [
                  fromLonLat([-10, 35]),
                  fromLonLat([40, 35]),
                  fromLonLat([40, 70]),
                  fromLonLat([-10, 70]),
                  fromLonLat([-10, 35]),
                ],
              ])
            }),


            // feature polygon around usa
            new Feature({
              geometry: new Polygon([
                [
                  fromLonLat([-130, 20]),
                  fromLonLat([-60, 20]),
                  fromLonLat([-60, 50]),
                  fromLonLat([-130, 50]),
                  fromLonLat([-130, 20]),
                ],
              ])
            }),

          ]
        })
      })
    ],
    interactions: defaultInteractions().extend([
      new DragRotate({ condition: platformModifierKeyOnly })
    ]),
    view: new View({
      center: fromLonLat([10.7522, 59.9139]),
      zoom: 5,
      rotation: Math.PI/2
    }),
  }))

  olElementEffectRef = effect(() => {
    const elementRef = this.olDiv$$();
    if (elementRef) {
      this.map.setTarget(elementRef.nativeElement);
    }
  })
}
