
export interface ScraperOptions {
  domain: string;
  includeDirectories?: string;
  excludeDirectories?: string;
  maxPages?: number;
}

export interface ScraperResult {
  url: string;
  title: string;
  content: string;
  timestamp: string;
}

export type ScraperStatus = 'idle' | 'loading' | 'success' | 'error';
