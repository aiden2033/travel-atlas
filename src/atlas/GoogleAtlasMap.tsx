import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer';
import { useEffect, useRef, useState } from 'react';
import { googleMapsFailureEvent, loadGoogleMaps } from './googleMapsLoader';
import { createMapPlacePopup } from './mapPlacePopup';
import {
  createMapClusterBadge,
  getMapClusterLabel,
  getMapCountryColor,
} from './mapCountryColors';
import type { MapPoint } from './mapPlaces';

const maxZoom = 19;

type LoadedMap = {
  map: google.maps.Map;
  InfoWindow: typeof google.maps.InfoWindow;
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement;
  PinElement: typeof google.maps.marker.PinElement;
};

type Props = {
  apiKey: string;
  mapId: string;
  points: MapPoint[];
  onUnavailable: () => void;
};

export default function GoogleAtlasMap({
  apiKey,
  mapId,
  points,
  onUnavailable,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [loadedMap, setLoadedMap] = useState<LoadedMap>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    let disposed = false;
    let tilesLoaded: google.maps.MapsEventListener | undefined;
    let tileTimeout: number | undefined;
    window.addEventListener(googleMapsFailureEvent, onUnavailable);

    async function initialise(element: HTMLDivElement) {
      await loadGoogleMaps(apiKey);
      const [{ Map, InfoWindow }, { AdvancedMarkerElement, PinElement }] =
        await Promise.all([
          google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
          google.maps.importLibrary(
            'marker',
          ) as Promise<google.maps.MarkerLibrary>,
        ]);
      if (disposed) return;

      const map = new Map(element, {
        mapId,
        maxZoom,
        center: { lat: 0, lng: 0 },
        zoom: 2,
        gestureHandling: 'cooperative',
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      });

      tileTimeout = window.setTimeout(onUnavailable, 12_000);
      tilesLoaded = map.addListener('tilesloaded', () => {
        window.clearTimeout(tileTimeout);
        tilesLoaded?.remove();
        if (map.getMapCapabilities().isAdvancedMarkersAvailable === false) {
          onUnavailable();
          return;
        }
        setReady(true);
      });
      setLoadedMap({ map, InfoWindow, AdvancedMarkerElement, PinElement });
    }

    void initialise(element).catch(() => {
      if (!disposed) onUnavailable();
    });

    return () => {
      disposed = true;
      window.removeEventListener(googleMapsFailureEvent, onUnavailable);
      window.clearTimeout(tileTimeout);
      tilesLoaded?.remove();
      element.replaceChildren();
    };
  }, [apiKey, mapId, onUnavailable]);

  useEffect(() => {
    if (!loadedMap) return;

    const { map, InfoWindow, AdvancedMarkerElement, PinElement } = loadedMap;
    const bounds = new google.maps.LatLngBounds();
    const popup = new InfoWindow({
      maxWidth: 290,
      ariaLabel: 'Информация о месте',
    });
    const openPopup = (
      content: HTMLElement,
      anchor: google.maps.marker.AdvancedMarkerElement,
    ) => {
      popup.setContent(content);
      popup.open({ map, anchor, shouldFocus: true });
    };

    const placesByMarker = new Map(
      points.map((place) => {
        bounds.extend(place.coords);
        const marker = new AdvancedMarkerElement({
          position: place.coords,
          title: `${place.name}, ${place.cityName} · ${place.countryName}`,
          gmpClickable: true,
        });
        marker.append(
          new PinElement({
            background: getMapCountryColor(place.countryId),
            borderColor: '#fff',
            glyphColor: '#fff',
          }),
        );
        marker.addEventListener('gmp-click', () =>
          openPopup(createMapPlacePopup(place).content, marker),
        );
        return [marker, place] as const;
      }),
    );

    const groups = new MarkerClusterer({
      map,
      markers: [...placesByMarker.keys()],
      algorithm: new SuperClusterAlgorithm({ radius: 45, maxZoom }),
      renderer: {
        render(cluster) {
          const groupPlaces = cluster.markers
            .filter((marker) => marker instanceof AdvancedMarkerElement)
            .map((marker) => placesByMarker.get(marker))
            .filter((place): place is MapPoint => place !== undefined);
          const group = new AdvancedMarkerElement({
            position: cluster.position,
            title: getMapClusterLabel(groupPlaces),
            gmpClickable: true,
          });
          group.append(createMapClusterBadge(groupPlaces));
          return group;
        },
      },
      onClusterClick(_event, cluster) {
        const bounds = cluster.bounds;
        const anchor = cluster.marker;
        if (!bounds || !(anchor instanceof AdvancedMarkerElement)) return;

        const groupPlaces = cluster.markers
          .filter((marker) => marker instanceof AdvancedMarkerElement)
          .map((marker) => placesByMarker.get(marker))
          .filter((place): place is MapPoint => place !== undefined);
        const firstPosition = groupPlaces[0]?.coords;
        if (!firstPosition) return;

        const hasDifferentPositions = groupPlaces.some(
          ({ coords }) =>
            coords.lat !== firstPosition.lat ||
            coords.lng !== firstPosition.lng,
        );
        if (hasDifferentPositions && (map.getZoom() ?? 0) < maxZoom) {
          map.fitBounds(bounds, 32);
          return;
        }

        const list = document.createElement('ul');
        list.className = 'atlas-map-google-group';
        for (const place of groupPlaces) {
          const item = document.createElement('li');
          item.append(createMapPlacePopup(place).content);
          list.append(item);
        }
        openPopup(list, anchor);
      },
    });

    if (points.length === 1) {
      map.moveCamera({ center: points[0].coords, zoom: 14 });
    } else {
      map.fitBounds(bounds, 24);
    }

    return () => {
      popup.close();
      groups.setMap(null);
    };
  }, [loadedMap, points]);

  return (
    <>
      <div className="atlas-map-google" ref={container} />
      {!ready && (
        <p className="atlas-map-google-status" role="status">
          Загружаем Google Maps…
        </p>
      )}
    </>
  );
}
