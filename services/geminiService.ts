import { GoogleGenAI, Type } from "@google/genai";
import { BiasDetectorResponse, ScenarioContext } from "../types";

const parseBiasResponse = (text: string): BiasDetectorResponse => {
  try {
    // Clean up potential markdown code blocks
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText) as BiasDetectorResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    // Return a fallback error state
    return {
      overallScore: 0,
      summary: "Error analyzing the text. Please try again.",
      biases: [],
      metrics: { rationality: 0, objectivity: 0, completeness: 0 },
      correction: "N/A"
    };
  }
};

export const analyzeDecisionBias = async (
  text: string, 
  context: ScenarioContext
): Promise<BiasDetectorResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const contextPrompt = context !== ScenarioContext.NONE 
    ? `The decision maker is under: ${context}.` 
    : "";

  const systemInstruction = `
    You are an advanced Cognitive Science AI designed to audit human decision-making.
    Your goal is to detect cognitive biases (e.g., Confirmation Bias, Anchoring, Sunk Cost, Availability Heuristic, Framing Effect, etc.) in the provided text.
    
    You must output strictly valid JSON.
    
    Analyze the text for:
    1. Implicit and explicit biases.
    2. Logical fallacies.
    3. Emotional reasoning vs. data-driven reasoning.

    Output Schema:
    {
      "overallScore": integer (0-100, where 100 is perfectly unbiased and rational),
      "summary": string (A concise 1-sentence executive summary of the bias level),
      "biases": array of objects {
         "name": string (Name of the bias),
         "description": string (Brief explanation of why it applies here),
         "confidence": integer (0-100),
         "triggerPhrase": string (Exact quote from the text that indicates this bias)
      },
      "metrics": {
         "rationality": integer (0-100),
         "objectivity": integer (0-100),
         "completeness": integer (0-100)
      },
      "correction": string (A rewritten version of the decision/thought process that removes the bias while keeping the core intent, if valid. If the core intent is flawed, provide a counter-recommendation.)
    }
  `;

  const prompt = `
    ${contextPrompt}
    
    Analyze the following decision text:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            biases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  confidence: { type: Type.INTEGER },
                  triggerPhrase: { type: Type.STRING },
                },
                required: ["name", "description", "confidence", "triggerPhrase"]
              },
            },
            metrics: {
              type: Type.OBJECT,
              properties: {
                rationality: { type: Type.INTEGER },
                objectivity: { type: Type.INTEGER },
                completeness: { type: Type.INTEGER },
              },
              required: ["rationality", "objectivity", "completeness"]
            },
            correction: { type: Type.STRING },
          },
          required: ["overallScore", "summary", "biases", "metrics", "correction"]
        }
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("Empty response from AI");
    }

    return parseBiasResponse(outputText);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
