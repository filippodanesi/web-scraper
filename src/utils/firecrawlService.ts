import { ScraperOptions, ScraperResult } from "@/types/scraper";

interface FirecrawlResponse {
  success: boolean;
  data?: any[];
  error?: string;
}

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
    
    // For now, we'll simulate the crawling process
    // In a real implementation, this would make API calls to Firecrawl
    
    // Simulate an API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create some mock results
    const results: ScraperResult[] = [];
    
    const baseUrl = `https://${options.domain}`;
    const pagesToCreate = Math.min(options.maxPages || 10, 20); // Limit for demo
    
    // Check if we need to filter by directories
    const includeDirs = options.includeDirectories 
      ? options.includeDirectories.split(',').map(dir => dir.trim()) 
      : [];
    
    const excludeDirs = options.excludeDirectories
      ? options.excludeDirectories.split(',').map(dir => dir.trim())
      : [];
    
    // Create mock pages
    for (let i = 0; i < pagesToCreate; i++) {
      // Determine page path
      let pagePath = '';
      
      if (includeDirs.length > 0) {
        // If include directories specified, use one of them
        const dirIndex = Math.floor(Math.random() * includeDirs.length);
        pagePath = `/${includeDirs[dirIndex]}/page-${i + 1}`;
      } else {
        // Otherwise, create random paths avoiding excluded dirs
        const possibleSections = ['about', 'products', 'services', 'blog', 'news', 'contact'];
        const filteredSections = possibleSections.filter(
          section => !excludeDirs.includes(section)
        );
        
        if (filteredSections.length > 0) {
          const sectionIndex = Math.floor(Math.random() * filteredSections.length);
          pagePath = `/${filteredSections[sectionIndex]}/page-${i + 1}`;
        } else {
          pagePath = `/page-${i + 1}`;
        }
      }
      
      // Skip if path contains excluded directory
      if (excludeDirs.some(dir => pagePath.includes(`/${dir}/`))) {
        continue;
      }
      
      // Create the result
      results.push({
        url: `${baseUrl}${pagePath}`,
        title: `Page ${i + 1}: ${options.domain}${pagePath}`,
        content: `This is the content for ${pagePath}. It would contain the actual text scraped from the webpage in a real implementation. The Firecrawl API would extract this text from the actual page content, focusing on the main content area and avoiding navigation, headers, footers, etc.`,
        timestamp: new Date().toISOString(),
      });
    }
    
    console.log(`Returning ${results.length} mock results`);
    return results;
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
