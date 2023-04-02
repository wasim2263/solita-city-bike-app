import React, {FC, useState} from "react";
import {GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";

const containerStyle = {
  width: "50%",
  height: "400px",
};


const redMarker = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

type Location = {
  lat: number,
  lng: number
}

type MapProps = {
  center: Location
}

export const Map: FC<MapProps> = ({ center }) =>  {
  const [map, setMap] = useState(null);
  const {isLoaded} = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBSySXuxLYLdNCx6bxiqn7j-yYm2TCwosI",
  });

  const onLoad = (map: any) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };
console.log(center)
  return isLoaded ? (

    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={8}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={center} icon={redMarker}/>
    </GoogleMap>
  ) : (
    <></>
  );
}
