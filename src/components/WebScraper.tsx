
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ScraperForm } from "./ScraperForm";
import { ScraperResults } from "./ScraperResults";
import { ScraperService } from "@/utils/scraperService";
import { ScraperOptions, ScraperResult, ScraperStatus } from "@/types/scraper";

export const WebScraper = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<ScraperStatus>("idle");
  const [results, setResults] = useState<ScraperResult[]>([]);

  const handleSubmit = async (options: ScraperOptions) => {
    setStatus("loading");
    
    try {
      console.log("Avvio scraping con opzioni:", options);
      
      const scrapedResults = await ScraperService.scrapeWebsite(options);
      setResults(scrapedResults);
      
      if (scrapedResults.length === 0) {
        toast({
          title: "Nessun risultato trovato",
          description: "Lo scraping non ha trovato contenuti. Prova a modificare i parametri.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Scraping completato",
          description: `Trovati ${scrapedResults.length} risultati.`,
        });
      }
      
      setStatus("success");
    } catch (error) {
      console.error("Errore durante lo scraping:", error);
      
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante lo scraping. Riprova più tardi.",
        variant: "destructive",
      });
      
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <ScraperForm onSubmit={handleSubmit} isLoading={status === "loading"} />
      <ScraperResults 
        results={results} 
        isLoading={status === "loading"} 
      />
      
      {status === "error" && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mt-6">
          <p className="font-medium">Si è verificato un errore durante lo scraping.</p>
          <p className="text-sm mt-1">
            Verifica la connessione e assicurati che il dominio inserito sia corretto.
          </p>
        </div>
      )}
      
      {status === "success" && results.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mt-6">
          <p className="font-medium">Nessun risultato trovato.</p>
          <p className="text-sm mt-1">
            Prova a modificare i parametri di ricerca o verifica che il dominio sia corretto.
          </p>
        </div>
      )}
    </div>
  );
};
