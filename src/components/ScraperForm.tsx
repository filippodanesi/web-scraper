
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Enter Website Details</h2>
        <p className="text-gray-500 dark:text-gray-400">Configure the scraping parameters below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="domain" className="text-gray-700 dark:text-gray-300 font-medium">
            Domain (e.g. uk.triumph.com)
          </Label>
          <Input
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain"
            className={cn(
              "border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-700 focus:ring-0",
              error && "border-red-500"
            )}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="includeDirectories" className="text-gray-700 dark:text-gray-300 font-medium">
            Directories to include (optional)
          </Label>
          <Input
            id="includeDirectories"
            value={includeDirectories}
            onChange={(e) => setIncludeDirectories(e.target.value)}
            placeholder="e.g. blog, news (comma separated)"
            className="border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-700 focus:ring-0"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Leave empty to scrape the entire domain
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="excludeDirectories" className="text-gray-700 dark:text-gray-300 font-medium">
            Directories to exclude (optional)
          </Label>
          <Input
            id="excludeDirectories"
            value={excludeDirectories}
            onChange={(e) => setExcludeDirectories(e.target.value)}
            placeholder="e.g. admin, cart (comma separated)"
            className="border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-700 focus:ring-0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxPages" className="text-gray-700 dark:text-gray-300 font-medium">
            Maximum number of pages
          </Label>
          <Input
            id="maxPages"
            type="number"
            min={1}
            max={100}
            value={maxPages}
            onChange={(e) => setMaxPages(parseInt(e.target.value, 10) || 10)}
            className="border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-700 focus:ring-0"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {isLoading ? "Processing..." : "Start Scraping"}
        </Button>
      </form>
    </div>
  );
};
