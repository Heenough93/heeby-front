import React, { useEffect } from "react";
import {Marker, Popup, useMap} from "react-leaflet";
import L from "leaflet";

// 마커 아이콘 설정
const CustomIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41], // 핀 끝 설정
});

interface DisabledMarkerProps {
  location: {lat: number, lng: number};
}

const DisabledMarker: React.FC<DisabledMarkerProps> = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    // 지도 드래그 비활성화
    map.dragging.disable();

    // 스크롤로 줌 비활성화
    map.scrollWheelZoom.disable();

    // 터치 줌 비활성화 (모바일에서 유용)
    map.touchZoom.disable();

    // 더블 클릭 줌 비활성화
    map.doubleClickZoom.disable();

    return () => {
      // 컴포넌트 언마운트 시, 설정을 원상복구
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
    };
  }, [map]);

  return (
      <Marker position={location} icon={CustomIcon}>
        <Popup>You are here!</Popup>
      </Marker>
  );
};

export default DisabledMarker;