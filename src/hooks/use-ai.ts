"use client";

import { useState, useCallback } from 'react';
import { pipeline, env } from '@xenova/transformers';

// Reset totale delle configurazioni per usare i default della libreria
env.allowLocalModels = false;
env.useBrowserCache = true;

export function useAI() {
  const [generator, setGenerator] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const clearCache = async () => {
    try {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        if (name.includes('transformers')) {
          await caches.delete(name);
        }
      }
      setError(false);
      setProgress(0);
      setStatus('Cache pulita. Riprova.');
    } catch (e) {
      console.error("Errore cache:", e);
    }
  };

  const loadModel = useCallback(async () => {
    if (generator || loading || ready) return;
    
    setLoading(true);
    setError(false);
    setStatus('Inizializzazione...');
    
    try {
      // Usiamo un modello leggermente diverso e molto stabile
      const pipe = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-78M', {
        progress_callback: (p: any) => {
          if (p.status === 'progress') {
            setProgress(Math.round(p.progress));
            setStatus(`Scaricamento: ${Math.round(p.progress)}%`);
          } else if (p.status === 'ready') {
            setReady(true);
            setLoading(false);
            setStatus('Bibi è pronta!');
          }
        }
      });
      
      setGenerator(() => pipe);
    } catch (err) {
      console.error("Errore critico Bibi AI:", err);
      setError(true);
      setLoading(false);
      setStatus('Errore di rete');
    }
  }, [generator, loading, ready]);

  const askBibi = async (prompt: string, context: string) => {
    if (!generator) return "Non sono ancora pronta!";
    try {
      const fullPrompt = `Rispondi in italiano. Contest: ${context} Utente: ${prompt} Bibi:`;
      const output = await generator(fullPrompt, { 
        max_new_tokens: 50, 
        temperature: 0.7,
        repetition_penalty: 1.2
      });
      return output[0].generated_text;
    } catch (err) {
      return "Errore nella generazione. Riprova?";
    }
  };

  return { loadModel, askBibi, clearCache, loading, ready, error, progress, status };
}