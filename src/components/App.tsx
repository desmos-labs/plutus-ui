import * as React from 'react';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import {Provider} from 'react-redux';

import AppBar from './AppBar';
import OAuthCallback from 'screens/OAuthCallback';
import DonationPage from 'screens/DonationPage';
import {store} from "store";
import RequireAuth from "components/RequireAuth";
import DashboardPage from "screens/DashboardPage";
import AuthProvider from "components/AuthProvider";
import LoginPage from "screens/LoginPage";
import HomePage from "../screens/HomePage";
import TipsPage from "screens/TipsPage";


/**
 * Represents the container of all the application.
 */
function App() {


  function getLocation(): boolean {
    const location = useLocation();
    console.log(location);
    return false;
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <AppBar/>

          <Routes>

            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardPage/>
                </RequireAuth>
              }
            />

            <Route
              path="/success"
              element={
                <RequireAuth>
                  <OAuthCallback/>
                </RequireAuth>
              }
            />

            <Route
              path="/tips"
              element={
                <RequireAuth>
                  <TipsPage/>
                </RequireAuth>
              }
            />

            <Route
              path="/donate/:application/:username"
              element={<DonationPage/>}
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
