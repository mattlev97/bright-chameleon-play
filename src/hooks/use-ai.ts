"use client";

import { useState, useCallback } from 'react';
import { pipeline, env } from '@xenova/transformers';

// Configurazione per assicurarsi che il download avvenga correttamente nel browser
env.allowLocalModels = false;
env.useBrowserCache = true;

export function useAI() {
  const [generator, setGenerator] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const loadModel = useCallback(async () => {
    if (generator || loading) return;
    
    setLoading(true);
    setStatus('Connessione ai server IA...');
    console.log("Bibi AI: Inizio caricamento modello...");
    
    try {
      const pipe = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-78M', {
        progress_callback: (p: any) => {
          // Logghiamo in console per debug reale
          console.log(`Bibi AI Progress [${p.status}]: ${p.file || ''}`, p.progress || '');

          if (p.status === 'init') {
            setStatus('Ricerca file del cervello...');
            setProgress(2);
          } else if (p.status === 'progress') {
            const isModel = p.file.includes('model') || p.file.includes('weights');
            
            if (isModel) {
              const modelProgress = 10 + (p.progress * 0.85);
              setProgress(Math.round(modelProgress));
              setStatus(`Download cervello: ${Math.round(p.progress)}%`);
            } else {
              setStatus(`Caricamento configurazione...`);
              setProgress(prev => Math.min(10, prev + 1));
            }
          } else if (p.status === 'done') {
            console.log(`Bibi AI: File ${p.file} scaricato con successo.`);
          } else if (p.status === 'ready') {
            console.log("Bibi AI: Modello pronto all'uso!");
            setProgress(100);
            setStatus('Bibi è sveglia!');
          }
        }
      });
      
      setGenerator(() => pipe);
      setReady(true);
    } catch (err) {
      console.error("Bibi AI Error:", err);
      setStatus('Errore di connessione. Riprova.');
      setLoading(false);
    }
  }, [generator, loading]);

  const askBibi = async (prompt: string, context: string) => {
    if (!generator) return "Sto ancora caricando... un attimo!";
    
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
      console.error("Bibi AI Generation Error:", err);
      return "Ho avuto un piccolo vuoto di memoria. Puoi ripetere?";
    }
  };

  return { loadModel, askBibi, loading, ready, progress, status };
}