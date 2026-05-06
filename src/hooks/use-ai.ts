"use client";

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
    
    // Mappa per tracciare il progresso di ogni file
    const fileProgress: Record<string, number> = {};
    
    try {
      const pipe = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-78M', {
        progress_callback: (p: any) => {
          fileProgress[p.file] = p.progress || 0;

          // Calcoliamo il progresso basandoci sulla fase
          if (p.status === 'init') {
            setStatus('Preparazione download...');
            setProgress(2);
          } else if (p.status === 'progress') {
            // Identifichiamo se è il file pesante (il modello)
            const isModelFile = p.file.includes('model.safetensors') || p.file.includes('pytorch_model.bin');
            
            if (isModelFile) {
              // Il modello pesa circa il 90% del totale. 
              // Facciamo partire la barra dal 10% e la portiamo al 95% durante il download del modello.
              const modelProgress = 10 + (p.progress * 0.85);
              setProgress(Math.round(modelProgress));
              setStatus(`Scaricando il cervello di Bibi... ${Math.round(p.progress)}%`);
            } else {
              // Per i file piccoli (tokenizer, config), avanziamo lentamente nel primo 10%
              // Contiamo quanti file piccoli abbiamo visto
              const smallFilesCount = Object.keys(fileProgress).filter(f => !f.includes('model')).length;
              const smallProgress = Math.min(10, smallFilesCount * 2 + (p.progress * 0.02));
              setProgress(Math.round(smallProgress));
              setStatus(`Caricamento configurazione: ${p.file}`);
            }
          } else if (p.status === 'done') {
            // Quando un file è finito, diamo un piccolo scatto
            if (p.file.includes('model')) {
              setProgress(95);
              setStatus('Modello scaricato. Installazione...');
            }
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
      setStatus('Errore: riprova più tardi');
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