
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  MessageSquare, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Eye, 
  Copy, 
  Trash2, 
  Search,
  CheckCircle, 
  XCircle
} from "lucide-react";

// Mock data for widgets
const mockWidgets = [
  { 
    id: "1", 
    name: "Customer Support", 
    status: true, 
    model: "GPT-4", 
    lastUpdated: "2023-05-18",
    conversations: 245
  },
  { 
    id: "2", 
    name: "Product Assistant", 
    status: true, 
    model: "Gemini Pro", 
    lastUpdated: "2023-05-15", 
    conversations: 187
  },
  { 
    id: "3", 
    name: "Sales Inquiry", 
    status: false, 
    model: "OpenRouter", 
    lastUpdated: "2023-05-10", 
    conversations: 56
  },
  { 
    id: "4", 
    name: "HR Bot", 
    status: true, 
    model: "Claude", 
    lastUpdated: "2023-05-08", 
    conversations: 122
  },
  { 
    id: "5", 
    name: "Technical Support", 
    status: true, 
    model: "Mistral-7B", 
    lastUpdated: "2023-05-05", 
    conversations: 321
  }
];

const WidgetsList = () => {
  const [widgets] = useState(mockWidgets);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredWidgets = widgets.filter(widget => 
    widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    widget.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyEmbedCode = (id: string) => {
    const embedCode = `<script src="https://chatwidget.ai/widget/${id}/embed.js" async></script>`;
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed code copied!",
      description: "The widget embed code has been copied to your clipboard.",
    });
  };

  const handleDeleteWidget = (id: string) => {
    toast({
      title: "Widget deleted",
      description: `Widget #${id} has been successfully deleted.`,
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Chat Widgets</h1>
        <Button asChild>
          <Link to="/widgets/create">
            <Plus className="mr-2 h-4 w-4" /> Create Widget
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center w-full mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search widgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI Model</TableHead>
                  <TableHead className="hidden md:table-cell">Conversations</TableHead>
                  <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWidgets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No widgets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWidgets.map((widget) => (
                    <TableRow key={widget.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          {widget.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {widget.status ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">
                            <XCircle className="mr-1 h-3 w-3" /> Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{widget.model}</TableCell>
                      <TableCell className="hidden md:table-cell">{widget.conversations.toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell">{widget.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/widgets/${widget.id}/edit`} className="flex items-center cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/widgets/${widget.id}/preview`} className="flex items-center cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Preview</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyEmbedCode(widget.id)} className="cursor-pointer">
                              <Copy className="mr-2 h-4 w-4" />
                              <span>Copy Embed Code</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteWidget(widget.id)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WidgetsList;
