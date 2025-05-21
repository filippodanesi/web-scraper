
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FirecrawlService } from "@/utils/firecrawlService";
import { useToast } from "@/hooks/use-toast";
import { Key } from "lucide-react";

export const ApiKeySetup = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = FirecrawlService.getApiKey();
    setHasStoredKey(!!storedKey);
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Test API key with Firecrawl
      const isValid = await FirecrawlService.testApiKey(apiKey);
      
      if (isValid) {
        FirecrawlService.saveApiKey(apiKey);
        setHasStoredKey(true);
        setApiKey("");
        
        toast({
          title: "Success",
          description: "Firecrawl API key verified and saved successfully",
        });
      } else {
        toast({
          title: "Invalid API Key",
          description: "The provided API key was rejected by Firecrawl",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying API key:", error);
      toast({
        title: "Error",
        description: "Failed to verify API key with Firecrawl",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('firecrawl_api_key');
    setHasStoredKey(false);
    toast({
      title: "API key removed",
      description: "The Firecrawl API key has been removed",
    });
  };

  if (hasStoredKey) {
    return (
      <Card className="w-full shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Key className="h-4 w-4 mr-2" />
            Firecrawl API Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-3">
          <p className="text-sm text-gray-600">
            Your Firecrawl API key is configured and ready to use.
          </p>
        </CardContent>
        <CardFooter className="pt-0 pb-3">
          <Button 
            variant="outline" 
            className="text-xs" 
            size="sm"
            onClick={handleClearKey}
          >
            Remove API Key
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md border-gray-200 mb-6">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-black text-xl font-bold">Firecrawl API Setup</CardTitle>
        <CardDescription>
          Enter your Firecrawl API key to enable web scraping
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-gray-700 font-medium">
            Firecrawl API Key
          </Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Firecrawl API key"
            className="border-gray-300 focus:border-black focus:ring-black"
          />
          <p className="text-xs text-gray-500">
            You can get your API key from the <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="underline">Firecrawl dashboard</a>.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 py-4 rounded-b-lg">
        <Button 
          onClick={handleSaveKey} 
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-gray-800 text-white"
        >
          {isSubmitting ? "Verifying..." : "Save API Key"}
        </Button>
      </CardFooter>
    </Card>
  );
};
