import { Outlet } from "react-router-dom";
import { Sidebar } from "../components";

export const MainLayout = () => {
  return (
    <main
      className="journal__main-content"
    >
      <Sidebar />
      <Outlet />
    </main>
  );
};
