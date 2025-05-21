
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScraperForm } from "./ScraperForm";
import { ScraperResults } from "./ScraperResults";
import { ApiKeySetup } from "./ApiKeySetup";
import { FirecrawlService } from "@/utils/firecrawlService";
import { ScraperOptions, ScraperResult, ScraperStatus } from "@/types/scraper";

export const WebScraper = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<ScraperStatus>("idle");
  const [results, setResults] = useState<ScraperResult[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Check if API key is configured
    const apiKey = FirecrawlService.getApiKey();
    setHasApiKey(!!apiKey);
  }, []);

  // Check API key status when component mounts or after changes
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = FirecrawlService.getApiKey();
      setHasApiKey(!!apiKey);
    };

    // Set up event listener for storage changes (in case API key is set in another tab)
    window.addEventListener('storage', checkApiKey);
    
    // Initial check
    checkApiKey();

    // Cleanup
    return () => {
      window.removeEventListener('storage', checkApiKey);
    };
  }, []);

  const handleSubmit = async (options: ScraperOptions) => {
    // First check if API key is configured
    const apiKey = FirecrawlService.getApiKey();
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Firecrawl API key before scraping.",
        variant: "destructive",
      });
      return;
    }

    setStatus("loading");
    
    try {
      console.log("Starting scraping with options:", options);
      
      // Use Firecrawl service instead of the mock service
      const scrapedResults = await FirecrawlService.crawlWebsite(options);
      setResults(scrapedResults);
      
      if (scrapedResults.length === 0) {
        toast({
          title: "No results found",
          description: "The scraping found no content. Try modifying the parameters.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Scraping completed",
          description: `Found ${scrapedResults.length} results.`,
        });
      }
      
      setStatus("success");
    } catch (error) {
      console.error("Error during scraping:", error);
      
      toast({
        title: "Error",
        description: "An error occurred during scraping. Please try again later.",
        variant: "destructive",
      });
      
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <ApiKeySetup />
      <ScraperForm onSubmit={handleSubmit} isLoading={status === "loading"} />
      <ScraperResults 
        results={results} 
        isLoading={status === "loading"} 
      />
      
      {status === "error" && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mt-6">
          <p className="font-medium">An error occurred during scraping.</p>
          <p className="text-sm mt-1">
            Check your connection and make sure the domain entered is correct.
          </p>
        </div>
      )}
      
      {status === "success" && results.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mt-6">
          <p className="font-medium">No results found.</p>
          <p className="text-sm mt-1">
            Try modifying the search parameters or verify that the domain is correct.
          </p>
        </div>
      )}
    </div>
  );
};
