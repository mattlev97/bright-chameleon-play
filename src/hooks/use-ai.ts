"use client";

import { useState, useCallback } from 'react';
import { pipeline, env } from '@huggingface/transformers';

// Configurazione per WebGPU
env.allowLocalModels = false;

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
      setStatus('Cache pulita.');
    } catch (e) {
      console.error("Errore cache:", e);
    }
  };

  const loadModel = useCallback(async () => {
    if (generator || loading || ready) return;
    
    setLoading(true);
    setError(false);
    setStatus('Inizializzazione WebGPU...');
    
    try {
      const pipe = await pipeline('text-generation', 'HuggingFaceTB/SmolLM2-135M-Instruct', {
        device: 'webgpu',
        progress_callback: (p: any) => {
          if (p.status === 'progress') {
            setProgress(Math.round(p.progress));
            setStatus(`Download Modello: ${Math.round(p.progress)}%`);
          } else if (p.status === 'ready') {
            setStatus('Bibi è pronta (WebGPU)!');
            setReady(true);
            setLoading(false);
          }
        }
      });
      
      setGenerator(() => pipe);
    } catch (err) {
      console.warn("WebGPU non supportato, provo fallback WASM...", err);
      try {
        const pipe = await pipeline('text-generation', 'HuggingFaceTB/SmolLM2-135M-Instruct', {
          device: 'wasm',
          progress_callback: (p: any) => {
            if (p.status === 'progress') {
              setProgress(Math.round(p.progress));
              setStatus(`Download (Fallback): ${Math.round(p.progress)}%`);
            }
          }
        });
        setGenerator(() => pipe);
        setReady(true);
        setLoading(false);
      } catch (fallbackErr) {
        setError(true);
        setLoading(false);
        setStatus('Errore di caricamento');
      }
    }
  }, [generator, loading, ready]);

  const askBibi = async (prompt: string, context: string) => {
    if (!generator) return "Non sono ancora pronta!";
    try {
      // Prompt più strutturato per modelli piccoli
      const messages = [
        { 
          role: "system", 
          content: "Tu sei Bibi, un assistente finanziario. Rispondi in italiano in modo brevissimo e cordiale. Usa solo i dati forniti dall'utente." 
        },
        { 
          role: "user", 
          content: `DATI ATTUALI: ${context}\n\nDOMANDA: ${prompt}` 
        }
      ];

      const output = await generator(messages, { 
        max_new_tokens: 60,
        temperature: 0.2, // Più basso = più preciso e meno ripetitivo
        do_sample: false, // Disabilitiamo il sampling per avere risposte più deterministiche
        repetition_penalty: 1.2
      });
      
      const response = output[0].generated_text[output[0].generated_text.length - 1].content;
      return response.trim();
    } catch (err) {
      console.error("Generation error:", err);
      return "Scusa, ho avuto un piccolo problema tecnico. Puoi riprovare?";
    }
  };

  return { loadModel, askBibi, clearCache, loading, ready, error, progress, status };
}