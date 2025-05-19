
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues, Provider } from "@/types/models";

interface ProviderSelectProps {
  form: UseFormReturn<ModelFormValues>;
  providers: Provider[];
}

const ProviderSelect = ({ form, providers }: ProviderSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="provider"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Provider</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            The AI service provider for this model.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProviderSelect;
