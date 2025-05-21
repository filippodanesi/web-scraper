
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    
    // Validazione
    if (!domain) {
      setError("Inserisci un dominio valido");
      return;
    }
    
    // Pulisci il dominio da eventuali "http://" o "https://"
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
    <Card className="w-full shadow-lg border-scraper-300">
      <CardHeader className="bg-scraper-100 rounded-t-lg">
        <CardTitle className="text-scraper-500 text-2xl font-bold">Web Scraper</CardTitle>
        <CardDescription>
          Inserisci i dettagli del sito web di cui desideri fare lo scraping
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="domain" className="text-scraper-500 font-medium">
              Dominio (es. uk.triumph.com)
            </Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Inserisci il dominio"
              className={cn(
                "border-scraper-300 focus:border-scraper-400 focus:ring-scraper-400",
                error && "border-red-500"
              )}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="includeDirectories" className="text-scraper-500 font-medium">
              Directory da includere (opzionale)
            </Label>
            <Input
              id="includeDirectories"
              value={includeDirectories}
              onChange={(e) => setIncludeDirectories(e.target.value)}
              placeholder="es. blog, news (separati da virgole)"
              className="border-scraper-300 focus:border-scraper-400 focus:ring-scraper-400"
            />
            <p className="text-xs text-gray-500">
              Lascia vuoto per eseguire lo scraping dell'intero dominio
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="excludeDirectories" className="text-scraper-500 font-medium">
              Directory da escludere (opzionale)
            </Label>
            <Input
              id="excludeDirectories"
              value={excludeDirectories}
              onChange={(e) => setExcludeDirectories(e.target.value)}
              placeholder="es. admin, cart (separati da virgole)"
              className="border-scraper-300 focus:border-scraper-400 focus:ring-scraper-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPages" className="text-scraper-500 font-medium">
              Numero massimo di pagine
            </Label>
            <Input
              id="maxPages"
              type="number"
              min={1}
              max={100}
              value={maxPages}
              onChange={(e) => setMaxPages(parseInt(e.target.value, 10) || 10)}
              className="border-scraper-300 focus:border-scraper-400 focus:ring-scraper-400"
            />
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 py-4 rounded-b-lg">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-scraper-500 hover:bg-scraper-400 text-white"
          >
            {isLoading ? "Elaborazione in corso..." : "Inizia Scraping"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
