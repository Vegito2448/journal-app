import { Outlet } from "react-router-dom";
import { Sidebar } from "../components";

export const MainLayout = () => {
  return (
    <main
      className="journal__main-content animate__animated animate__fadeIn animate__faster"
    >
      <Sidebar />
      <Outlet />
    </main>
  );
};
