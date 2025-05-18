import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['dist/**/*', 'node_modules/**/*', 'coverage/**/*'],

        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json'
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            prettier: eslintPluginPrettier
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...eslintConfigPrettier.rules,
            'prettier/prettier': 'error',
            'no-console': 'off'
        }
    }
];
