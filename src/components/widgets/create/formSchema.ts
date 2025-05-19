
import { z } from "zod";

// Form schema
export const formSchema = z.object({
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

export const defaultValues = {
  name: "",
  description: "",
  modelId: "",
  welcomeMessage: "Hello! How can I assist you today?",
  active: true,
  primaryColor: "#4F46E5",
  buttonText: "Chat with us",
  buttonPosition: "bottom-right" as const,
  bubbleIcon: "message" as const,
  botName: "Support Assistant",
  inputPlaceholder: "Type your message here...",
  headerTitle: "",
};

export type FormValues = z.infer<typeof formSchema>;
