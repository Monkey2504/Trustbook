import { GoogleGenAI } from "@google/genai";
import { Challenge } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const consultAdvisor = async (challenge: Challenge, userQuery?: string): Promise<string> => {
  try {
    const ai = getClient();
    
    // Prompt radicalement différent : posture critique et sociologique
    let prompt = `
      Tu n'es pas un assistant commercial. Tu es un sociologue critique et un analyste des systèmes de pouvoir (inspiré par Foucault, Bourdieu ou Forensic Architecture).
      
      Nous analysons un projet controversé : "Registre de Fiabilité Public".
      
      Analyse ce point de tension :
      TITRE: ${challenge.title}
      PROBLÈME: ${challenge.problem}
      QUESTION: ${challenge.question}
      PISTE ACTUELLE: ${challenge.solution}
      
      Ta mission :
      1. Déconstruis la solution proposée. Pourquoi est-elle insuffisante ou dangereuse ?
      2. Mets en lumière les "impensés" (ce que le système ne voit pas).
      3. Propose une approche radicalement différente qui privilégie l'humain sur la donnée.
      
      Ton ton doit être : Clinique, précis, sans concession. Pas de "marketing speak". Utilise un vocabulaire précis.
    `;

    if (userQuery) {
        prompt = `
        CONTEXTE D'ENQUÊTE : ${challenge.title}
        PROBLÉMATIQUE : ${challenge.problem}
        
        INTERPELLATION CITOYENNE : "${userQuery}"
        
        Réponds en mettant en évidence les rapports de force, les risques démocratiques ou les biais sociaux implicites dans cette question.
        `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analyse impossible. Données insuffisantes.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connexion au système d'analyse critique interrompue.";
  }
};