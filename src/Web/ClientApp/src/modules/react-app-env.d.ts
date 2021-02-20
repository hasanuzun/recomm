/// <reference types="react-scripts" />

interface DevEnv {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  HTTPS: boolean;
}

interface AppEnv {
  PUBLIC_URL: string;
  REACT_APP_API_URL: string;
  REACT_APP_APP_URL: string;
  REACT_APP_AUTH_URL: string;
  REACT_APP_AUTH_CLIENT_ID: string;
  REACT_APP_APIScope: string;
}

declare namespace NodeJS {
  interface ProcessEnv extends AppEnv, DevEnv {}
}

interface Window {
  Stripe: any;
  _env_: AppEnv;
}
