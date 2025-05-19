
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues } from "@/types/models";

interface ApiKeyInputProps {
  form: UseFormReturn<ModelFormValues>;
}

const ApiKeyInput = ({ form }: ApiKeyInputProps) => {
  return (
    <FormField
      control={form.control}
      name="apiKey"
      render={({ field }) => (
        <FormItem>
          <FormLabel>API Key</FormLabel>
          <FormControl>
            <Input 
              type="password" 
              placeholder="Enter your API key" 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Your API key will be encrypted and stored securely.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ApiKeyInput;
