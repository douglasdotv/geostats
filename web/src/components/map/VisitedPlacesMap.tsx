'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { getLocationsInBounds } from '@/app/actions';
import { GuessLocation } from '@/types/guess';
import { GOOGLE_STREET_VIEW_BASE_URL } from '@/lib/constants';

interface VisitedPlacesMapProps {
  readonly onLoadingChange?: (isLoading: boolean) => void;
}

export function VisitedPlacesMap({ onLoadingChange }: VisitedPlacesMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [locations, setLocations] = useState<GuessLocation[]>([]);

  const fetchLocations = useCallback(async () => {
    if (!map.current) return;

    const bounds = map.current.getBounds();
    onLoadingChange?.(true);

    try {
      const data = await getLocationsInBounds(
        bounds.getSouth(),
        bounds.getWest(),
        bounds.getNorth(),
        bounds.getEast(),
      );
      setLocations(data);
    } finally {
      onLoadingChange?.(false);
    }
  }, [onLoadingChange]);

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
      center: [0, 20],
      zoom: 2,
    });

    const nav = new maplibregl.NavigationControl();
    map.current.addControl(nav, 'top-right');

    map.current.on('moveend', fetchLocations);

    fetchLocations();

    return () => {
      map.current?.remove();
    };
  }, [fetchLocations]);

  useEffect(() => {
    if (!map.current) return;

    locations.forEach((location) => {
      new maplibregl.Marker({ color: '#1E3A8A' })
        .setLngLat([location.lng, location.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 15 }).setHTML(
            `<div class="bg-gray-100 rounded-lg p-3 text-sm text-gray-800">
              <p class="font-medium text-blue-900 leading-tight">${location.location ?? 'Unknown location'}</p>
              <a href="${GOOGLE_STREET_VIEW_BASE_URL}${location.lat},${location.lng}" 
                 target="_blank" 
                 class="block mt-2 text-center text-white bg-blue-900 hover:bg-blue-800 transition-colors duration-200 rounded-md px-3 py-1">
                View in Street View
              </a>
            </div>`,
          ),
        )
        .addTo(map.current!);
    });

    return () => {
      const markers = document.getElementsByClassName('maplibregl-marker');
      while (markers[0]) {
        markers[0].remove();
      }
    };
  }, [locations]);

  return <div ref={mapContainer} className='w-full h-full' />;
}
