
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const BehaviorForm = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="font-medium">Rate Limiting</div>
        <div className="text-sm text-muted-foreground mt-1">
          Rate limiting is set to 10 requests per minute by default.
        </div>
      </div>
      
      <div className="rounded-lg border p-4">
        <div className="font-medium">Knowledge Base</div>
        <div className="text-sm text-muted-foreground mt-1 mb-3">
          Connect documents to improve the AI's responses.
        </div>
        <Button variant="outline" size="sm">
          Connect Knowledge Base
        </Button>
      </div>
      
      <div className="rounded-lg border p-4">
        <div className="font-medium">Conversation History</div>
        <div className="text-sm text-muted-foreground mt-1 mb-3">
          Retain conversation history for returning users.
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="history" defaultChecked />
          <label htmlFor="history" className="text-sm">Enable conversation history</label>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="font-medium">Initial Messages</div>
        <div className="text-sm text-muted-foreground mt-1 mb-3">
          Show welcome message when widget opens.
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="showWelcome" defaultChecked />
          <label htmlFor="showWelcome" className="text-sm">Show welcome message</label>
        </div>
      </div>
    </div>
  );
};

export default BehaviorForm;
