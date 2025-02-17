import React, {useEffect} from "react";
import {useMap} from "react-leaflet";
import L, {LatLngExpression} from "leaflet";

const TrackControls: React.FC<{tracks: any[], currentIndex: number, setCurrentIndex: ((prev: number) => void)}> = ({tracks, currentIndex, setCurrentIndex}) => {
  const map = useMap();

  useEffect(() => {
    setCurrentIndex(tracks.length - 1);
  }, [tracks]);

  useEffect(() => {
    if (!tracks[currentIndex]) return;
    map.closePopup();
    map.flyTo([tracks[currentIndex].lat, tracks[currentIndex].lng] as LatLngExpression, 8);
    map.openPopup(
        `${tracks[currentIndex].dateAndTime.slice(0, 10)}<br />${tracks[currentIndex].location}`,
        [tracks[currentIndex].lat, tracks[currentIndex].lng] as LatLngExpression
    );
  }, [currentIndex]);

  useEffect(() => {
    const customControl = L.Control.extend({
      options: { position: 'topright' },

      onAdd: function () {
        const container = L.DomUtil.create('div', 'button-container');

        const leftBtn = L.DomUtil.create('button', 'leftArrowButton', container);
        L.DomEvent.disableClickPropagation(leftBtn);
        leftBtn.title = 'Previous Location';
        leftBtn.innerHTML =
            '<svg width="22" height="22" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" fill="black"> <path d="M20 10 L5 25 L20 40" stroke="black" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/> <line x1="5" y1="25" x2="45" y2="25" stroke="black" stroke-width="5" stroke-linecap="round"/> </svg>';

        leftBtn.onclick = function () {
          // const currentTrack = currentIndex === 0 ? tracks[currentIndex] : tracks[currentIndex - 1];
          // map.flyTo([currentTrack.lat, currentTrack.lng] as LatLngExpression, 10);
          // map.openPopup(currentTrack.location, [currentTrack.lat, currentTrack.lng] as LatLngExpression);

          setCurrentIndex((prev) => (prev !== 0 ? prev - 1 : prev));
        };

        const rightBtn = L.DomUtil.create('button', 'rightArrowButton', container);
        L.DomEvent.disableClickPropagation(rightBtn);
        rightBtn.title = 'Next Location';
        rightBtn.innerHTML =
            '<svg width="22" height="22" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" fill="black"> <path d="M30 10 L45 25 L30 40" stroke="black" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/> <line x1="5" y1="25" x2="45" y2="25" stroke="black" stroke-width="5" stroke-linecap="round"/> </svg>';

        rightBtn.onclick = function () {
          // const currentTrack = currentIndex === tracks.length - 1 ? tracks[currentIndex] : tracks[currentIndex + 1];
          // map.flyTo([currentTrack.lat, currentTrack.lng] as LatLngExpression, 10);
          // map.openPopup(currentTrack.location, [currentTrack.lat, currentTrack.lng] as LatLngExpression);

          setCurrentIndex((prev) => (prev !== tracks.length - 1 ? prev + 1 : prev));
        };

        return container;
      },
    });

    const control = new customControl();
    map.addControl(control);

    return () => {
      map.removeControl(control);
    }
  }, [map, tracks, currentIndex]);

  return null;
};

export default TrackControls;