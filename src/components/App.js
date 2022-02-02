import React, {Component} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import AppBar from './AppBar';
import Home from '../screens/Home';
import Success from '../screens/Success';
import Donate from '../screens/Donate';
import Login from "../screens/Login";

/**
 * Represents the container of all the application.
 */
function App() {
  const isLoggedIn = false;

  function getScreen() {
    if (isLoggedIn) {
      return <Home/>;
    }
    return <Login/>
  }


  return (
    <div>
      <AppBar/>

      <div className="p-[18px]">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={getScreen()}/>
            <Route path="/success" element={<Success/>}/>
            <Route path="/donate/:platform/:username" element={<Donate/>}/>
          </Routes>
        </BrowserRouter>
      </div>

    </div>
  );
}

export default App;
