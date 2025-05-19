
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../sidebar/AdminSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AdminLayout = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New widget created - Product Assistant", time: "2 minutes ago", read: false },
    { id: 2, text: "Widget 'Customer Support' is now live", time: "1 hour ago", read: false },
    { id: 3, text: "System update completed successfully", time: "Yesterday", read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const notificationsPanel = document.getElementById('notifications-panel');
      const notificationButton = document.getElementById('notification-button');
      
      if (
        notificationsPanel && 
        notificationButton && 
        !notificationsPanel.contains(event.target as Node) && 
        !notificationButton.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <div className="min-h-screen flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          <div className="flex h-16 items-center px-4 md:px-6 lg:px-8">
            <SidebarTrigger />
            <div className="ml-3 mr-8 md:mr-12 font-semibold text-lg hidden md:block">AI Chat Widget System</div>
            
            {/* Search */}
            <div className="relative flex-1 md:max-w-sm">
              {searchOpen ? (
                <div className="relative w-full animate-in fade-in duration-200">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    autoFocus
                    className="w-full pl-9" 
                    placeholder="Search widgets, models, settings..."
                    onBlur={() => {
                      setTimeout(() => setSearchOpen(false), 200);
                    }}
                  />
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 ml-2 md:ml-0" 
                  onClick={toggleSearch}
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 relative" 
                  onClick={handleNotificationClick}
                  id="notification-button"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-medium">
                      {unreadCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
                
                {/* Notifications Panel */}
                {showNotifications && (
                  <Card 
                    id="notifications-panel"
                    className="absolute right-0 mt-2 w-80 z-50 animate-in fade-in slide-in-from-top-5 duration-200"
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between border-b px-4 py-2">
                        <h3 className="font-medium">Notifications</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto text-xs p-1"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </Button>
                      </div>
                      <div className="max-h-64 overflow-auto">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`px-4 py-3 border-b last:border-0 hover:bg-muted/50 ${notification.read ? '' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                          >
                            <p className="text-sm mb-1">{notification.text}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Avatar */}
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AU
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
