import React, { useEffect, useState } from "react";
import {Marker, Popup, useMap, useMapEvents} from "react-leaflet";
import L from "leaflet";

// 마커 아이콘 설정
const CustomIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41], // 핀 끝 설정
});

interface PostDetailMarkerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  location: {lat: number, lng: number};
}

const PostDetailMarker: React.FC<PostDetailMarkerProps> = ({ onLocationSelect, location }) => {
  const [position, setPosition] = useState<[number, number] | null>([location.lat, location.lng]);

  const map = useMap();

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng); // 부모 컴포넌트에 위치 전달
      setPosition([lat, lng]); // 사용자의 위치 저장
      map.setView(e.latlng, map.getZoom()); // 지도를 해당 위치로 이동
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
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 18.451L16 6.031 0 18.451v-5.064L16 .967l16 12.42zM28 18v12h-8v-8h-8v8H4V18l12-9z"></path></svg>';

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
        const { lat, lng } = location;
        onLocationSelect(lat, lng); // 부모 컴포넌트에 위치 전달
        setPosition([lat, lng]); // 사용자의 위치 저장
        map.setView(location, map.getZoom()); // 지도를 해당 위치로 이동
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

export default PostDetailMarker;