
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues } from "@/types/models";

interface TemperatureInputProps {
  form: UseFormReturn<ModelFormValues>;
}

const TemperatureInput = ({ form }: TemperatureInputProps) => {
  return (
    <FormField
      control={form.control}
      name="temperature"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Temperature (0-1)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min="0" 
              max="1" 
              step="0.1" 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Controls randomness: 0 is deterministic, 1 is creative.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TemperatureInput;
