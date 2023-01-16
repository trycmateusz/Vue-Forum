module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:vue/vue3-recommended'],
	rules: {
		'vue/multi-word-component-names': 0,
		'vue/no-unused-components':
			process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'no-unused-vars': 0,
		quotes: ['error', 'single'],
		semi: ['warn', 'never']
	},
}
