import { Outlet } from "react-router-dom";
import SidebarMenu from "../../components/admin/Sidebar";


export default function AdminLayout() {
  return (
    <main className="main-admin">
      <SidebarMenu />
      <div className="container-admin py-4">
        <Outlet />
      </div>
    </main>
  );
}