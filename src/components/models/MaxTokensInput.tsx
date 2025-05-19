
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues } from "@/types/models";

interface MaxTokensInputProps {
  form: UseFormReturn<ModelFormValues>;
}

const MaxTokensInput = ({ form }: MaxTokensInputProps) => {
  return (
    <FormField
      control={form.control}
      name="maxTokens"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Max Tokens</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min="1" 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Maximum number of tokens to generate in a response.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MaxTokensInput;
