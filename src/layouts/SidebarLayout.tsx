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
          <div className="hidden md:block">
            <Profile compact setIsLoggedIn={setIsLoggedIn} />
          </div>
        <Outlet />
      </div>
    </div>
  );
}