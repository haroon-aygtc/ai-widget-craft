
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { MessageSquare, MessageCircle, Bot } from "lucide-react";
import { z } from "zod";

// Import the form schema type from the parent
import { formSchema } from "./formSchema";

type FormValues = z.infer<typeof formSchema>;

interface AppearanceFormProps {
  control: Control<FormValues>;
}

const AppearanceForm = ({ control }: AppearanceFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
    </div>
  );
};

export default AppearanceForm;
