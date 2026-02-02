// src/aiEngine.js
import { CreateMLCEngine } from "@mlc-ai/web-llm";

const selectedModel = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
//const selectedModel = "gemma-2b-it-q4f16_1-MLC";
//const selectedModel = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC"; // 매우 가벼움 - TinyLlama
//const selectedModel = "Qwen2-0.5B-Instruct-q4f16_1-MLC"; //가장 가벼움 - Qwen


let engine = null;
let isInitializing = false; // 초기화 중복 방지

export const initLLM = async (onProgress) => {
	if (engine) return engine;
	if (isInitializing) return;

	isInitializing = true;
	try {
		engine = await CreateMLCEngine(selectedModel, {
			initProgressCallback: onProgress,
		});
		isInitializing = false;
		return engine;
	} catch (error) {
		isInitializing = false;
		console.error("LLM 초기화 에러:", error);
		throw error;
	}
};

// src/aiEngine.js 수정
export const generateMusicFeedback = async (metrics) => {
	if (!engine || isInitializing) return "Analyzing...";

	// 💡 번역 지시를 완전히 배제하고, 영어로만 전문적인 분석을 요청합니다.
	const prompt = `
    You are a world-class music conservatory professor. 
    Analyze the following performance data and provide professional, constructive feedback.

    [Performance Data]
    - Pitch Accuracy: ${metrics.pitch}%
    - Rhythm Precision: ${metrics.rhythm}%

    [Instructions]
    1. Evaluate each category in depth.
    2. If the score is below 80, provide a specific technical exercise to improve.
    3. If the score is above 90, suggest how to add artistic expression.
    4. Provide the response in exactly two sections: 'Pitch:' and 'Rhythm:'.

    Response (English Only):
    `;

	try {
		const reply = await engine.chat.completions.create({
			messages: [
				{ role: "system", content: "You are a professional music coach who provides feedback in English." },
				{ role: "user", content: prompt }
			],
			// 💡 추론의 일관성을 위해 온도를 약간 낮게 유지합니다.
			temperature: 0.5,
			max_tokens: 400,
		});

		return reply.choices[0].message.content;
	} catch (error) {
		console.error("Feedback generation failed:", error);
		return "AI Engine communication error occurred.";
	}
};
