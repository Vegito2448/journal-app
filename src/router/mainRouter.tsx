import {
  createBrowserRouter,
  RouteObject
} from "react-router-dom";
import { AuthLayout, MainLayout } from "../layouts";
import { LoginScreen } from "../pages";
import { authRoutes, mainRoutes } from "./routesConfig";

const mainPath = import.meta.env.DEV ? "/" : "/journal-app/";

export const allRoutes: RouteObject[] = [
  {
    path: `${mainPath}auth/`,
    element: <AuthLayout />,
    children: authRoutes
  },
  {
    path: `${mainPath}`,
    element: <MainLayout />,
    children: mainRoutes
  },
  {
    path: "*",
    element: <LoginScreen />
  }
];

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(allRoutes);

