import React, {Component} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import AppBar from './AppBar';
import Home from '../screens/Home';
import Success from '../screens/Success';
import Donate from '../screens/Donate';

/**
 * Represents the container of all the application.
 */
class App extends Component {
  render() {
    return (
      <div>
        <AppBar/>

        <div className="p-[18px]">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/success" element={<Success/>}/>
              <Route path="/donate/:platform/:username" element={<Donate />}/>
            </Routes>
          </BrowserRouter>
        </div>

      </div>
    );
  }
}

export default App;
