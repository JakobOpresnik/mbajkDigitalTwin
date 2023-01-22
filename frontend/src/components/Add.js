import { useState } from 'react';
import { Link } from 'react-router-dom';

function Add() {

    return (
        <div>
            <Link to="/add/MBajk"><button className="btn btn-secondary p-3">ADD MBAJK LOCATIONS</button></Link>
            <Link to="/add/bike_stand"><button className="btn btn-secondary p-3">ADD BIKE STANDS</button></Link>
            <Link to="/add/bike_shed"><button className="btn btn-secondary p-3">ADD BIKE SHEDS</button></Link>
        </div>
    );
}

export default Add;