
import { WebScraper } from "@/components/WebScraper";

const Index = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Web Content Scraper
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extract text content from specific domains and subfolders to analyze tone of voice with your custom GPT.
          </p>
        </header>
        
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <WebScraper />
        </div>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Powered by <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="underline">Firecrawl</a>
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
