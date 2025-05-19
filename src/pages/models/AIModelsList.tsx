
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
  Database, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Search,
  CheckCircle, 
  XCircle
} from "lucide-react";

// Mock data for AI models
const mockModels = [
  { 
    id: "1", 
    name: "GPT-4", 
    provider: "OpenAI", 
    type: "text",
    status: true, 
    apiKey: "sk-•••••••••••••••",
    lastUsed: "2023-05-18"
  },
  { 
    id: "2", 
    name: "Gemini Pro", 
    provider: "Google", 
    type: "text",
    status: true, 
    apiKey: "AIza•••••••••••••",
    lastUsed: "2023-05-15"
  },
  { 
    id: "3", 
    name: "Claude Instant", 
    provider: "Anthropic", 
    type: "text", 
    status: false, 
    apiKey: "sk-ant-•••••••••••",
    lastUsed: "2023-05-10"
  },
  { 
    id: "4", 
    name: "Mistral-7B", 
    provider: "HuggingFace", 
    type: "text", 
    status: true, 
    apiKey: "hf_•••••••••••••••",
    lastUsed: "2023-05-08"
  },
  { 
    id: "5", 
    name: "OpenRouter Mix", 
    provider: "OpenRouter", 
    type: "text",
    status: true, 
    apiKey: "sk-or-•••••••••••••",
    lastUsed: "2023-05-05"
  }
];

const AIModelsList = () => {
  const [models, setModels] = useState(mockModels);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteModel = (id: string) => {
    setModels(models.filter(model => model.id !== id));
    toast({
      title: "Model deleted",
      description: `AI Model #${id} has been successfully deleted.`,
    });
  };

  const handleToggleStatus = (id: string) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, status: !model.status } : model
    ));
    
    const model = models.find(m => m.id === id);
    if (model) {
      toast({
        title: model.status ? "Model deactivated" : "Model activated",
        description: `${model.name} has been ${model.status ? 'deactivated' : 'activated'}.`,
      });
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">AI Models</h1>
        <Button asChild>
          <Link to="/models/create">
            <Plus className="mr-2 h-4 w-4" /> Add Model
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center w-full mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
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
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">API Key</TableHead>
                  <TableHead className="hidden md:table-cell">Last Used</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No AI models found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <Database className="h-4 w-4 text-primary" />
                          </div>
                          {model.name}
                        </div>
                      </TableCell>
                      <TableCell>{model.provider}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {model.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {model.status ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">
                            <XCircle className="mr-1 h-3 w-3" /> Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">
                        {model.apiKey}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{model.lastUsed}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/models/${model.id}/edit`} className="flex items-center cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(model.id)} className="cursor-pointer">
                              {model.status ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  <span>Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  <span>Activate</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteModel(model.id)}
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

export default AIModelsList;
