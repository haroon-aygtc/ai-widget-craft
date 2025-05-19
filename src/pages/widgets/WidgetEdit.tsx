
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ArrowLeft, MessageSquare, Brush, Settings, MessageCircle, Bot } from "lucide-react";
import WidgetPreviewComponent from "@/components/widgets/WidgetPreviewComponent";

// Mock widget data - in a real app, this would come from your API
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

// Form schema (same as in WidgetCreate)
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
});

type FormValues = z.infer<typeof formSchema>;

const WidgetEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");

  // Mock AI models
  const aiModels = [
    { id: "1", name: "GPT-4" },
    { id: "2", name: "Gemini Pro" },
    { id: "3", name: "Claude Instant" },
    { id: "4", name: "Mistral-7B" },
    { id: "5", name: "OpenRouter" },
  ];

  // In a real app, we'd fetch the widget data from an API
  const widgetData = id ? mockWidgetData[id as keyof typeof mockWidgetData] : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: widgetData || {
      name: "",
      description: "",
      modelId: "",
      welcomeMessage: "Hello! How can I assist you today?",
      active: true,
      primaryColor: "#4F46E5",
      buttonText: "Chat with us",
      buttonPosition: "bottom-right",
      bubbleIcon: "message",
    },
  });

  const formValues = form.watch();

  const onSubmit = (data: FormValues) => {
    // In a real app, this would submit to your backend
    console.log("Form submitted:", data);
    toast({
      title: "Widget updated!",
      description: `${data.name} has been updated successfully.`,
    });
    navigate("/widgets");
  };

  if (!widgetData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Widget not found</CardTitle>
            <CardDescription>
              The widget you're trying to edit doesn't exist.
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Widget</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Widget Configuration</CardTitle>
              <CardDescription>Edit your AI chat widget's settings and appearance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="basic">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Basic Setup
                  </TabsTrigger>
                  <TabsTrigger value="appearance">
                    <Brush className="mr-2 h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="behavior">
                    <Settings className="mr-2 h-4 w-4" />
                    Behavior
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
                      </div>
                    </TabsContent>

                    <div className="flex justify-end pt-4 border-t">
                      <Button type="button" variant="outline" className="mr-2" onClick={() => navigate("/widgets")}>
                        Cancel
                      </Button>
                      <Button type="submit">Update Widget</Button>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Widget Preview</CardTitle>
              <CardDescription>See how your widget will appear to users.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <WidgetPreviewComponent config={formValues} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WidgetEdit;
