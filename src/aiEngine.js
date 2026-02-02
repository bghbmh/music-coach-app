// src/aiEngine.js
import { CreateMLCEngine } from "@mlc-ai/web-llm";

//const selectedModel = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
//const selectedModel = "gemma-2b-it-q4f16_1-MLC";
const selectedModel = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC"; // 매우 가벼움 - TinyLlama
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

export const generateMusicFeedback = async (metrics) => {
	if (!engine || isInitializing) return "분석 중...";

	// 💡 예시 문장을 삭제하고, 점수 데이터를 직접적으로 해석하도록 지시합니다.
	const prompt = `
    당신은 음악 코치입니다. 아래 데이터를 분석하여 한국어로만 조언하세요.
    데이터: 음정 ${metrics.pitch}%, 리듬 ${metrics.rhythm}%, 자세 ${metrics.technique}%
    `;

	try {
		const reply = await engine.chat.completions.create({
			messages: [
				{ role: "system", content: "한국어 음악 교육 전문가로서 간결하게 답변합니다." },
				{ role: "user", content: prompt }
			],
			temperature: 0.5, // 0.2보다 조금 높여서 예시를 베끼지 않고 문장을 생성하게 합니다.
			max_tokens: 300,
		});

		return reply.choices[0].message.content;
	} catch (error) {
		console.error("피드백 생성 실패:", error);
		return "AI 엔진 통신 오류가 발생했습니다.";
	}
};
