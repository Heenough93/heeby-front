import React, { useEffect, useState } from "react";
import {Marker, Popup, useMap, useMapEvents} from "react-leaflet";
import L from "leaflet";

// 마커 아이콘 설정
const CustomIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41], // 핀 끝 설정
});

interface NewPostMarkerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const NewPostMarker: React.FC<NewPostMarkerProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const map = useMap();

  useEffect(() => {
    map.locate(); // 지도가 렌더링되자마자 사용자 위치 요청
  }, [map]);

  useMapEvents({
    locationfound(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng); // 부모 컴포넌트에 위치 전달
      setPosition([lat, lng]); // 사용자의 위치 저장
      map.setView(e.latlng, map.getZoom()); // 지도를 해당 위치로 이동
    },
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng); // 부모 컴포넌트에 위치 전달
      setPosition([lat, lng]); // 사용자의 위치 저장
      map.setView(e.latlng, map.getZoom()); // 지도를 해당 위치로 이동

      const locateActive = document.querySelector('.locateButton');
      locateActive?.classList['remove']('locateActive');
    },
  });

  useEffect(() => {

    // create custom button
    const customControl = L.Control.extend({
      // button position
      options: {
        position: 'topleft',
      },

      // method
      onAdd: function () {
        const button = L.DomUtil.create('button', 'locateButton leaflet-bar');
        L.DomEvent.disableClickPropagation(button);

        button.title = 'locate';
        button.innerHTML =
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>';

        L.DomEvent.on(button, 'click', this._clicked, this);

        return button;
      },
      _clicked: function (e: Event) {
        L.DomEvent.stopPropagation(e);

        this.removeLocate();

        this._checkLocate();

        return;
      },
      _checkLocate: function () {
        return this._locateMap();
      },
      _locateMap: function () {
        const locateActive = document.querySelector('.locateButton');
        const locate = locateActive?.classList.contains('locateActive');
        // add/remove class from locate button
        locateActive?.classList[locate ? 'remove' : 'add']('locateActive');

        // remove class from button
        // and stop watching location
        if (locate) {
          this.removeLocate();
          map.stopLocate();
          return;
        }

        // location on found
        map.on('locationfound', this.onLocationFound, this);
        // locataion on error
        map.on('locationerror', this.onLocationError, this);

        // start locate
        map.locate({ setView: true, enableHighAccuracy: true, maxZoom: 15 });
      },
      onLocationFound: function (e: L.LocationEvent) {
        // add circle
        this.addCircle(e).addTo(this.featureGroup()).addTo(map);

        // add marker
        // this.addMarker(e).addTo(this.featureGroup()).addTo(map);

        // add legend
      },
      // on location error
      onLocationError: function () {
        this.addLegend('Location access denied.');
      },
      // feature group
      featureGroup: function () {
        return new L.FeatureGroup();
      },
      // add legend
      addLegend: function (text: string) {
        const checkIfDescriotnExist = document.querySelector('.description');

        if (checkIfDescriotnExist) {
          checkIfDescriotnExist.textContent = text;
          return;
        }

        const legend = L.Control.extend({
          options: {
            position: 'bottomleft',
          },

          onAdd: function () {
            const div = L.DomUtil.create('div', 'description');
            L.DomEvent.disableClickPropagation(div);
            div.insertAdjacentHTML('beforeend', text);
            return div;
          },
          addTo: (map),
        });

        map.addControl(new legend());
      },

      addCircle: function (e: L.LocationEvent) {
        return L.circle([ e.latlng.lat, e.latlng.lng ], e.accuracy / 2, {
          radius: 10,
          className: 'circle-test',
          weight: 2,
          stroke: false,
          fillColor: '#136aec',
          fillOpacity: 0.15,
        });
      },
      addMarker: function (e: L.LocationEvent) {
        return L.marker([ e.latlng.lat, e.latlng.lng ], {
          icon: L.divIcon({
            className: 'locatedAnimation',
            iconSize: L.point(17, 17),
            popupAnchor: [ 0, -15 ],
          }),
        }).bindPopup('Your are here :)');
      },
      removeLocate: function () {
        map.eachLayer(function (layer) {
          if (layer instanceof L.Marker) {
            const { icon } = layer.options;
            if (icon?.options.className === '.locatedAnimation') {
              map.removeLayer(layer);
            }
          }
          if (layer instanceof L.Circle) {
            if (layer.options.className === 'circle-test') {
              map.removeLayer(layer);
            }
          }
        });
      },
    });

    // adding new button to map controll
    map.addControl(new customControl());
  }, [map]);

  return position ? (
      <Marker position={position} icon={CustomIcon}>
        <Popup>You are here!</Popup>
      </Marker>
  ) : null;
};

export default NewPostMarker;