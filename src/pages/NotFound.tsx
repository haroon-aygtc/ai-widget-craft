
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <motion.div 
        className="text-center space-y-5 max-w-md px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-9xl font-bold text-primary/50"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
        >
          404
        </motion.div>
        
        <h1 className="text-3xl font-bold">Page not found</h1>
        
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been removed or doesn't exist.
        </p>
        
        <motion.div 
          className="pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
