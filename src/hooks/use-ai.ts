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
    
    try {
      const pipe = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-78M', {
        progress_callback: (p: any) => {
          if (p.status === 'progress') {
            setProgress(p.progress);
            setStatus(`Scaricando componenti... ${Math.round(p.progress)}%`);
          } else if (p.status === 'done') {
            setStatus('Elaborazione file...');
          } else if (p.status === 'init') {
            setStatus('Avvio motore IA...');
          } else if (p.status === 'ready') {
            setStatus('Bibi è pronta!');
          }
        }
      });
      
      setGenerator(() => pipe);
      setReady(true);
      setStatus('Pronto');
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
      const fullPrompt = `System: You are Bibi, a helpful financial assistant. Answer in Italian if possible.
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