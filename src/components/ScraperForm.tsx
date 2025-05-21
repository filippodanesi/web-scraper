
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScraperOptions } from "@/types/scraper";
import { cn } from "@/lib/utils";

interface ScraperFormProps {
  onSubmit: (options: ScraperOptions) => void;
  isLoading: boolean;
}

export const ScraperForm = ({ onSubmit, isLoading }: ScraperFormProps) => {
  const [domain, setDomain] = useState("");
  const [includeDirectories, setIncludeDirectories] = useState("");
  const [excludeDirectories, setExcludeDirectories] = useState("");
  const [maxPages, setMaxPages] = useState(10);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!domain) {
      setError("Please enter a valid domain");
      return;
    }
    
    // Clean the domain from any "http://" or "https://"
    let cleanDomain = domain.trim();
    cleanDomain = cleanDomain.replace(/^https?:\/\//i, "");
    
    setError("");
    onSubmit({
      domain: cleanDomain,
      includeDirectories: includeDirectories.trim(),
      excludeDirectories: excludeDirectories.trim(),
      maxPages
    });
  };

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gray-50 rounded-t-lg">
        <CardTitle className="text-black text-2xl font-bold">Web Scraper</CardTitle>
        <CardDescription>
          Enter the details of the website you want to scrape
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="domain" className="text-gray-700 font-medium">
              Domain (e.g. uk.triumph.com)
            </Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain"
              className={cn(
                "border-gray-300 focus:border-black focus:ring-black",
                error && "border-red-500"
              )}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="includeDirectories" className="text-gray-700 font-medium">
              Directories to include (optional)
            </Label>
            <Input
              id="includeDirectories"
              value={includeDirectories}
              onChange={(e) => setIncludeDirectories(e.target.value)}
              placeholder="e.g. blog, news (comma separated)"
              className="border-gray-300 focus:border-black focus:ring-black"
            />
            <p className="text-xs text-gray-500">
              Leave empty to scrape the entire domain
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="excludeDirectories" className="text-gray-700 font-medium">
              Directories to exclude (optional)
            </Label>
            <Input
              id="excludeDirectories"
              value={excludeDirectories}
              onChange={(e) => setExcludeDirectories(e.target.value)}
              placeholder="e.g. admin, cart (comma separated)"
              className="border-gray-300 focus:border-black focus:ring-black"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPages" className="text-gray-700 font-medium">
              Maximum number of pages
            </Label>
            <Input
              id="maxPages"
              type="number"
              min={1}
              max={100}
              value={maxPages}
              onChange={(e) => setMaxPages(parseInt(e.target.value, 10) || 10)}
              className="border-gray-300 focus:border-black focus:ring-black"
            />
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 py-4 rounded-b-lg">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            {isLoading ? "Processing..." : "Start Scraping"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
