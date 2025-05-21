
import { WebScraper } from "@/components/WebScraper";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-scraper-200 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-scraper-500 mb-4">
            Web Content Scraper
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estrai contenuti testuali da domini e sottocartelle specifiche per analizzare il tone of voice con il tuo GPT personalizzato.
          </p>
        </header>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 sm:p-8 border border-scraper-300/30">
          <WebScraper />
        </div>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Nota: Questo è un simulatore di scraping che opera solo lato client. <br />
            Per uno scraping reale, è necessaria un'implementazione server-side.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
