
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { z } from "zod";

// Import the form schema type from the parent
import { formSchema } from "./formSchema";

type FormValues = z.infer<typeof formSchema>;

interface ContentFormProps {
  control: Control<FormValues>;
}

const ContentForm = ({ control }: ContentFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
    </div>
  );
};

export default ContentForm;
