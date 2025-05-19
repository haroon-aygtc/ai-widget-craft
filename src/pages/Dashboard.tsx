
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, BarChart3, Database, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Dashboard = () => {
  // Mock data for stats
  const stats = [
    { title: "Total Widgets", value: "12", icon: MessageSquare, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    { title: "Active Chats", value: "843", icon: Users, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
    { title: "Total Messages", value: "5,423", icon: BarChart3, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
    { title: "AI Models", value: "5", icon: Database, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex space-x-3">
          <Button asChild variant="outline" className="border-dashed">
            <Link to="/models/create">
              <Database className="mr-2 h-4 w-4" />
              Add Model
            </Link>
          </Button>
          <Button asChild className="shadow-md">
            <Link to="/widgets/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Widget
            </Link>
          </Button>
        </div>
      </div>
      
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Card className="overflow-hidden border border-border/50 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md dark:bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-border/50 backdrop-blur-sm shadow-sm h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex items-center space-x-4 border-b pb-3 last:border-0"
                >
                  <div className="rounded-full h-10 w-10 flex items-center justify-center bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Customer Service Widget Updated</div>
                    <div className="text-sm text-muted-foreground">5 hours ago</div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-border/50 backdrop-blur-sm shadow-sm h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {[
                { label: "Create New Chat Widget", icon: MessageSquare, path: "/widgets/create" },
                { label: "Add New AI Model", icon: Database, path: "/models/create" },
                { label: "View Analytics", icon: BarChart3, path: "#" },
                { label: "Manage Team", icon: Users, path: "#" }
              ].map((action, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Button className="w-full justify-start bg-background hover:bg-accent transition-all" variant="outline" asChild>
                    <Link to={action.path}>
                      <action.icon className="mr-2 h-4 w-4 text-primary" />
                      {action.label}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
