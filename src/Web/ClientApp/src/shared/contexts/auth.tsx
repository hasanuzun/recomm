import React, { useEffect, useState } from "react";
import authService from "../../services/AuthorizeService";
import { registerFetchIntercept } from "../fetchInterceptor";
import { Profile } from "oidc-client";

interface AuthContextState {
  isReady: boolean;
  isAuthenticated: boolean;
  user: Profile | null;
}

export const AuthContext = React.createContext<AuthContextState>({
  isAuthenticated: false,
  isReady: false,
  user: null
});

interface AuthState {
  ready: boolean;
  authenticated: boolean;
  subscription: number;
  user: Profile | null;
}

export const AuthConsumer = AuthContext.Consumer;

export const AuthProvider = (props: any) => {
  const [compState, setCompState] = useState<AuthState>({
    ready: false,
    authenticated: false,
    subscription: 0,
    user: null,
  });

  const { ready, authenticated, subscription, user } = compState;

  useEffect(() => {
    const populateAuthenticationState = async () => {
      const [authenticated, user] = await Promise.all([
        authService.isAuthenticated(),
        authService.getUser(),
      ]);

      setCompState((prevState) => ({
        ...prevState,
        ready: true,
        authenticated,
        user,
      }));
    };

    const authenticationChanged = async () => {
      setCompState((prevState) => ({
        ...prevState,
        ready: false,
        authenticated: false,
        user: null,
      }));

      await populateAuthenticationState();
    };

    authService.subscribe(authenticationChanged);

    populateAuthenticationState();

    return () => {
      authService.unsubscribe(subscription);
    };
  }, [subscription]);

  const contextValue = {
    isAuthenticated: authenticated,
    isReady: ready,
    user,
  };

  registerFetchIntercept();

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
