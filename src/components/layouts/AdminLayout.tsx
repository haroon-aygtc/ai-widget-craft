
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { motion } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 border-b bg-background">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-lg font-semibold">AI Widget Craft</h1>
            </motion.div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="font-medium text-sm">U</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-background/95">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="container max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
