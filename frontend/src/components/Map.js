// import the leaflet package
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import '../App.css';
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import MBajkLocations from '../data/mbajk_locations.json';
import bikePathLocations from '../data/bikepaths.json';
//import bikeStandLocations from '../data/bikestand_locations.json';

import useSwr from 'swr';	// displaying remote json (web scraping)


const mbajkIcon = new Icon({
	iconUrl: "/mbajk_logo.svg",
	iconSize: [35, 35]
  });
  
const bikestandIcon = new Icon({
	iconUrl: "/bikestand_icon.png",
	iconSize: [45, 45]
});

const bikeShedIcon = new Icon({
	iconUrl: "/bike_shed_icon.jpg",
	iconSize: [45, 45]
});

const fetcher = (...args) => fetch(...args).then(response => response.json());


function Map() {

	const position = [46.554649, 15.645881];

	// getting MBajk locations from online API
	const url = "https://api.jcdecaux.com/vls/v3/stations?apiKey=frifk0jbxfefqqniqez09tw4jvk37wyf823b5j1i&contract=maribor";
	const { data, error } = useSwr(url, { fetcher });

	const mbajk_locations = data && !error ? data : [];
	console.log(mbajk_locations);

	/*const saveMBajkLocations = async function() {
		for (var i in mbajk_locations) {
			console.log(mbajk_locations[i])
			const res = await fetch("http://localhost:3001/mbajk", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify ({
					number: mbajk_locations[i].number,
					name: mbajk_locations[i].name,
					address: mbajk_locations[i].address,
					geometry: {
						type: "Point",
						coordinates: [ mbajk_locations[i].position.latitude, mbajk_locations[i].position.longitude ]
					},
					currentStatus: mbajk_locations[i].status,
					currentAvailabilities: {
						bikesAvailable: mbajk_locations[i].totalStands.availabilities.bikes,
						parkSpots: mbajk_locations[i].totalStands.availabilities.stands
					},
					historyAvailabilities: [],
					lastUpdateSensor: mbajk_locations[i].lastUpdate
				})
			});
			const d = await res.json();
			console.log(d)
		}
	}
	saveMBajkLocations();*/


	const center = [51.505, -0.09];

	//const filteredMBajkLocations = mbajk_locations.filter(location => location.totalStands.availabilities.bikes === 3)

	
	const [bikeStands, setBikeStands] = useState([]);
	// getting bike stands from database
	useEffect(function() {
		const getBikeStands = async function() {
			const res = await fetch("http://localhost:3001/stand");
			const data = await res.json();
			setBikeStands(data);
		}
		getBikeStands();
	}, [])

	console.log(bikeStands);

	const bikeStandLocations = [];
	for (let i in bikeStands.Stands) {
		bikeStandLocations.push(bikeStands.Stands[i])
	}


	const [bikeSheds, setBikeSheds] = useState([]);
	// getting bike sheds from database
	useEffect(function() {
		const getBikeSheds = async function() {
			const res = await fetch("http://localhost:3001/bikeshed");
			const data = await res.json();
			setBikeSheds(data);
		}
		getBikeSheds();
	}, [])

	console.log(bikeSheds);
	const bikeShedsLocations = [];
	for (let i in bikeSheds.BikeSheds) {
		bikeShedsLocations.push(bikeSheds.BikeSheds[i]);
	}


	const [bikePath, setBikePath] = useState([]);
	// getting bike path from database
	useEffect(function() {
		const getBikePath = async function() {
			const res = await fetch("http://localhost:3001/bikepath");
			const data = await res.json();
			setBikePath(data);
		}
		getBikePath();
	}, [])

	console.log(bikePath.BikePaths)
	const bikePathLocation = [];
	for (let i in bikePath.BikePaths) {
		bikePathLocation.push(bikePath.BikePaths[i].geometry.coordinates)
		//bikePathLocation.push(bikePath.BikePaths[i]);
	}
	console.log(bikePathLocation);



	// setting data when checking the checkboxes
	const [ MBajkChecked, setMBajkChecked ] = useState(false);
	const MBajkFilter = () => {
		setMBajkChecked(!MBajkChecked);
	}

	const [ bikeStandChecked, setBikeStandChecked ] = useState(false);
	const bikeStandFilter = () => {
		setBikeStandChecked(!bikeStandChecked);
	}

	const [ bikeShedChecked, setBikeShedChecked ] = useState(false);
	const bikeShedFilter = () => {
		setBikeShedChecked(!bikeShedChecked);
	}


	return (

		<div>
		<form className="card" id="filter-form">
			<table>
			<tr>
				<td><input type="checkbox" id="mbajk" name="mbajk" value="mbajk" checked={MBajkChecked} onChange={MBajkFilter}></input></td>
				<td><label>MBAJK LOCATIONS</label></td>
			</tr>
			<tr>
				<td><input type="checkbox" id="bike-stand" name="bike-stand" value="bike-stand" checked={bikeStandChecked} onChange={bikeStandFilter}></input></td>
				<td><label>BIKE STANDS</label></td>
			</tr>
			<tr>
				<td><input type="checkbox" id="bike-shed" name="bike-shed" value="bike-shed" checked={bikeShedChecked} onChange={bikeShedFilter}></input></td>
				<td><label>BIKE SHEDS</label></td>
			</tr>
			<tr>
				<td><input type="checkbox" id="bike-path" name="bike-path" value="bike-path"></input></td>
				<td><label>BIKE PATHS</label></td>
			</tr>
			<tr>
				<td><input type="checkbox" id="tour-path" name="tour-path" value="tour-path"></input></td>
				<td><label>TOUR PATHS</label></td>
			</tr>
			<tr>
				<td><input type="checkbox" id="coridor" name="coridor" value="coridor"></input></td>
				<td><label>CORIDORS</label></td>
			</tr>
			</table>
		</form>

		
		<MapContainer center={position} zoom={14} scrollWheelZoom={true} id="map-div">
			<TileLayer
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>

			{MBajkChecked ?
				mbajk_locations.map(location => (
					<Marker
						key={location.number} 
						position={[location.position.latitude, location.position.longitude]}
						icon={mbajkIcon}>
						<Popup>
							<h2>{location.name}</h2>
							<h3>{location.address}</h3>
							<h3>št. koles: {location.totalStands.availabilities.bikes}</h3>
							<h3>št. stojal: {location.totalStands.availabilities.stands}</h3>
							<h3>{location.status}</h3>
						</Popup>
					</Marker>		
				))
			:
				<></>
			}

			{bikeStandChecked ? 
				bikeStandLocations.map(location => (
					<Marker
						key={location._id}
						position={[location.geometry.coordinates[1], location.geometry.coordinates[0]]}
						icon={bikestandIcon}>
						<Popup>
							<h2>{location.name}</h2>
							<h3>kapacitete: {location.parkSpots}</h3>
						</Popup>
					</Marker>
				))
			:
				<></>
			}
			

			{bikeShedChecked ?
				bikeShedsLocations.map(location => (
					<Marker
						key={location._id}
						position={[location.geometry.coordinates[1], location.geometry.coordinates[0]]}
						icon={bikeShedIcon}>
						<Popup>
							<h2>{location.providerName}</h2>
							<h3><a href={location.providerLink}>Ponudnikova spletna stran</a></h3>
							<h3>{location.address}</h3>
							<h3>kapacitete: {location.quantity}</h3>
						</Popup>
					</Marker>
				))
			:
				<></>
			}
			

		</MapContainer>
		</div>
	);
}

export default Map;


// Creates a leaflet map binded to an html <div> with id "map"
// setView will set the initial map view to the location at coordinates
// 13 represents the initial zoom level with higher values being more zoomed in
/*var map = leaflet.map('map').setView([43.659752, -79.378161], 20);

// Adds the basemap tiles to your web map
// Additional providers are available at: https://leaflet-extras.github.io/leaflet-providers/preview/
leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 21
}).addTo(map);

// Adds a popup marker to the webmap for GGL address
leaflet.circleMarker([43.659752, -79.378161]).addTo(map)
	.bindPopup(
		'MON 304<br>' + 
		'Monetary Times Building<br>' +
		'341 Victoria Street<br>' + 
		'Toronto, Ontario, Canada<br>' +
		'M5B 2K3<br><br>' + 
		'Tel: 416-9795000 Ext. 5192'
	)
	.openPopup();*/