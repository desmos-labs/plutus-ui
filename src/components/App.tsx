import * as React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Provider} from 'react-redux';

import AppBar from './AppBar';
import OAuthCallback from 'screens/OAuthCallback';
import DonationPage from 'screens/DonationPage';
import {store} from "store";
import RequireAuth from "components/RequireAuth";
import DashboardPage from "screens/DashboardPage";
import AuthProvider from "components/AuthProvider";
import LoginPage from "screens/LoginPage";

/**
 * Represents the container of all the application.
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppBar/>

        <BrowserRouter>
          <Routes>

            <Route path="/" element={<LoginPage/>}/>

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
              path="/donate/:platform/:username"
              element={
                <RequireAuth>
                  <DonationPage/>
                </RequireAuth>
              }
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
