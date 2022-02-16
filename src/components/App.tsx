import * as React from 'react';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import {Provider} from 'react-redux';

import AppBar from './AppBar';
import OAuthPopup from 'components/oauth/OAuthPopup';
import DonationPage from 'screens/DonationPage';
import {store} from "store";
import RequireAuth from "components/auth/RequireAuth";
import DashboardPage from "screens/DashboardPage";
import AuthProvider from "components/auth/AuthProvider";
import LoginPage from "screens/LoginPage";
import HomePage from "../screens/HomePage";
import TipsPage from "screens/TipsPage";


/**
 * Represents the container of all the application.
 */
function App() {
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
                    <OAuthPopup/>
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
