import {
  createBrowserRouter,
  Navigate,
  RouteObject
} from "react-router-dom";
import { AuthLayout, MainLayout } from "../layouts";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { authRoutes, mainRoutes } from "./routesConfig";

export const mainPath = import.meta.env.DEV ? "/" : "/journal-app/";

export const allRoutes: RouteObject[] = [
  {
    path: `${mainPath}auth/`,
    element: <PublicRoute children={<AuthLayout />} />,
    children: authRoutes
  },
  {
    path: `${mainPath}`,
    element: <PrivateRoute children={<MainLayout />} />,
    children: mainRoutes
  },
  {
    path: "*",
    element: <Navigate
      to={`${mainPath}auth/login/`}
      replace
    />

  }
];

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(allRoutes);

