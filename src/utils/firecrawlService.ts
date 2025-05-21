
import { ScraperOptions, ScraperResult } from "@/types/scraper";
import FirecrawlApp from '@mendable/firecrawl-js';

// Define interfaces for the types we need
interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;
type ScrapeFormat = 'markdown' | 'html' | 'text' | 'json';

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async crawlWebsite(options: ScraperOptions): Promise<ScraperResult[]> {
    console.log("Crawling website with options:", options);
    
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("API key not found");
    }
    
    // Initialize Firecrawl client
    const firecrawl = new FirecrawlApp({ apiKey });
    
    try {
      // Build URL with the correct format
      const url = options.domain.startsWith('http') ? options.domain : `https://${options.domain}`;
      
      // Prepare include/exclude directories
      const includePaths = options.includeDirectories ? 
        options.includeDirectories.split(',').map(dir => dir.trim()) : 
        [];
      
      const excludePaths = options.excludeDirectories ? 
        options.excludeDirectories.split(',').map(dir => dir.trim()) : 
        [];
      
      // Set crawl options with proper typing
      const crawlOptions = {
        limit: options.maxPages || 10,
        includePaths: includePaths.length > 0 ? includePaths : undefined,
        excludePaths: excludePaths.length > 0 ? excludePaths : undefined,
        scrapeOptions: {
          formats: ['markdown', 'html'] as ScrapeFormat[]
        }
      };
      
      console.log("Sending crawl request to Firecrawl with URL:", url, "and options:", crawlOptions);
      
      // Make the API call with proper typing
      const crawlResponse = await firecrawl.crawlUrl(url, crawlOptions) as CrawlResponse;
      
      if (!crawlResponse.success) {
        console.error("Firecrawl API error:", (crawlResponse as ErrorResponse).error);
        throw new Error(`API error: ${(crawlResponse as ErrorResponse).error || "Unknown error"}`);
      }
      
      console.log("Firecrawl crawl response:", crawlResponse);
      
      // Transform the crawl results to match our application's expected format
      const results: ScraperResult[] = [];
      
      // Handle the crawl response data with proper type checking
      if (crawlResponse && Array.isArray(crawlResponse.data)) {
        crawlResponse.data.forEach((item: any, index: number) => {
          if (item.metadata && item.markdown) {
            results.push({
              url: item.metadata.sourceURL || `${url}/page-${index+1}`,
              title: item.metadata.title || `Page ${index+1}`,
              content: item.markdown,
              timestamp: new Date().toISOString()
            });
          }
        });
      }
      
      console.log(`Processed ${results.length} results from Firecrawl`);
      return results;
      
    } catch (error) {
      console.error("Error during Firecrawl API call:", error);
      throw error;
    }
  }
  
  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing Firecrawl API key');
      const firecrawl = new FirecrawlApp({ apiKey });
      
      // Make a simple request to test the API key validity
      const testResponse = await firecrawl.scrapeUrl('https://example.com', {
        formats: ['markdown' as ScrapeFormat]
      });
      
      return testResponse.success === true;
    } catch (error) {
      console.error('Error testing Firecrawl API key:', error);
      return false;
    }
  }
  
  static downloadAsTextFile(results: ScraperResult[]): void {
    // Create a text representation of the results
    let textContent = `Scraped Content - ${new Date().toLocaleString()}\n`;
    textContent += `Total Results: ${results.length}\n\n`;
    
    results.forEach((result, index) => {
      textContent += `--- Result ${index + 1} ---\n`;
      textContent += `URL: ${result.url}\n`;
      textContent += `Title: ${result.title}\n`;
      textContent += `Timestamp: ${result.timestamp}\n`;
      textContent += `Content:\n${result.content}\n\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `scraped-content-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}
