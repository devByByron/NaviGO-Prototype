import { GoogleGenAI, Type } from "@google/genai";
import { AIParseResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

const modelName = "gemini-2.5-flash";

export async function parseShoppingList(
	inputText: string
): Promise<AIParseResult> {
	if (!inputText.trim()) return { items: [] };

	try {
		const response = await ai.models.generateContent({
			model: modelName,
			contents: `You are a shopping assistant. Extract shopping items from the user's input. 
      If the input seems to be a dish or meal name (like "tacos" or "lasagna"), list the common ingredients for that dish.
      Return the result as a JSON object with an 'items' array. 
      Each item should have:
      - name: string (the product name)
      - category: string (broad category like Produce, Dairy, Meat, etc)
      - suggested: boolean (true if it was inferred from a dish name, false if explicitly stated)
      - reason: string (optional, why it was suggested)

      User Input: "${inputText}"`,
			config: {
				responseMimeType: "application/json",
				responseSchema: {
					type: Type.OBJECT,
					properties: {
						items: {
							type: Type.ARRAY,
							items: {
								type: Type.OBJECT,
								properties: {
									name: { type: Type.STRING },
									category: { type: Type.STRING },
									suggested: { type: Type.BOOLEAN },
									reason: { type: Type.STRING },
								},
							},
						},
					},
				},
			},
		});

		const text = response.text;
		if (!text) return { items: [] };

		return JSON.parse(text) as AIParseResult;
	} catch (error) {
		console.error("AI Parse Error:", error);
		// Fallback if AI fails: split by commas or newlines
		const rawItems = inputText
			.split(/,|\n/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
		return {
			items: rawItems.map((name) => ({ name, suggested: false })),
		};
	}
}
