import * as React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Provider} from 'react-redux';
import NavigationBar from './navigation/NavigationBar';
import DonationPage from 'screens/donation/DonationPage';
import {store} from "store";
import RequireAuth from "components/auth/RequireAuth";
import DashboardPage from "screens/dashboard/DashboardPage";
import AuthProvider from "components/auth/AuthProvider";
import LoginPage from "screens/LoginPage";
import HomePage from "../screens/home/HomePage";

/**
 * Represents the container of all the application.
 */
function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <NavigationBar/>

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
