
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Bot, User, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Mock widget data - same as in WidgetEdit
const mockWidgetData = {
  "1": {
    id: "1",
    name: "Customer Support",
    description: "AI assistant for customer support inquiries",
    modelId: "1",
    welcomeMessage: "Hello! I'm your customer support assistant. How can I help you today?",
    active: true,
    primaryColor: "#4F46E5",
    buttonText: "Support Chat",
    buttonPosition: "bottom-right",
    bubbleIcon: "message",
  },
  "2": {
    id: "2",
    name: "Product Assistant",
    description: "AI assistant for product recommendations",
    modelId: "2",
    welcomeMessage: "Hi there! Looking for product recommendations? I'm here to help!",
    active: true,
    primaryColor: "#10B981",
    buttonText: "Product Help",
    buttonPosition: "bottom-left",
    bubbleIcon: "question",
  }
};

// Mock conversation for preview
const mockConversation = [
  { sender: "bot", message: "Hello! I'm your customer support assistant. How can I help you today?" },
  { sender: "user", message: "I have a question about my recent order." },
  { sender: "bot", message: "I'd be happy to help with your order inquiry. Could you please provide your order number so I can look up the details?" },
  { sender: "user", message: "My order number is #A12345." },
  { sender: "bot", message: "Thank you! I can see your order #A12345 was placed on May 15th and is currently being processed. It's estimated to ship within 2 business days. Is there anything specific about the order you'd like to know?" },
];

const WidgetPreview = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [newMessage, setNewMessage] = useState<string>("");
  const [conversation, setConversation] = useState(mockConversation);

  // In a real app, we'd fetch the widget data from an API
  const widgetData = id ? mockWidgetData[id as keyof typeof mockWidgetData] : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Add user message
    setConversation([...conversation, { sender: "user", message: newMessage }]);
    setNewMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      setConversation(prev => [
        ...prev,
        { sender: "bot", message: "Thank you for your message. This is a simulated response in the preview mode." }
      ]);
    }, 1000);
  };

  const getEmbedCode = (type: string) => {
    switch (type) {
      case 'script':
        return `<script src="https://chatwidget.ai/widget/${id}/embed.js" async></script>`;
      case 'iframe':
        return `<iframe src="https://chatwidget.ai/widget/${id}/iframe" width="100%" height="600px" frameborder="0"></iframe>`;
      case 'react':
        return `import { ChatWidget } from '@chatwidget/react';\n\nexport default function MyApp() {\n  return (\n    <ChatWidget widgetId="${id}" />\n  );\n}`;
      default:
        return '';
    }
  };

  const copyEmbedCode = (type: string) => {
    const code = getEmbedCode(type);
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} embed code copied successfully.`,
    });
  };

  if (!widgetData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Widget not found</CardTitle>
            <CardDescription>
              The widget you're trying to preview doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button onClick={() => navigate("/widgets")}>
              Back to widgets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 fade-in">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => navigate("/widgets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Preview: {widgetData.name}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b pb-3">
              <div className="flex items-center space-x-2">
                <div
                  className="p-2 rounded-full"
                  style={{ backgroundColor: widgetData.primaryColor }}
                >
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <CardTitle>{widgetData.name}</CardTitle>
              </div>
              <CardDescription>{widgetData.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow overflow-y-auto py-4">
              <div className="space-y-4">
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.sender === "bot" && (
                          <Bot className="h-5 w-5 mt-0.5" />
                        )}
                        <div>{msg.message}</div>
                        {msg.sender === "user" && (
                          <User className="h-5 w-5 mt-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="border-t py-3">
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow"
                />
                <Button type="submit">Send</Button>
              </form>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Embed Options</CardTitle>
              <CardDescription>Choose how to embed this widget on your site.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="iframe">iFrame</TabsTrigger>
                  <TabsTrigger value="react">React</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="mt-4">
                  <div className="bg-secondary p-4 rounded-md mb-4 relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyEmbedCode('script')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                      {getEmbedCode('script')}
                    </pre>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add this script tag to your website's HTML. The chat button will appear in the 
                    {' '}{widgetData.buttonPosition.replace('-', ' ')}.
                  </p>
                </TabsContent>
                
                <TabsContent value="iframe" className="mt-4">
                  <div className="bg-secondary p-4 rounded-md mb-4 relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyEmbedCode('iframe')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                      {getEmbedCode('iframe')}
                    </pre>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use this iframe code to embed the chat widget directly in your page.
                  </p>
                </TabsContent>
                
                <TabsContent value="react" className="mt-4">
                  <div className="bg-secondary p-4 rounded-md mb-4 relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyEmbedCode('react')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                      {getEmbedCode('react')}
                    </pre>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    If you're using React, you can use our component library.
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">
                      View React Documentation
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
              <CardDescription>A summary of the current configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">Status</span>
                <span className={`text-sm ${widgetData.active ? 'text-green-600' : 'text-gray-500'}`}>
                  {widgetData.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">AI Model</span>
                <span className="text-sm">{widgetData.modelId === "1" ? "GPT-4" : "Gemini Pro"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">Button Position</span>
                <span className="text-sm capitalize">{widgetData.buttonPosition.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Primary Color</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: widgetData.primaryColor }}
                  />
                  <span className="text-sm">{widgetData.primaryColor}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={`/widgets/${id}/edit`}>
                  Edit Widget Settings
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WidgetPreview;
