
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues } from "@/types/models";

interface ActiveStatusToggleProps {
  form: UseFormReturn<ModelFormValues>;
}

const ActiveStatusToggle = ({ form }: ActiveStatusToggleProps) => {
  return (
    <FormField
      control={form.control}
      name="active"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Active Status</FormLabel>
            <FormDescription>
              Enable or disable this AI model for use in chat widgets.
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
  );
};

export default ActiveStatusToggle;
