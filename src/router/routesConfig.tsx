import { RouteObject } from "react-router-dom";
import { JournalScreen, LoginScreen, RegisterScreen } from "../pages";

export type RouteConfig = RouteObject & {
  title?: string;
  // children?: Array<RouteConfig>;
};

const authRoutes: RouteConfig[] = [
  {
    index: true,
    path: "login",
    title: "Login",
    element: <LoginScreen />,
  },
  {
    path: "register",
    title: "Register",
    element: <RegisterScreen />,
  }
];


const mainRoutes: RouteConfig[] = [
  {
    index: true,
    element: <JournalScreen />
  },
];

export {
  authRoutes,
  mainRoutes
};

