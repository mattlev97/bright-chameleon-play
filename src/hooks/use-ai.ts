"use client";

import { useState, useCallback } from 'react';
import { pipeline, env } from '@xenova/transformers';

// Configurazione aggressiva per il download
env.allowLocalModels = false;
env.useBrowserCache = true;
env.remoteHost = 'https://huggingface.co';
env.remotePathTemplate = '{model}/resolve/{revision}/{file}';

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
      console.log("Bibi AI: Cache pulita con successo");
      setError(false);
      setProgress(0);
      setStatus('Cache pulita. Pronto a riprovare.');
    } catch (e) {
      console.error("Errore pulizia cache:", e);
    }
  };

  const loadModel = useCallback(async () => {
    if (generator || loading || ready) return;
    
    setLoading(true);
    setError(false);
    setStatus('Connessione ai server...');
    
    try {
      const pipe = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-78M', {
        progress_callback: (p: any) => {
          if (p.status === 'progress') {
            const isModel = p.file.includes('model') || p.file.includes('weights');
            if (isModel) {
              setProgress(Math.round(10 + (p.progress * 0.85)));
              setStatus(`Download: ${Math.round(p.progress)}%`);
            } else {
              setProgress(prev => Math.min(10, prev + 1));
              setStatus('Configurazione...');
            }
          } else if (p.status === 'ready') {
            setProgress(100);
            setStatus('Bibi è pronta!');
            setReady(true);
            setLoading(false);
          }
        }
      });
      
      setGenerator(() => pipe);
    } catch (err) {
      console.error("Bibi AI Error:", err);
      setError(true);
      setLoading(false);
      setStatus('Errore di connessione');
    }
  }, [generator, loading, ready]);

  const askBibi = async (prompt: string, context: string) => {
    if (!generator) return "Non sono ancora pronta!";
    try {
      const fullPrompt = `System: You are Bibi, a helpful financial assistant. Answer in Italian. Context: ${context} User: ${prompt} Bibi:`;
      const output = await generator(fullPrompt, { max_new_tokens: 100, temperature: 0.7 });
      return output[0].generated_text;
    } catch (err) {
      return "Ho avuto un problema tecnico. Riprova?";
    }
  };

  return { loadModel, askBibi, clearCache, loading, ready, error, progress, status };
}