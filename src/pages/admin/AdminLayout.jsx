import { Outlet } from "react-router-dom";
import Menu from "../../components/admin/Menu";


export default function AdminLayout() {
  return (
    <>
      <Menu />
      <div className="container-admin py-4">
        <Outlet />
      </div>
    </>
  );
}