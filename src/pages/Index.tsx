
import { WebScraper } from "@/components/WebScraper";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-3">
            Web Content Scraper
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Extract and analyze text content from any website. Simply enter a URL and receive clean, formatted text from web pages for research, analysis, or content aggregation.
          </p>
        </header>
        
        <WebScraper />
        
        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>
            Powered by <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:underline">Firecrawl</a>
          </p>
          <p className="mt-2">
            <a href="https://docs.firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:underline">
              API Documentation
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
