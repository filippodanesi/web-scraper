
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScraperResult } from "@/types/scraper";
import { FirecrawlService } from "@/utils/firecrawlService";
import { Download } from "lucide-react";

interface ScraperResultsProps {
  results: ScraperResult[];
  isLoading: boolean;
}

export const ScraperResults = ({ results, isLoading }: ScraperResultsProps) => {
  if (isLoading) {
    return (
      <Card className="w-full shadow-sm border-gray-200 dark:border-gray-800 mt-6">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 rounded-t-lg">
          <CardTitle className="text-black dark:text-white text-xl font-bold flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Executing scraping...
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          <div className="space-y-4">
            <div className="w-full h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse-slow"></div>
            <div className="w-full h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse-slow"></div>
            <div className="w-3/4 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse-slow"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results.length) {
    return null;
  }

  const handleDownload = () => {
    FirecrawlService.downloadAsTextFile(results);
  };

  return (
    <Card className="w-full shadow-sm border border-gray-200 dark:border-gray-800 mt-6">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 rounded-t-lg">
        <CardTitle className="text-black dark:text-white text-xl font-bold">
          Scraping Results ({results.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="preview">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="urls">URLs ({results.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-6">
            {results.slice(0, 3).map((result, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white dark:bg-black dark:border-gray-800">
                <h3 className="font-semibold text-lg text-black dark:text-white mb-2">{result.title}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="font-medium">URL:</span> {result.url}
                </div>
                <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 mt-3 border-t dark:border-gray-800 pt-3">
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
            <div className="border rounded-lg overflow-hidden dark:border-gray-800">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 border-b dark:border-gray-800">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">URLs found</h3>
              </div>
              <div className="divide-y dark:divide-gray-800 max-h-[400px] overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-900">
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
      </CardContent>
      
      <CardFooter className="bg-gray-50 dark:bg-gray-900 py-4 rounded-b-lg">
        <Button
          onClick={handleDownload}
          className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 flex items-center justify-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Results (TXT)
        </Button>
      </CardFooter>
    </Card>
  );
};
