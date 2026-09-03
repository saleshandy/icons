import { babel } from '@rollup/plugin-babel';
import filesize from 'rollup-plugin-filesize';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'esm',
      },
      // CJS build for Node-style resolvers (Vitest, Jest, plain require).
      // Must use the .cjs extension: package.json sets "type": "module",
      // so a .js file here would be parsed as ESM.
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        exports: 'named',
      },
    ],

    external: [/@babel\/runtime/, 'react', 'typescript'],
    plugins: [
      babel({
        babelHelpers: 'runtime',
        plugins: [
          '@babel/plugin-transform-runtime',
          '@babel/plugin-transform-typescript',
        ],
      }),
      typescript({ tsconfig: './tsconfig.json' }),
      filesize(),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    // Same declarations emitted twice. The .d.cts copy is what TypeScript
    // loads for CJS consumers on moduleResolution node16/nodenext; without
    // it they hit TS1479 ("cannot be imported with 'require'").
    output: [
      { file: 'dist/index.d.ts', format: 'esm' },
      { file: 'dist/index.d.cts', format: 'esm' },
    ],
    external: [/\.css$/],
    plugins: [dts()],
  },
];

export default config;
