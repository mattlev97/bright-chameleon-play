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
      // Usiamo SmolLM-135M-Instruct: piccolo, veloce e ottimizzato per WebGPU
      const pipe = await pipeline('text-generation', 'HuggingFaceTB/SmolLM2-135M-Instruct', {
        device: 'webgpu', // Forza l'uso della GPU se disponibile
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
      console.warn("WebGPU non supportato o errore, provo fallback WASM...", err);
      try {
        // Fallback su CPU (WASM) se WebGPU fallisce
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
        console.error("Errore totale:", fallbackErr);
        setError(true);
        setLoading(false);
        setStatus('Errore di caricamento');
      }
    }
  }, [generator, loading, ready]);

  const askBibi = async (prompt: string, context: string) => {
    if (!generator) return "Non sono ancora pronta!";
    try {
      const messages = [
        { role: "system", content: `Sei Bibi, un assistente finanziario gentile. Rispondi in italiano in modo breve. ${context}` },
        { role: "user", content: prompt }
      ];

      const output = await generator(messages, { 
        max_new_tokens: 100,
        temperature: 0.6,
        do_sample: true
      });
      
      return output[0].generated_text[output[0].generated_text.length - 1].content;
    } catch (err) {
      console.error("Generation error:", err);
      return "Ho avuto un piccolo corto circuito. Riprova?";
    }
  };

  return { loadModel, askBibi, clearCache, loading, ready, error, progress, status };
}