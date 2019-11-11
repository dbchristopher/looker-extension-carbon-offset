/* eslint-disable sort-keys, react-hooks/exhaustive-deps */

import React, { FC, useEffect, useLayoutEffect, useState, useRef } from "react";
import { createGlobalStyle } from "styled-components";
import toNumber from "lodash/toNumber";
import mapboxgl from "mapbox-gl";
import { mapPin } from "./assets";

mapboxgl.accessToken =
  "pk.eyJ1Ijoid2lsZy1sb29rZXIiLCJhIjoiY2syY2FhaG96MXVmNDNibHNicjkyeTlleiJ9.D44mP_Op4XVpLarEmGpgQw";

interface MapProps {
  lat: number;
  lng: number;
}

const GlobalStyle = createGlobalStyle`
  /* stylelint-disable */
  .mapboxgl-canvas {
    position: relative !important;
    height: 300px !important;
    width: 300px !important
  }
  .mapboxgl-ctrl-attrib {
    display: none;
  }
`;

const Map: FC<MapProps> = ({ lat: initialLat, lng: initialLng }) => {
  const [zoom, setZoom] = useState(5);
  const [latitude, setLatitude] = useState(initialLat);
  const [longitude, setLongitude] = useState(initialLng);
  const [map, setMap] = useState();
  const mapContainer = useRef(document.createElement("div"));

  useEffect(() => {
    if (map) {
      map.on("load", function() {
        map.addImage("pulsing-dot", mapPin, { pixelRatio: 2 });

        map.addLayer({
          id: "points",
          type: "symbol",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  geometry: {
                    coordinates: [latitude, longitude],
                    type: "Point"
                  },
                  type: "Feature"
                }
              ]
            }
          },
          layout: {
            "icon-image": "pulsing-dot"
          }
        });
      });
    }
  }, [latitude, longitude, map]);

  useLayoutEffect(() => {
    setMap(
      new mapboxgl.Map({
        center: [initialLat, initialLng],
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v9",
        zoom: 5
      })
    );
  }, [initialLat, initialLng, mapContainer]);

  useLayoutEffect(() => {
    let intervalId: number;
    if (map) {
      (map as any).on("move", () => {
        const { lng, lat } = (map as any).getCenter();

        setLatitude(lat);
        setLongitude(lng);
        setZoom(toNumber((map as any).getZoom().toFixed(2)));
      });
      intervalId = setInterval(() => {
        // keep map icon animating
        map.triggerRepaint();
      }, 75);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [latitude, longitude, map, zoom]);

  return (
    <div>
      <GlobalStyle />
      <div ref={mapContainer} />
    </div>
  );
};

export default Map;
