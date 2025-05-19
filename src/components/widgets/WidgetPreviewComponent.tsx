
import { useState } from "react";
import { MessageSquare, Bot, User, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface WidgetConfig {
  name: string;
  description?: string;
  welcomeMessage: string;
  primaryColor: string;
  buttonText: string;
  buttonPosition: string;
  bubbleIcon: "message" | "question" | "bot";
  active?: boolean;
  [key: string]: any;
}

const WidgetPreviewComponent = ({ config }: { config: WidgetConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([]);

  // Use a default color if none provided
  const primaryColor = config.primaryColor || "#4F46E5";

  // Choose icon based on configuration
  const BubbleIcon = () => {
    switch (config.bubbleIcon) {
      case "question":
        return <MessageCircle className="h-6 w-6" />;
      case "bot":
        return <Bot className="h-6 w-6" />;
      default:
        return <MessageSquare className="h-6 w-6" />;
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      // Only add welcome message if this is first open
      setMessages([{ sender: "bot", text: config.welcomeMessage }]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // Add user message
    setMessages([...messages, { sender: "user", text: newMessage }]);
    setNewMessage("");

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "bot", text: "This is a preview of how the AI would respond to your message." }]);
    }, 1000);
  };

  // Determine button position styles
  const getButtonPositionStyles = () => {
    switch (config.buttonPosition) {
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2";
      case "bottom-right":
      default:
        return "bottom-4 right-4";
    }
  };

  return (
    <div className="relative h-[500px] border rounded-md bg-gray-50 overflow-hidden">
      {/* Simulated webpage content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
        <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded mb-6"></div>
        <div className="w-5/6 h-32 bg-gray-200 rounded mb-4"></div>
        <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* Chat widget button */}
      {!isOpen && (
        <button
          className={`absolute ${getButtonPositionStyles()} z-10 flex items-center gap-2 px-4 py-2 rounded-full text-white shadow-md hover:shadow-lg transition-shadow`}
          style={{ backgroundColor: primaryColor }}
          onClick={handleOpen}
        >
          <BubbleIcon />
          <span>{config.buttonText || "Chat with us"}</span>
        </button>
      )}

      {/* Chat widget window */}
      {isOpen && (
        <Card className="absolute bottom-4 right-4 w-[300px] h-[400px] z-20 flex flex-col shadow-lg overflow-hidden">
          <div 
            className="flex items-center justify-between p-3"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center text-white gap-2">
              <BubbleIcon />
              <div className="font-medium">{config.name || "Chat Widget"}</div>
            </div>
            <button onClick={handleClose} className="text-white hover:bg-white/10 p-1 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-3 space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-2 ${
                    message.sender === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary"
                  }`}
                  style={message.sender === "user" ? { backgroundColor: primaryColor } : {}}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "bot" && (
                      <Bot className="h-4 w-4 mt-0.5" />
                    )}
                    <div className="text-sm">{message.text}</div>
                    {message.sender === "user" && (
                      <User className="h-4 w-4 mt-0.5 text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t p-3">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow text-sm"
              />
              <Button 
                type="submit" 
                size="sm"
                style={{ backgroundColor: primaryColor }}
              >
                Send
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WidgetPreviewComponent;
