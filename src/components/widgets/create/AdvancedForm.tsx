
import { Textarea } from "@/components/ui/textarea";

const AdvancedForm = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="font-medium">Custom CSS</div>
        <div className="text-sm text-muted-foreground mt-1 mb-3">
          Add custom CSS to style your chat widget.
        </div>
        <Textarea 
          placeholder="/* Add your custom CSS here */
.chat-widget {
  /* Your styles */
}" 
          className="h-32 font-mono text-sm"
        />
      </div>

      <div className="rounded-lg border p-4">
        <div className="font-medium">Custom Scripts</div>
        <div className="text-sm text-muted-foreground mt-1 mb-3">
          Add custom JavaScript to extend your chat widget.
        </div>
        <Textarea 
          placeholder="// Add your custom JavaScript here
document.addEventListener('DOMContentLoaded', function() {
  // Your code
});" 
          className="h-32 font-mono text-sm"
        />
      </div>

      <div className="rounded-lg border p-4">
        <div className="font-medium">Domain Restrictions</div>
        <div className="text-sm text-muted-foreground mt-1 mb-3">
          Limit widget to specific domains (one per line).
        </div>
        <Textarea 
          placeholder="example.com
subdomain.example.com" 
          className="h-24 font-mono text-sm"
        />
      </div>
    </div>
  );
};

export default AdvancedForm;
