import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
	// depending on your application, base can also be "/"
	base: '',
	plugins: [
		svgr({
			svgrOptions: { exportType: 'named', ref: true, svgo: false, titleProp: true },
			include: '**/*.svg',
		}),
		react()],
	server: {
		// this ensures that the browser opens upon server start
		open: true,
		// this sets a default port to 3000  
		port: 3000,
	},
})
