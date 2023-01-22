import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from "../userContext";

function App() {

  return (
    <header id="main-header">
      <nav id="header">
        <ul>
          <UserContext.Consumer>
            {context => (
              context.user ?
                <>
                  <li><Link to="/">MAP</Link></li>
                  <li><Link to="/graphs">GRAPHS</Link></li>
                  <li><Link to="/pie_charts">PIE CHARTS</Link></li>
                  <li><Link to="/admin">ADMIN INTERFACE</Link></li>
                  <li><Link to={"/logout/"+context.user.username}>LOGOUT</Link></li>
                  <li id="logged-username">{context.user.username}</li>
                </>
              :
                <>
                  <li><Link to="/register">REGISTER</Link></li>
                  <li><Link to="/login">LOGIN</Link></li>
                </>
            )}
          </UserContext.Consumer>
          <div id="nav-hr">
            <hr/>
          </div>
        </ul>
      </nav>
    </header>
  );

}

export default App;