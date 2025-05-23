import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.esm.js',
                format: 'esm',
                sourcemap: true
            },
            {
                file: 'dist/index.cjs.js',
                format: 'cjs',
                sourcemap: true,
                exports: 'auto'
            }
        ],
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
            terser()
        ]
    }
];
