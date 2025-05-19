
import { Outlet } from "react-router-dom";
import AdminSidebar from "../sidebar/AdminSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex items-center mb-6">
            <SidebarTrigger />
            <h2 className="text-xl font-semibold ml-3">AI Chat Widget System</h2>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
