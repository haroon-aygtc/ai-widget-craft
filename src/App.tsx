
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WidgetsList from "./pages/widgets/WidgetsList";
import WidgetCreate from "./pages/widgets/WidgetCreate";
import WidgetEdit from "./pages/widgets/WidgetEdit";
import AIModelsList from "./pages/models/AIModelsList";
import AIModelCreate from "./pages/models/AIModelCreate";
import AIModelEdit from "./pages/models/AIModelEdit";
import WidgetPreview from "./pages/widgets/WidgetPreview";
import AdminLayout from "./components/layouts/AdminLayout";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ai-widget-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="widgets">
                <Route index element={<WidgetsList />} />
                <Route path="create" element={<WidgetCreate />} />
                <Route path=":id/edit" element={<WidgetEdit />} />
                <Route path=":id/preview" element={<WidgetPreview />} />
              </Route>
              <Route path="models">
                <Route index element={<AIModelsList />} />
                <Route path="create" element={<AIModelCreate />} />
                <Route path=":id/edit" element={<AIModelEdit />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
