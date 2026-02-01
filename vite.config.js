import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Virtousto Music Coach',
				short_name: 'MusicCoach',
				description: 'AI 기반 악보 및 연주 분석 코치',
				theme_color: '#121418',
				icons: [
					{
						src: 'pwa-192x192.png', // public 폴더에 실제 아이콘 파일이 있어야 합니다.
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	],
	optimizeDeps: {
		// 이 부분이 핵심입니다! 최신 라이브러리들을 Vite가 미리 처리하도록 합니다.
		include: [
			'@tensorflow/tfjs',
			'@tensorflow-models/pose-detection',
			'@mediapipe/pose'
		]
	},
	build: {
		commonjsOptions: {
			include: [/node_modules/], // 옛날 방식의 모듈도 호환되게 처리
		}
	}
})