
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Monitor, Smartphone, Tablet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import WidgetPreviewComponent from "@/components/widgets/WidgetPreviewComponent";
import type { WidgetConfig } from "@/components/widgets/WidgetPreviewComponent";

interface WidgetPreviewProps {
  config: WidgetConfig;
}

const WidgetPreview = ({ config }: WidgetPreviewProps) => {
  const { toast } = useToast();
  const [previewDevice, setPreviewDevice] = useState("desktop");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle>Widget Preview</CardTitle>
            <div className="flex border rounded-md">
              <Button 
                variant={previewDevice === "desktop" ? "secondary" : "ghost"} 
                size="sm" 
                className="px-2"
                onClick={() => setPreviewDevice("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button 
                variant={previewDevice === "tablet" ? "secondary" : "ghost"} 
                size="sm" 
                className="px-2"
                onClick={() => setPreviewDevice("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button 
                variant={previewDevice === "mobile" ? "secondary" : "ghost"} 
                size="sm" 
                className="px-2"
                onClick={() => setPreviewDevice("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>See how your widget will appear to users.</CardDescription>
        </CardHeader>
        <CardContent className={`pt-2 ${
          previewDevice === "mobile" 
            ? "max-w-[320px]" 
            : previewDevice === "tablet" 
              ? "max-w-[600px]" 
              : "max-w-[100%]"
        } mx-auto`}>
          <WidgetPreviewComponent config={config} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
          <CardDescription>Add this code to your website.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-secondary p-4 rounded-md text-xs overflow-x-auto">
              {`<script src="https://chatwidget.ai/widget/WIDGET_ID/embed.js" async></script>`}
            </pre>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-3 right-3"
              onClick={() => {
                navigator.clipboard.writeText(`<script src="https://chatwidget.ai/widget/WIDGET_ID/embed.js" async></script>`);
                toast({
                  description: "Embed code copied to clipboard",
                });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            You'll get the final embed code once the widget is created.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WidgetPreview;
