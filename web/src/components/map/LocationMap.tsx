import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface LocationMapProps {
  readonly guessLat: number;
  readonly guessLng: number;
  readonly actualLat: number;
  readonly actualLng: number;
  readonly guessLocation?: string | null;
  readonly actualLocation?: string | null;
  readonly className?: string;
}

export function LocationMap({
  guessLat,
  guessLng,
  actualLat,
  actualLng,
  guessLocation = 'Guess',
  actualLocation = 'Actual location',
  className = 'w-full h-96',
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap Contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [(guessLng + actualLng) / 2, (guessLat + actualLat) / 2],
      zoom: 2,
      minZoom: 1,
      maxZoom: 18,
    });

    const nav = new maplibregl.NavigationControl();
    map.current.addControl(nav, 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      const guessPopup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        closeOnMove: false,
        className: 'custom-popup',
      }).setHTML(
        `<div class="text-sm font-medium text-blue-600 dark:text-blue-400">GUESS: <br>${guessLocation}</div>`,
      );

      const actualPopup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        closeOnMove: false,
        className: 'custom-popup',
      }).setHTML(
        `<div class="text-sm font-medium text-green-600 dark:text-green-400">ACTUAL LOCATION: <br>${actualLocation}</div>`,
      );

      const guessMarker = new maplibregl.Marker({
        color: '#8A2BE2',
        scale: 0.8,
      })
        .setLngLat([guessLng, guessLat])
        .addTo(map.current);

      const actualMarker = new maplibregl.Marker({
        color: '#10B981',
        scale: 0.8,
      })
        .setLngLat([actualLng, actualLat])
        .addTo(map.current);

      guessMarker.getElement().addEventListener('mouseenter', () => {
        guessPopup.setLngLat([guessLng, guessLat]).addTo(map.current!);
      });

      guessMarker.getElement().addEventListener('mouseleave', () => {
        guessPopup.remove();
      });

      actualMarker.getElement().addEventListener('mouseenter', () => {
        actualPopup.setLngLat([actualLng, actualLat]).addTo(map.current!);
      });

      actualMarker.getElement().addEventListener('mouseleave', () => {
        actualPopup.remove();
      });

      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [guessLng, guessLat],
              [actualLng, actualLat],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#6B7280',
          'line-width': 2,
          'line-dasharray': [2, 2],
        },
      });

      const bounds = new maplibregl.LngLatBounds()
        .extend([guessLng, guessLat])
        .extend([actualLng, actualLat]);

      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 10,
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [guessLat, guessLng, actualLat, actualLng, guessLocation, actualLocation]);

  return <div ref={mapContainer} className={className} />;
}
