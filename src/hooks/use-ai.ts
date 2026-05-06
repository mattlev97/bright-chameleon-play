import { useState, useCallback } from 'react';
import { pipeline } from '@xenova/transformers';

export function useAI() {
  const [generator, setGenerator] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const loadModel = useCallback(async () => {
    if (generator || loading) return;
    
    setLoading(true);
    try {
      // Utilizziamo un modello estremamente leggero (78M parametri, ~80MB)
      // Ottimizzato per task di text-to-text generation
      const pipe = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-78M', {
        progress_callback: (p: any) => {
          if (p.status === 'progress') setProgress(p.progress);
        }
      });
      
      setGenerator(() => pipe);
      setReady(true);
    } catch (err) {
      console.error("Errore caricamento AI locale:", err);
    } finally {
      setLoading(false);
    }
  }, [generator, loading]);

  const askBibi = async (prompt: string, context: string) => {
    if (!generator) return "Sto ancora caricando il mio cervello... riprova tra un istante!";
    
    try {
      // Costruiamo un prompt che dia personalità a Bibi e fornisca il contesto finanziario
      const fullPrompt = `System: You are Bibi, a friendly financial assistant for a budget app. 
      Context: ${context}
      User: ${prompt}
      Bibi:`;

      const output = await generator(fullPrompt, {
        max_new_tokens: 60,
        temperature: 0.7,
        repetition_penalty: 1.2,
      });

      return output[0].generated_text;
    } catch (err) {
      console.error("Errore generazione risposta:", err);
      return "Scusa, ho avuto un piccolo corto circuito mentale. Riprova?";
    }
  };

  return { loadModel, askBibi, loading, ready, progress };
}