import './App.css';
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import MBajkLocations from './data/mbajk_locations.json';
import bikePathLocations from './data/bikepaths.json';
import bikeStandLocations from './data/bikestand_locations.json';
import useSwr from 'swr';  // displaying remote json (web scraping)
import Map from './components/Map';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Graphs from './components/Graphs';
import PieChart from './components/PieChart';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import { UserContext } from "./userContext";
import Add from './components/Add';
import AdminInterface from './components/AdminInterface';

// import admin interface
import { Admin, Resource, ListGuesser } from 'react-admin';
// import data provider
import restProvider from 'ra-data-simple-rest';
// CRUD operations for admin interface
import MBajkList from './components/MBajkList';
import MBajkCreate from './components/MBajkCreate';
import MBajkEdit from './components/MBajkEdit';

function App() {

  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  /*
  <Route path="/add" element={<Add/>}/>*/

  return (
    <div>
      <BrowserRouter>
        <UserContext.Provider value={{
          user: user,
          setUserContext: updateUserData
        }}>
          <Header/>
          <Routes>
            <Route path="/" element={<Map/>}/>
            <Route path="/graphs" element={<Graphs/>}/>
            <Route path="/pie_charts" element={<PieChart/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout/:username" element={<Logout/>}/>
            <Route path="/admin" element={<AdminInterface/>}/>
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
      

    </div>
  );

}

export default App;

// admin interface
/*
<Admin dataProvider={restProvider("http://localhost:3001")}>
<Resource
    name="mbajk"
    list={MBajkList}
    create={MBajkCreate}
    edit={MBajkEdit}/>
</Admin>
*/

/*
      {MBajkLocations.locations.map(mbajk => (
        <Marker 
          key={mbajk._id} 
          position={[
            mbajk.geometry.coordinates[1],
            mbajk.geometry.coordinates[0]
          ]}
          icon={mbajkLogo}>
          <Popup>
            <h2>{mbajk.name}</h2>
            <h3>{mbajk.address}</h3>
            <h3>{mbajk.currentStatus}</h3>
          </Popup>
        </Marker>
      ))}
*/