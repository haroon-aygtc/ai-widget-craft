
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Database, LayoutDashboard, Settings, Menu } from "lucide-react";
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
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/widgets", label: "Chat Widgets", icon: MessageSquare },
    { path: "/models", label: "AI Models", icon: Database },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center space-x-3">
          <div className="rounded-md bg-primary/10 p-2">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <motion.span 
            initial={{ opacity: 0, x: -5 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }} 
            className="text-xl font-bold"
          >
            ChatWidget
          </motion.span>
        </div>
        <SidebarTrigger className="absolute top-3 right-3 lg:hidden">
          <Menu size={20} />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={cn(
                    isActive(item.path) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                  )}>
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="w-full"
                    >
                      <Link to={item.path} className="flex items-center w-full">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
