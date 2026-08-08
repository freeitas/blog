import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      ".next/**",
      ".velite/**",
      "public/static/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default config;
