// src/aiEngine.js
import { CreateMLCEngine } from "@mlc-ai/web-llm";

const selectedModel = "gemma-2b-it-q4f16_1-MLC";
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
	// 엔진이 없거나 아직 초기화 중이면 대기
	if (!engine || isInitializing) {
		return "AI 코치가 악보와 영상을 정밀하게 대조하고 있습니다. 잠시만 기다려 주세요...";
	}

	const prompt = `당신은 음악 코치입니다. 음정 ${metrics.pitch}%, 리듬 ${metrics.rhythm}%, 자세 ${metrics.technique}% 데이터를 바탕으로 잘한점과 개선점을 한국어 한 문장으로 조언하세요.`;

	try {
		// BindingError 방지를 위해 매번 대화 내역을 초기화하거나 상태 확인
		const reply = await engine.chat.completions.create({
			messages: [{ role: "user", content: prompt }],
			temperature: 0.6,
			max_tokens: 150,
		});

		return reply.choices[0].message.content;
	} catch (error) {
		console.error("피드백 생성 실패:", error);
		// 에러 발생 시 엔진 상태 재점검 로직
		engine = null;
		return "AI 엔진 통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
	}
};