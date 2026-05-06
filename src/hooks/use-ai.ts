import { useState, useCallback } from 'react';
import { pipeline } from '@xenova/transformers';

export function useAI() {
  const [generator, setGenerator] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const loadModel = useCallback(async () => {
    if (generator || loading) return;
    
    setLoading(true);
    setStatus('Inizializzazione...');
    
    // Mappa per tracciare il progresso di ogni singolo file
    const fileProgress: Record<string, number> = {};
    
    try {
      const pipe = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-78M', {
        progress_callback: (p: any) => {
          if (p.status === 'progress') {
            // Salviamo il progresso del file specifico
            fileProgress[p.file] = p.progress;
            
            // Calcoliamo una media pesata. Sappiamo che ci sono circa 5-7 file.
            // Il file del modello è quello che pesa il 95% del totale.
            const fileNames = Object.keys(fileProgress);
            const totalFiles = fileNames.length;
            
            // Se stiamo scaricando il file principale (solitamente finisce in .bin o .safetensors)
            // gli diamo più importanza nel calcolo del progresso
            const isMainModel = p.file.includes('model') || p.file.includes('weights');
            
            if (isMainModel) {
              // Il modello principale guida la barra dal 10% al 100%
              const globalProgress = 10 + (p.progress * 0.9);
              setProgress(Math.round(globalProgress));
            } else {
              // I file piccoli (config, tokenizer) occupano il primo 10%
              const smallFilesProgress = (totalFiles / 5) * 10;
              setProgress(Math.min(10, Math.round(smallFilesProgress)));
            }

            setStatus(`Scaricando ${p.file}... ${Math.round(p.progress)}%`);
          } else if (p.status === 'done') {
            setStatus(`Completato: ${p.file}`);
          } else if (p.status === 'ready') {
            setProgress(100);
            setStatus('Bibi è pronta!');
          }
        }
      });
      
      setGenerator(() => pipe);
      setReady(true);
    } catch (err) {
      console.error("Errore caricamento AI locale:", err);
      setStatus('Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  }, [generator, loading]);

  const askBibi = async (prompt: string, context: string) => {
    if (!generator) return "Sto ancora caricando il mio cervello... riprova tra un istante!";
    
    try {
      const fullPrompt = `System: You are Bibi, a helpful financial assistant. Answer in Italian.
      Context: ${context}
      User: ${prompt}
      Bibi:`;

      const output = await generator(fullPrompt, {
        max_new_tokens: 100,
        temperature: 0.7,
        repetition_penalty: 1.2,
      });

      return output[0].generated_text;
    } catch (err) {
      console.error("Errore generazione risposta:", err);
      return "Scusa, ho avuto un piccolo corto circuito mentale. Riprova?";
    }
  };

  return { loadModel, askBibi, loading, ready, progress, status };
}