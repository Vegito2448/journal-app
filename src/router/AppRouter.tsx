import { RouterProvider } from "react-router-dom";
import { router } from "./mainRouter";

export const AppRouter = () =>
  <RouterProvider
    router={router}
  />;