
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, BarChart3, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // Mock data for stats
  const stats = [
    { title: "Total Widgets", value: "12", icon: MessageSquare, color: "bg-blue-100 text-blue-700" },
    { title: "Active Chats", value: "843", icon: Users, color: "bg-green-100 text-green-700" },
    { title: "Total Messages", value: "5,423", icon: BarChart3, color: "bg-purple-100 text-purple-700" },
    { title: "AI Models", value: "5", icon: Database, color: "bg-amber-100 text-amber-700" }
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex space-x-3">
          <Button asChild variant="outline">
            <Link to="/widgets">Manage Widgets</Link>
          </Button>
          <Button asChild>
            <Link to="/widgets/create">Create New Widget</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
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
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4 border-b pb-3">
                <div className="rounded-full h-10 w-10 flex items-center justify-center bg-gray-100">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">Customer Service Widget Updated</div>
                  <div className="text-sm text-muted-foreground">5 hours ago</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/widgets/create">
                <MessageSquare className="mr-2 h-4 w-4" />
                Create New Chat Widget
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/models/create">
                <Database className="mr-2 h-4 w-4" />
                Add New AI Model
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Team
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
