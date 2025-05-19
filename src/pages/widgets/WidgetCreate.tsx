import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, MessageSquare, Brush, Settings, MessageCircle, Bot, Code, Copy, Monitor, Smartphone, Tablet } from "lucide-react";
import WidgetPreviewComponent from "@/components/widgets/WidgetPreviewComponent";
import type { WidgetConfig } from "@/components/widgets/WidgetPreviewComponent";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Widget name is required" }),
  description: z.string().optional(),
  modelId: z.string({ required_error: "Please select an AI model" }),
  welcomeMessage: z.string().min(1, { message: "Welcome message is required" }),
  active: z.boolean().default(true),
  primaryColor: z.string().default("#4F46E5"),
  buttonText: z.string().default("Chat with us"),
  buttonPosition: z.enum(["bottom-right", "bottom-left", "bottom-center"]).default("bottom-right"),
  bubbleIcon: z.enum(["message", "question", "bot"]).default("message"),
  botName: z.string().default("Support Assistant"),
  inputPlaceholder: z.string().default("Type your message here..."),
  headerTitle: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const WidgetCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  
  // Mock AI models
  const aiModels = [
    { id: "1", name: "GPT-4" },
    { id: "2", name: "Gemini Pro" },
    { id: "3", name: "Claude Instant" },
    { id: "4", name: "Mistral-7B" },
    { id: "5", name: "OpenRouter" },
    { id: "6", name: "Hugging Face" },
    { id: "7", name: "DeepSeek" },
  ];
  
  const defaultValues: FormValues = {
    name: "",
    description: "",
    modelId: "",
    welcomeMessage: "Hello! How can I assist you today?",
    active: true,
    primaryColor: "#4F46E5",
    buttonText: "Chat with us",
    buttonPosition: "bottom-right",
    bubbleIcon: "message",
    botName: "Support Assistant",
    inputPlaceholder: "Type your message here...",
    headerTitle: "",
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const formValues = form.watch();
  
  const onSubmit = (data: FormValues) => {
    // In a real app, this would submit to your backend
    console.log("Form submitted:", data);
    toast({
      title: "Widget created!",
      description: `${data.name} has been created successfully.`,
    });
    navigate("/widgets");
  };

  // Create a complete widget config for the preview component
  const widgetConfig: WidgetConfig = {
    name: formValues.name || "Chat Widget",
    description: formValues.description,
    welcomeMessage: formValues.welcomeMessage,
    primaryColor: formValues.primaryColor,
    buttonText: formValues.buttonText,
    buttonPosition: formValues.buttonPosition,
    bubbleIcon: formValues.bubbleIcon,
    active: formValues.active,
    modelId: formValues.modelId,
    botName: formValues.botName,
    inputPlaceholder: formValues.inputPlaceholder,
    headerTitle: formValues.headerTitle,
  };
  
  return (
    <div className="space-y-6 pb-10 fade-in">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => navigate("/widgets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Widget</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Widget Configuration</CardTitle>
              <CardDescription>Configure your AI chat widget's settings and appearance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="basic">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="appearance">
                    <Brush className="mr-2 h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="behavior">
                    <Settings className="mr-2 h-4 w-4" />
                    Behavior
                  </TabsTrigger>
                  <TabsTrigger value="advanced">
                    <Code className="mr-2 h-4 w-4" />
                    Advanced
                  </TabsTrigger>
                </TabsList>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <TabsContent value="basic" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Widget Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Customer Support Bot" {...field} />
                            </FormControl>
                            <FormDescription>
                              A name to identify your widget in the dashboard.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe what this widget is for..." 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="modelId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AI Model</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an AI model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {aiModels.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    {model.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose which AI model will power this chat widget.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Active Status</FormLabel>
                              <FormDescription>
                                Enable or disable this chat widget on your website.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="appearance" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded border shadow-sm" 
                                style={{ backgroundColor: field.value }}
                              />
                              <FormControl>
                                <Input type="color" {...field} />
                              </FormControl>
                            </div>
                            <FormDescription>
                              Choose the main color for your chat widget.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="buttonText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Button Text</FormLabel>
                            <FormControl>
                              <Input placeholder="Chat with us" {...field} />
                            </FormControl>
                            <FormDescription>
                              The text shown on the chat button.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="buttonPosition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Button Position</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Where the chat button will appear on your website.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bubbleIcon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Button Icon</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="message" className="flex items-center">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  <span>Message</span>
                                </SelectItem>
                                <SelectItem value="question" className="flex items-center">
                                  <MessageCircle className="mr-2 h-4 w-4" />
                                  <span>Question</span>
                                </SelectItem>
                                <SelectItem value="bot" className="flex items-center">
                                  <Bot className="mr-2 h-4 w-4" />
                                  <span>Bot</span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The icon displayed on the chat button.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="content" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="welcomeMessage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Welcome Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Hello! How can I help you today?" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              The first message users will see when they open the chat.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="botName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bot Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Support Assistant" {...field} />
                            </FormControl>
                            <FormDescription>
                              Name displayed for the bot in the conversation.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="headerTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chat Header Title (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Support Chat" {...field} />
                            </FormControl>
                            <FormDescription>
                              Title shown in the widget header. If empty, Bot Name will be used.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inputPlaceholder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Input Placeholder</FormLabel>
                            <FormControl>
                              <Input placeholder="Type your message here..." {...field} />
                            </FormControl>
                            <FormDescription>
                              Placeholder text shown in the message input field.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="behavior" className="space-y-6">
                      {/* Additional behavior settings would go here in a real app */}
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <div className="font-medium">Rate Limiting</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Rate limiting is set to 10 requests per minute by default.
                          </div>
                        </div>
                        
                        <div className="rounded-lg border p-4">
                          <div className="font-medium">Knowledge Base</div>
                          <div className="text-sm text-muted-foreground mt-1 mb-3">
                            Connect documents to improve the AI's responses.
                          </div>
                          <Button variant="outline" size="sm">
                            Connect Knowledge Base
                          </Button>
                        </div>
                        
                        <div className="rounded-lg border p-4">
                          <div className="font-medium">Conversation History</div>
                          <div className="text-sm text-muted-foreground mt-1 mb-3">
                            Retain conversation history for returning users.
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="history" defaultChecked />
                            <label htmlFor="history" className="text-sm">Enable conversation history</label>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="font-medium">Initial Messages</div>
                          <div className="text-sm text-muted-foreground mt-1 mb-3">
                            Show welcome message when widget opens.
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="showWelcome" defaultChecked />
                            <label htmlFor="showWelcome" className="text-sm">Show welcome message</label>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-6">
                      <div className="rounded-lg border p-4">
                        <div className="font-medium">Custom CSS</div>
                        <div className="text-sm text-muted-foreground mt-1 mb-3">
                          Add custom CSS to style your chat widget.
                        </div>
                        <Textarea 
                          placeholder="/* Add your custom CSS here */
.chat-widget {
  /* Your styles */
}" 
                          className="h-32 font-mono text-sm"
                        />
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="font-medium">Custom Scripts</div>
                        <div className="text-sm text-muted-foreground mt-1 mb-3">
                          Add custom JavaScript to extend your chat widget.
                        </div>
                        <Textarea 
                          placeholder="// Add your custom JavaScript here
document.addEventListener('DOMContentLoaded', function() {
  // Your code
});" 
                          className="h-32 font-mono text-sm"
                        />
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="font-medium">Domain Restrictions</div>
                        <div className="text-sm text-muted-foreground mt-1 mb-3">
                          Limit widget to specific domains (one per line).
                        </div>
                        <Textarea 
                          placeholder="example.com
subdomain.example.com" 
                          className="h-24 font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                    
                    <div className="flex justify-end pt-4 border-t">
                      <Button type="button" variant="outline" className="mr-2" onClick={() => navigate("/widgets")}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Widget</Button>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <CardTitle>Widget Preview</CardTitle>
                <div className="flex border rounded-md">
                  <Button 
                    variant={previewDevice === "desktop" ? "secondary" : "ghost"} 
                    size="sm" 
                    className="px-2"
                    onClick={() => setPreviewDevice("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={previewDevice === "tablet" ? "secondary" : "ghost"} 
                    size="sm" 
                    className="px-2"
                    onClick={() => setPreviewDevice("tablet")}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={previewDevice === "mobile" ? "secondary" : "ghost"} 
                    size="sm" 
                    className="px-2"
                    onClick={() => setPreviewDevice("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>See how your widget will appear to users.</CardDescription>
            </CardHeader>
            <CardContent className={`pt-2 ${
              previewDevice === "mobile" 
                ? "max-w-[320px]" 
                : previewDevice === "tablet" 
                  ? "max-w-[600px]" 
                  : "max-w-[100%]"
            } mx-auto`}>
              <WidgetPreviewComponent config={widgetConfig} />
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>Add this code to your website.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-secondary p-4 rounded-md text-xs overflow-x-auto">
                  {`<script src="https://chatwidget.ai/widget/WIDGET_ID/embed.js" async></script>`}
                </pre>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-3 right-3"
                  onClick={() => {
                    navigator.clipboard.writeText(`<script src="https://chatwidget.ai/widget/WIDGET_ID/embed.js" async></script>`);
                    toast({
                      description: "Embed code copied to clipboard",
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                You'll get the final embed code once the widget is created.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WidgetCreate;
