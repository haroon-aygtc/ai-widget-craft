
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Database, LayoutDashboard, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold">ChatWidget</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive("/") && !isActive("/widgets") && !isActive("/models") ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}>
                  <Link to="/">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive("/widgets") ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}>
                  <Link to="/widgets">
                    <MessageSquare className="h-5 w-5" />
                    <span>Chat Widgets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive("/models") ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}>
                  <Link to="/models">
                    <Database className="h-5 w-5" />
                    <span>AI Models</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
