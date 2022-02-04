import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserState, loginWithWalletConnect, logout, UserState} from "store/user";

interface AuthContextType {
  userState: UserState;
  performLogin: (callback: VoidFunction) => void;
  performLogout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const userState = useSelector(getUserState);

  const performLogin = (callback: VoidFunction) => {
    dispatch(loginWithWalletConnect());
    callback();
  };

  const performLogout = (callback: VoidFunction) => {
    dispatch(logout());
    callback();
  };

  let value = { userState, performLogin, performLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

export default AuthProvider;