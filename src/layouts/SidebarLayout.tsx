import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";

interface SidebarLayoutProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function SidebarLayout({ setIsLoggedIn }: SidebarLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Profile compact setIsLoggedIn={setIsLoggedIn} />
        <Outlet />
      </div>
    </div>
  );
}