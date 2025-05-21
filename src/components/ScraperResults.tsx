
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScraperResult } from "@/types/scraper";
import { FirecrawlService } from "@/utils/firecrawlService";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ScraperResultsProps {
  results: ScraperResult[];
  isLoading: boolean;
}

export const ScraperResults = ({ results, isLoading }: ScraperResultsProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="mt-6 text-left">
        <div className="flex items-center mb-4">
          <svg className="animate-spin mr-3 h-5 w-5 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="text-xl font-bold text-black dark:text-white">Executing scraping...</h3>
        </div>
        <div className="space-y-4">
          <div className="w-full h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse-slow"></div>
          <div className="w-full h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse-slow"></div>
          <div className="w-3/4 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse-slow"></div>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return null;
  }

  const handleDownload = () => {
    FirecrawlService.downloadAsTextFile(results);
  };

  return (
    <div className="mt-10 text-left">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-black dark:text-white">
            Scraping Results ({results.length})
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="urls">URLs ({results.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="space-y-6">
              {results.slice(0, 3).map((result, index) => (
                <div key={index} className="border-b pb-4 last:border-0 dark:border-gray-800">
                  <h3 className="font-semibold text-lg text-black dark:text-white mb-2">{result.title}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span className="font-medium">URL:</span> {result.url}
                  </div>
                  <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 mt-3">
                    {result.content.slice(0, 200)}...
                  </div>
                </div>
              ))}
              
              {results.length > 3 && (
                <div className="text-center text-gray-500 dark:text-gray-400 italic mt-4">
                  + {results.length - 3} more results (download the file to view them all)
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="urls">
              <div>
                <div className="pb-2 border-b dark:border-gray-800">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">URLs found</h3>
                </div>
                <div className="divide-y dark:divide-gray-800 max-h-[400px] overflow-y-auto">
                  {results.map((result, index) => (
                    <div key={index} className="py-3">
                      <div className="text-sm">
                        <span className="font-medium text-black dark:text-white">{index + 1}.</span>{" "}
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {result.url}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Button
              onClick={handleDownload}
              className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Results (TXT)
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
