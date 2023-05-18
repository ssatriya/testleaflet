"use client";

import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import mapData from "../../data/kab.json";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import axios from "axios";
const wellknown = require("wellknown");

interface GeoJSON {}

const MapEvents = () => {
  const [position, setPosition] = useState<any>(null);
  const map = useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : (
    <Marker position={position}>
      <Popup>Here</Popup>
    </Marker>
  );
};

interface Latlng {
  lat: number;
  lng: number;
}

const Map = () => {
  const position = [0.5712795966325395, 111.96266282069726];
  const [selectedPositionName, setSelectedPositionName] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [allData, setAllData] = useState();

  const [abacac, setGeoJSON] = useState<any>();

  const onEachKab = (kab, layer) => {
    const kabName = kab.properties.name;
    const latLng = kab.latlng;

    layer.on({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setSelectedPosition(`${lat.toString()}, ${lng.toString()}`);
        setSelectedPositionName(kabName);
        setAllData(kab);

        setLat(lat);
        setLng(lng);

        console.log(kab);
      },
    });
  };

  // console.log(allData.geometry);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/map", {
        kab: selectedPositionName,
        latlng: selectedPosition,
        shape: allData.geometry,
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:5000/api");

      const data = await response.data;

      const geo = JSON.parse(data[0].geojson);

      // console.log(geo);

      const transformed = {
        type: "FeatureCollection",
        name: "kab",
        crs: {
          properties: {
            name: "urn:ogc:def:crs:OGC:1.3:CRS84",
          },
          type: "name",
        },
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: geo,
          },
        ],
      };

      // const transformed = {
      //   type: "Feature",
      //   properties: {
      //     name: "Multiploy 1",
      //   },
      //   geometry: geo,
      // };

      setGeoJSON(transformed);
    };

    fetchData();
  }, []);

  console.log(abacac);

  return (
    <div className="flex gap-4">
      <MapContainer
        className="min-h-screen w-[1500px]"
        center={position as [number, number]}
        zoom={7}
        scrollWheelZoom={true}
      >
        <MapEvents />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {abacac && <GeoJSON data={abacac} />}
        {/* <GeoJSON data={mapData} onEachFeature={onEachKab} /> */}
      </MapContainer>
      <div className="px-2 py-8">
        <form onSubmit={submitHandler}>
          <Label htmlFor="kabName">Email</Label>
          <Input type="text" id="kabName" defaultValue={selectedPositionName} />
          <Label htmlFor="lat">Latitude</Label>
          <Input type="text" id="lat" defaultValue={lat} />
          <Label htmlFor="lng">Longitude</Label>
          <Input type="text" id="lng" defaultValue={lng} />
          <Input type="hidden" defaultValue={allData} />
          <Input type="hidden" defaultValue={allData} />
          <Button variant="default" type="submit" className="mt-8">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Map;
