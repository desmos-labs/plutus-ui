import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  getUserState,
  refreshUserState,
  loginWithWalletConnect,
  logout,
  UserState,
  initUserState
} from "../../store/user";

interface AuthContextType {
  userState: UserState;
  performLogin: (callback: VoidFunction) => void;
  performLogout: (callback: VoidFunction) => void;
}

/**
 * Represents a React context holding an instance of AuthContextType.
 */
const AuthContext = React.createContext<AuthContextType>(null!);

/**
 * Provides the authentication data to its children.
 */
function AuthProvider({children}: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const userState = useSelector(getUserState);

  // Initialize the user state during load up
  useEffect(() => {
    dispatch(initUserState());
  }, [false]);

  const performLogin = (callback: VoidFunction) => {
    dispatch(loginWithWalletConnect());
    callback();
  };

  const performLogout = (callback: VoidFunction) => {
    dispatch(logout());
    callback();
  };

  let value = {userState, performLogin, performLogout};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * React hook allowing to get the current auth data.
 */
export function useAuth() {
  return React.useContext(AuthContext);
}

export default AuthProvider;