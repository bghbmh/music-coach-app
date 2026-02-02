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

export const generateMusicFeedback = async (metrics) => {
	if (!engine || isInitializing) return "분석 중...";

	// 💡 모델이 딴소리 못하게 '예시'를 프롬프트에 직접 박아넣습니다.
	const prompt = `
    Performance Data: Pitch ${metrics.pitch}%, Rhythm ${metrics.rhythm}%, Technique ${metrics.technique}%

    [Task]
    Write exactly 3 lines of feedback in Korean. Use the following format:
    음정: (One sentence about pitch)
    리듬: (One sentence about rhythm)
    자세: (One sentence about technique)

    [Example]
    음정: 음정 처리가 매우 정확하며 소리가 맑습니다.
    리듬: 전반적으로 안정적이나 빠른 구간에서 템포가 당겨지지 않게 주의하세요.
    자세: 활을 긋는 자세가 유연하여 소리에 힘이 실려 있습니다.

    [Output]
    `;

	try {
		const reply = await engine.chat.completions.create({
			messages: [
				{ role: "system", content: "You are a music coach who only speaks Korean." },
				{ role: "user", content: prompt }
			],
			temperature: 0.2, // 0.3보다 더 낮춰서 모델의 헛소리를 원천 차단합니다.
			max_tokens: 300,
		});

		return reply.choices[0].message.content;
	} catch (error) {
		console.error("피드백 생성 실패:", error);
		return "AI 엔진 통신 오류가 발생했습니다.";
	}
};
